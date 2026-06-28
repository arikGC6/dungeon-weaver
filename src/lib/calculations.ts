import { ABILITIES, type Ability, type Character, type Skill, PROFICIENCY_BY_LEVEL, mod, SKILL_LIST } from "./dnd-types";
import { getRace } from "../data/races";
import { CLASSES, getClass, getSpellSlots, type SpellSlotsInfo } from "../data/classes";
import { getFeat } from "../data/feats";
import { getItem, ARMOR_BASE } from "../data/items";
import { getSpell } from "../data/spells";
import { getBackground } from "../data/backgrounds";

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

  // Race bonuses
  race?.abilityBonuses.forEach(b => { abilities[b.ability] = (abilities[b.ability] ?? 10) + b.amount; });
  subrace?.abilityBonuses.forEach(b => { abilities[b.ability] = (abilities[b.ability] ?? 10) + b.amount; });

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

  return {
    abilities, abilityMods, proficiencyBonus, ac, hpMax, speed, initiative,
    saves, saveProfs, skills, skillProfs,
    passivePerception, passiveInvestigation, passiveInsight,
    spellSaveDc, spellAttackBonus, spellcastingAbility, spellSlots,
    walking: { ftPerTurn, ftPerMin, kmPerHour: Math.round(kmPerHour * 10) / 10 },
    alwaysPreparedSpellIds,
  };
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
    spellIds: [],
    preparedSpellIds: [],
    itemIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// Re-export for convenience
export { getRace, getClass, getFeat, getItem, getSpell, getBackground, CLASSES };
