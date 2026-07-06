import { ABILITIES, type Ability, type Character, type Skill, PROFICIENCY_BY_LEVEL, mod, SKILL_LIST } from "./dnd-types";
import { getRace } from "../data/races";
import { CLASSES, getClass, getSpellSlots, type SpellSlotsInfo } from "../data/classes";
import { getFeat, getAutoFeats, type AutoFeat } from "../data/feats";
import { getItem, ARMOR_BASE } from "../data/items";
import { getSpell } from "../data/spells";
import { getBackground } from "../data/backgrounds";
import { getFightingStyle } from "../data/fighting-styles";

export interface DerivedStats {
  abilities: Record<Ability, number>;
  abilityMods: Record<Ability, number>;
  proficiencyBonus: number;
  ac: number;
  hpMax: number;
  speed: number;
  initiative: number;
  saves: Record<Ability, number>;
  saveProfs: Record<Ability, boolean>;
  skills: Record<Skill, number>;
  skillProfs: Record<Skill, "none" | "prof" | "exp">;
  passivePerception: number;
  passiveInvestigation: number;
  passiveInsight: number;
  spellSaveDc?: number;
  spellAttackBonus?: number;
  spellcastingAbility?: Ability;
  spellSlots: SpellSlotsInfo;
  walking: { ftPerTurn: number; ftPerMin: number; kmPerHour: number };
  alwaysPreparedSpellIds: string[];
  classResources: { name: string; value: string; recharge: string; desc?: string; className?: string }[];
  actionEconomy: { actions: number; bonusActions: number; reactions: number; extras: string[] };
  asi: { total: number; used: number; remaining: number; levels: number[]; nextAt?: number };
  raceBonuses: Partial<Record<Ability, number>>; // effective racial bonus per ability (post-override)
}

export function calculateCharacter(c: Character): DerivedStats {
  const race = getRace(c.raceId);
  const subrace = race?.subraces?.find(s => s.id === c.subraceId);
  const cls = getClass(c.classId);
  const sub = cls?.subclasses.find(s => s.id === c.subclassId);
  const bg = getBackground(c.backgroundId);
  const level = Math.max(1, Math.min(20, c.level || 1));

  // Base abilities
  const abilities: Record<Ability, number> = { ...c.baseAbilities };

  // Effective race bonuses (respecting per-ability overrides).
  const raceBonuses: Partial<Record<Ability, number>> = {};
  const addRaceBonus = (a: Ability, amt: number) => { raceBonuses[a] = (raceBonuses[a] ?? 0) + amt; };
  race?.abilityBonuses.forEach(b => addRaceBonus(b.ability, b.amount));
  subrace?.abilityBonuses.forEach(b => addRaceBonus(b.ability, b.amount));
  // Apply overrides — if defined for an ability, replace the computed sum.
  for (const a of ABILITIES) {
    const ov = c.raceAbilityBonusOverrides?.[a];
    if (ov !== undefined) raceBonuses[a] = ov;
    if (raceBonuses[a]) abilities[a] = (abilities[a] ?? 10) + (raceBonuses[a] ?? 0);
  }

  // Feats
  c.featIds.forEach(id => {
    const f = getFeat(id);
    f?.bonuses?.ability?.forEach(b => { abilities[b.ability] += b.amount; });
  });

  // Items (equipped)
  c.itemIds.filter(x => x.equipped).forEach(({ id }) => {
    const item = getItem(id);
    if (!item?.bonuses) return;
    item.bonuses.ability?.forEach(b => { abilities[b.ability] += b.amount; });
    if (item.bonuses.setAbility) {
      for (const [k, v] of Object.entries(item.bonuses.setAbility)) {
        if (abilities[k as Ability] < (v as number)) abilities[k as Ability] = v as number;
      }
    }
  });

  // Cap 30
  for (const a of ABILITIES) {
    abilities[a] = Math.max(1, Math.min(30, abilities[a] ?? 10));
    // Manual override
    if (c.manualOverrides?.abilities?.[a] !== undefined) abilities[a] = c.manualOverrides.abilities[a]!;
  }

  const abilityMods = ABILITIES.reduce((o, a) => { o[a] = mod(abilities[a]); return o; }, {} as Record<Ability, number>);

  const proficiencyBonus = c.manualOverrides?.proficiencyBonus ?? PROFICIENCY_BY_LEVEL[level];

  // HP
  const conMod = abilityMods.con;
  let hpMax = (cls?.hitDie ?? 8) + conMod;
  for (let lvl = 2; lvl <= level; lvl++) {
    hpMax += Math.floor(((cls?.hitDie ?? 8) / 2) + 1) + conMod;
  }
  // Race HP bonuses (Hill Dwarf +1/level)
  if (c.subraceId === "hill-dwarf") hpMax += level;
  if (c.raceId === "sorcerer-draconic" /* handled via subclass */) {/* */}
  if (c.classId === "sorcerer" && c.subclassId === "draconic") hpMax += level;
  // Feats
  c.featIds.forEach(id => {
    const f = getFeat(id);
    if (f?.bonuses?.hpPerLevel) hpMax += f.bonuses.hpPerLevel * level;
    if (f?.bonuses?.hpFlat) hpMax += f.bonuses.hpFlat;
  });
  // Items
  c.itemIds.filter(x => x.equipped).forEach(({ id }) => {
    const item = getItem(id);
    if (item?.bonuses?.hpFlat) hpMax += item.bonuses.hpFlat;
  });
  if (c.hpMax !== undefined && c.hpMax > 0) hpMax = c.hpMax;

  // AC
  let ac = 10 + abilityMods.dex; // unarmored
  let armorBonus = 0;
  let hasShield = false;
  let armored = false;
  c.itemIds.filter(x => x.equipped).forEach(({ id }) => {
    const item = getItem(id);
    if (!item?.bonuses) return;
    if (item.bonuses.acFormula) {
      const base = ARMOR_BASE[item.bonuses.acFormula];
      if (base) {
        ac = base.base + (base.addDex ? (base.dexCap !== undefined ? Math.min(abilityMods.dex, base.dexCap) : abilityMods.dex) : 0);
        armored = true;
      }
    }
    if (item.bonuses.shield) hasShield = true;
    if (item.bonuses.acBonus) armorBonus += item.bonuses.acBonus;
  });
  if (hasShield) ac += 2;
  ac += armorBonus;
  // Fighting style — Defense/Mariner: +1 AC when wearing armor
  (c.fightingStyleIds ?? []).forEach(id => {
    const fs = getFightingStyle(id);
    if (fs?.bonuses?.acWhenArmored && armored) ac += fs.bonuses.acWhenArmored;
  });
  // Barbarian unarmored
  if (!armored && c.classId === "barbarian") ac = 10 + abilityMods.dex + abilityMods.con + (hasShield ? 2 : 0) + armorBonus;
  // Monk unarmored
  if (!armored && !hasShield && c.classId === "monk") ac = 10 + abilityMods.dex + abilityMods.wis + armorBonus;
  // Thri-kreen chameleon carapace +2 natural AC when not wearing armor
  if (!armored && c.raceId === "thri-kreen") ac += 2;
  // Warforged +1
  if (c.raceId === "warforged") ac += 1;
  // Tortle natural 17
  if (!armored && c.raceId === "tortle") ac = Math.max(ac, 17 + armorBonus);

  if (c.acOverride !== undefined && c.acOverride > 0) ac = c.acOverride;

  // Speed
  let speed = race?.speed ?? 30;
  c.featIds.forEach(id => {
    const f = getFeat(id);
    if (f?.bonuses?.speed) speed += f.bonuses.speed;
  });
  c.itemIds.filter(x => x.equipped).forEach(({ id }) => {
    const item = getItem(id);
    if (item?.bonuses?.speed) speed += item.bonuses.speed;
  });
  if (c.classId === "barbarian" && level >= 5) speed += 10;
  if (c.classId === "monk") {
    const ext = level >= 18 ? 30 : level >= 14 ? 25 : level >= 10 ? 20 : level >= 6 ? 15 : level >= 2 ? 10 : 0;
    speed += ext;
  }
  if (c.speedOverride !== undefined && c.speedOverride > 0) speed = c.speedOverride;

  // Initiative
  let initiative = abilityMods.dex;
  c.featIds.forEach(id => {
    const f = getFeat(id);
    if (f?.bonuses?.initiative) initiative += f.bonuses.initiative;
  });
  if (c.manualOverrides?.initiative !== undefined) initiative = c.manualOverrides.initiative;

  // Saves
  const saveProfs: Record<Ability, boolean> = { str: false, dex: false, con: false, int: false, wis: false, cha: false };
  cls?.savingThrows.forEach(a => { saveProfs[a] = true; });
  const saves: Record<Ability, number> = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  for (const a of ABILITIES) {
    saves[a] = abilityMods[a] + (saveProfs[a] ? proficiencyBonus : 0);
    if (c.manualOverrides?.saves?.[a] !== undefined) saves[a] = c.manualOverrides.saves[a]!;
  }

  // Skills
  const skillProfs: Record<Skill, "none" | "prof" | "exp"> = {} as any;
  SKILL_LIST.forEach(s => { skillProfs[s.id] = c.skillProficiencies.includes(s.id) ? "prof" : "none"; });
  c.expertise.forEach(s => { if (skillProfs[s] === "prof") skillProfs[s] = "exp"; });
  const skills: Record<Skill, number> = {} as any;
  SKILL_LIST.forEach(s => {
    const base = abilityMods[s.ability];
    const profMult = skillProfs[s.id] === "exp" ? 2 : skillProfs[s.id] === "prof" ? 1 : 0;
    let bonus = base + profMult * proficiencyBonus;
    if (c.classId === "bard" && level >= 2 && skillProfs[s.id] === "none") bonus = base + Math.floor(proficiencyBonus / 2); // Jack of All Trades
    if (c.manualOverrides?.skills?.[s.id] !== undefined) bonus = c.manualOverrides.skills[s.id]!;
    skills[s.id] = bonus;
  });

  const passivePerception = 10 + skills.perception;
  const passiveInvestigation = 10 + skills.investigation;
  const passiveInsight = 10 + skills.insight;

  // Spellcasting
  let spellSaveDc: number | undefined;
  let spellAttackBonus: number | undefined;
  let spellcastingAbility: Ability | undefined;
  if (cls?.spellAbility && cls.casterType !== "none") {
    spellcastingAbility = cls.spellAbility;
    spellSaveDc = 8 + proficiencyBonus + abilityMods[cls.spellAbility];
    spellAttackBonus = proficiencyBonus + abilityMods[cls.spellAbility];
  }
  // EK / AT use INT
  if (c.classId === "fighter" && c.subclassId === "eldritch_knight") {
    spellcastingAbility = "int";
    spellSaveDc = 8 + proficiencyBonus + abilityMods.int;
    spellAttackBonus = proficiencyBonus + abilityMods.int;
  }
  if (c.classId === "rogue" && c.subclassId === "arcane_trickster") {
    spellcastingAbility = "int";
    spellSaveDc = 8 + proficiencyBonus + abilityMods.int;
    spellAttackBonus = proficiencyBonus + abilityMods.int;
  }
  if (c.manualOverrides?.spellSaveDc !== undefined) spellSaveDc = c.manualOverrides.spellSaveDc;
  if (c.manualOverrides?.spellAttackBonus !== undefined) spellAttackBonus = c.manualOverrides.spellAttackBonus;

  const spellSlots = getSpellSlots(c.classId, level, c.subclassId);

  // Walking distance
  const ftPerTurn = speed; // 6 seconds combat turn
  const ftPerMin = speed * 10; // 60s / 6s = 10 turns
  // 1 ft = 0.3048 m. ft/min * 60 / 1000 km/h
  const kmPerHour = (ftPerMin * 60 * 0.3048) / 1000;

  // Subclass granted spells (always prepared)
  const alwaysPreparedSpellIds: string[] = [];
  sub?.grantedSpells?.forEach(g => {
    if (level >= g.level) alwaysPreparedSpellIds.push(...g.spellIds);
  });

  // ===== Per-class resource pools (main class + any multiclass entries) =====
  const classResources = [
    ...computeClassResources(c.classId, c.subclassId, level, abilityMods, proficiencyBonus).map(r => ({ ...r, className: cls?.nameHe ?? c.classId })),
    ...(c.multiclass ?? []).flatMap(mc => {
      const mcCls = getClass(mc.classId);
      return computeClassResources(mc.classId, mc.subclassId, Math.max(1, Math.min(20, mc.level)), abilityMods, proficiencyBonus)
        .map(r => ({ ...r, className: mcCls?.nameHe ?? mc.classId }));
    }),
  ];

  // ===== Action economy =====
  const extras: string[] = [];
  let actions = 1, bonusActions = 1, reactions = 1;
  if (c.classId === "fighter" && level >= 5) extras.push("Extra Attack — 2 attacks per Action");
  if (c.classId === "fighter" && level >= 11) extras.push("Extra Attack (11) — 3 attacks per Action");
  if (c.classId === "fighter" && level >= 20) extras.push("Extra Attack (20) — 4 attacks per Action");
  if ((c.classId === "barbarian" || c.classId === "paladin" || c.classId === "ranger") && level >= 5) extras.push("Extra Attack — 2 attacks per Action");
  if (c.classId === "monk" && level >= 5) extras.push("Extra Attack — 2 attacks per Action");
  if (c.classId === "monk") extras.push("Martial Arts — Bonus unarmed strike after Attack action");
  if (c.classId === "monk" && level >= 2) extras.push("Flurry of Blows / Patient Defense / Step of the Wind (1 Ki, Bonus)");
  if (c.classId === "rogue" && level >= 2) extras.push("Cunning Action — Dash / Disengage / Hide (Bonus)");
  if (c.classId === "fighter" && level >= 2) { extras.push("Action Surge — extra Action (Short Rest)"); }
  if (c.classId === "barbarian") extras.push("Rage — Bonus action to enter");
  if (c.classId === "paladin" && level >= 2) extras.push("Divine Smite — reactive/on-hit");
  if (c.classId === "sorcerer" && level >= 3) extras.push("Quickened Spell (Metamagic) — cast 1-action spell as Bonus");
  if (c.classId === "bard") extras.push("Bardic Inspiration — Bonus action");
  if (c.featIds.includes("polearm_master")) extras.push("Polearm Master — bonus attack (butt end 1d4)");
  if (c.featIds.includes("crossbow_expert")) extras.push("Crossbow Expert — bonus hand-crossbow shot");
  if (c.featIds.includes("great_weapon_master")) extras.push("GWM — bonus attack on crit / kill");
  (c.extraActionNotes ?? []).forEach(n => extras.push(n));
  const actionEconomy = { actions, bonusActions, reactions, extras };

  // ===== ASI / Feat availability =====
  // Standard schedule: 4,8,12,16,19 (Fighter adds 6,14 ; Rogue adds 10).
  const asiSchedule: number[] = [4, 8, 12, 16, 19];
  if (c.classId === "fighter") asiSchedule.push(6, 14);
  if (c.classId === "rogue") asiSchedule.push(10);
  const asiLevels = Array.from(new Set(asiSchedule)).sort((a, b) => a - b);
  const asiTotal = asiLevels.filter(l => l <= level).length;
  // Rough "used" counter — each feat = 1, each +1 from override on baseAbilities beyond default 8-15 = 0 (we only tally featIds).
  const asiUsed = c.featIds.length;
  const asiRemaining = Math.max(0, asiTotal - asiUsed);
  const asiNextAt = asiLevels.find(l => l > level);
  const asi = { total: asiTotal, used: asiUsed, remaining: asiRemaining, levels: asiLevels, nextAt: asiNextAt };

  return {
    abilities, abilityMods, proficiencyBonus, ac, hpMax, speed, initiative,
    saves, saveProfs, skills, skillProfs,
    passivePerception, passiveInvestigation, passiveInsight,
    spellSaveDc, spellAttackBonus, spellcastingAbility, spellSlots,
    walking: { ftPerTurn, ftPerMin, kmPerHour: Math.round(kmPerHour * 10) / 10 },
    alwaysPreparedSpellIds,
    classResources,
    actionEconomy,
    asi,
    raceBonuses,
  };
}

// Map of class/subclass features that grant a limited-use resource pool.
// Numbers follow PHB / Xanathar / Tasha tables.
function computeClassResources(
  classId: string,
  subclassId: string | undefined,
  level: number,
  mods: Record<Ability, number>,
  prof: number,
): { name: string; value: string; recharge: string; desc?: string }[] {
  const out: { name: string; value: string; recharge: string; desc?: string }[] = [];
  const max1 = (n: number) => Math.max(1, n);

  switch (classId) {
    case "barbarian": {
      const rages = level >= 20 ? "∞" : level >= 17 ? "6" : level >= 12 ? "5" : level >= 6 ? "4" : level >= 3 ? "3" : "2";
      const rageDmg = level >= 16 ? "+4" : level >= 9 ? "+3" : "+2";
      out.push({ name: "Rage", value: `${rages}/יום`, recharge: "Long Rest", desc: `+${rageDmg} נזק, יתרון על Strength` });
      break;
    }
    case "monk": {
      out.push({ name: "Ki Points", value: `${level}`, recharge: "Short Rest", desc: `DC ${8 + prof + mods.wis}` });
      if (subclassId === "soul-knife" || subclassId === "soulknife" || subclassId === "way_of_the_soul_knife") {
        // (in case monk subclass) — Soul Knife is actually rogue. ignore here
      }
      break;
    }
    case "sorcerer": {
      if (level >= 2) out.push({ name: "Sorcery Points", value: `${level}`, recharge: "Long Rest", desc: "להמיר ל/מ-spell slots וליצור Metamagic" });
      break;
    }
    case "warlock": {
      // Pact slots handled in spellSlots. Mystic Arcanum + Invocations are flavor.
      const invocations = level >= 18 ? 8 : level >= 15 ? 7 : level >= 12 ? 6 : level >= 9 ? 5 : level >= 7 ? 4 : level >= 5 ? 3 : level >= 2 ? 2 : 0;
      if (invocations) out.push({ name: "Eldritch Invocations", value: `${invocations}`, recharge: "—", desc: "ידועות" });
      break;
    }
    case "fighter": {
      const sw = level >= 1 ? 1 : 0;
      if (sw) out.push({ name: "Second Wind", value: "1", recharge: "Short Rest", desc: `החזר 1d10+${level} HP` });
      const ai = level >= 17 ? 3 : level >= 7 ? 2 : level >= 2 ? 1 : 0;
      if (ai) out.push({ name: "Action Surge", value: `${ai}`, recharge: "Short Rest" });
      const indom = level >= 17 ? 3 : level >= 13 ? 2 : level >= 9 ? 1 : 0;
      if (indom) out.push({ name: "Indomitable", value: `${indom}`, recharge: "Long Rest", desc: "Reroll save נכשל" });
      if (subclassId === "battle_master" || subclassId === "battlemaster") {
        const dice = level >= 18 ? 6 : level >= 7 ? 5 : 4;
        const die = level >= 18 ? "d12" : level >= 10 ? "d10" : "d8";
        out.push({ name: "Superiority Dice", value: `${dice}${die}`, recharge: "Short Rest" });
      }
      if (subclassId === "eldritch_knight") {
        out.push({ name: "War Magic", value: "—", recharge: "—", desc: "מתקפת כלי + cantrip בפעולה (lvl 7+)" });
      }
      if (subclassId === "arcane_archer" || subclassId === "arcane-archer") {
        const shots = level >= 18 ? 6 : level >= 15 ? 5 : level >= 10 ? 4 : level >= 7 ? 3 : 2;
        out.push({ name: "Arcane Shot", value: `${shots}/short`, recharge: "Short Rest", desc: `DC ${8 + prof + Math.max(mods.int, mods.wis)}` });
      }
      if (subclassId === "psi_warrior" || subclassId === "psi-warrior") {
        const count = 2 * prof;
        const die = level >= 17 ? "d12" : level >= 11 ? "d10" : level >= 5 ? "d8" : "d6";
        out.push({ name: "Psionic Energy Dice", value: `${count}${die}`, recharge: "Long Rest (חצי ב-Short)" });
      }
      if (subclassId === "rune_knight" || subclassId === "rune-knight") {
        out.push({ name: "Giant's Might", value: `${prof}/long`, recharge: "Long Rest" });
      }
      break;
    }
    case "rogue": {
      const sa = Math.ceil(level / 2);
      out.push({ name: "Sneak Attack", value: `${sa}d6`, recharge: "פעם בתור" });
      if (subclassId === "soul_knife" || subclassId === "soulknife" || subclassId === "soul-knife") {
        const count = 2 * prof;
        const die = level >= 17 ? "d12" : level >= 13 ? "d10" : level >= 9 ? "d8" : "d6";
        out.push({ name: "Psionic Energy Dice", value: `${count}${die}`, recharge: "Long Rest (חצי ב-Short)", desc: "Psychic Blades / Psi-Bolstered Knack" });
      }
      if (subclassId === "phantom") {
        out.push({ name: "Wails from the Grave", value: `${Math.floor(prof / 2)}/long`, recharge: "Long Rest", desc: "מהרמה ה-9" });
      }
      if (subclassId === "arcane_trickster") {
        out.push({ name: "Mage Hand Legerdemain", value: "—", recharge: "—", desc: "כשפים ידועים מתוך רשימת Wizard (INT)" });
      }
      break;
    }
    case "paladin": {
      out.push({ name: "Lay on Hands", value: `${level * 5} HP`, recharge: "Long Rest" });
      out.push({ name: "Channel Divinity", value: "1", recharge: "Short Rest" });
      if (level >= 3) out.push({ name: "Divine Smite", value: "spell slot → נזק קורן", recharge: "—" });
      break;
    }
    case "cleric": {
      const cd = level >= 18 ? 3 : level >= 6 ? 2 : level >= 2 ? 1 : 0;
      if (cd) out.push({ name: "Channel Divinity", value: `${cd}`, recharge: "Short Rest" });
      out.push({ name: "Prepared Spells", value: `${max1(level + mods.wis)}`, recharge: "Long Rest" });
      break;
    }
    case "druid": {
      out.push({ name: "Wild Shape", value: `2/short`, recharge: "Short Rest" });
      out.push({ name: "Prepared Spells", value: `${max1(level + mods.wis)}`, recharge: "Long Rest" });
      break;
    }
    case "wizard": {
      out.push({ name: "Arcane Recovery", value: `עד ${Math.ceil(level / 2)} רמות slot`, recharge: "Long Rest (פעם ביום)" });
      out.push({ name: "Prepared Spells", value: `${max1(level + mods.int)}`, recharge: "Long Rest" });
      break;
    }
    case "bard": {
      const die = level >= 15 ? "d12" : level >= 10 ? "d10" : level >= 5 ? "d8" : "d6";
      const uses = Math.max(1, mods.cha);
      out.push({ name: "Bardic Inspiration", value: `${uses}× ${die}`, recharge: level >= 5 ? "Short Rest" : "Long Rest" });
      if (level >= 2) out.push({ name: "Song of Rest", value: `+${die}`, recharge: "Short Rest" });
      break;
    }
    case "ranger": {
      if (subclassId === "gloom_stalker" || subclassId === "gloom-stalker") {
        out.push({ name: "Dread Ambusher", value: "+10 speed, +1d8 בתור הראשון", recharge: "פעם ב-combat" });
      }
      if (subclassId === "horizon_walker" || subclassId === "horizon-walker") {
        out.push({ name: "Planar Warrior", value: `+1d8 force (lvl 3) / +2d8 (lvl 11)`, recharge: "—" });
      }
      break;
    }
    case "artificer": {
      const infusions = level >= 18 ? 6 : level >= 14 ? 5 : level >= 10 ? 4 : level >= 6 ? 3 : 2;
      const known = level >= 18 ? 12 : level >= 14 ? 10 : level >= 10 ? 8 : level >= 6 ? 6 : 4;
      out.push({ name: "Infusions Known / Active", value: `${known} / ${infusions}`, recharge: "Long Rest" });
      out.push({ name: "Prepared Spells", value: `${max1(Math.ceil(level / 2) + mods.int)}`, recharge: "Long Rest" });
      break;
    }
  }
  return out;
}

export function emptyCharacter(): Character {
  return {
    id: crypto.randomUUID(),
    name: "",
    level: 1,
    raceId: "",
    classId: "",
    baseAbilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    skillProficiencies: [],
    expertise: [],
    languages: [],
    featIds: [],
    fightingStyleIds: [],
    spellIds: [],
    preparedSpellIds: [],
    itemIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// Re-export for convenience
export { getRace, getClass, getFeat, getItem, getSpell, getBackground, CLASSES };
