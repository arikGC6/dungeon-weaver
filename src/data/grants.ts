// Mechanical grants from race/subrace, class option choices and magic instruments.
// Consumed by calculateCharacter() to add attacks, always-prepared spells, resources and effects.
import type { Ability, Character } from "../lib/dnd-types";
import { formatMod } from "../lib/dnd-types";

export interface GrantedAttack {
  name: string; bonus: string; damage: string; damageType?: string; range?: string;
  resource?: string; notes?: string; source: string;
}
export interface GrantedResource { name: string; value: string; recharge: string; desc?: string; className?: string }

interface Ctx { level: number; pb: number; mods: Record<Ability, number> }

// ---------- Race innate spells ----------
// level = character level at which it unlocks. perDay = uses without slot (cantrips omit).
type InnateSpell = { level: number; spellId: string; perDay?: string };
const RACE_SPELLS: Record<string, InnateSpell[]> = {
  tiefling: [{ level: 1, spellId: "thaumaturgy" }, { level: 3, spellId: "hellish_rebuke", perDay: "1/Long Rest" }, { level: 5, spellId: "darkness", perDay: "1/Long Rest" }],
  "tf-zariel": [{ level: 1, spellId: "thaumaturgy" }, { level: 3, spellId: "searing_smite", perDay: "1/Long Rest" }, { level: 5, spellId: "branding_smite", perDay: "1/Long Rest" }],
  "tf-glasya": [{ level: 1, spellId: "minor_illusion" }, { level: 3, spellId: "disguise_self", perDay: "1/Long Rest" }, { level: 5, spellId: "invisibility", perDay: "1/Long Rest" }],
  "tf-levistus": [{ level: 1, spellId: "ray_of_frost" }, { level: 3, spellId: "armor_of_agathys", perDay: "1/Long Rest" }, { level: 5, spellId: "darkness", perDay: "1/Long Rest" }],
  drow: [{ level: 1, spellId: "dancing_lights" }, { level: 3, spellId: "faerie_fire", perDay: "1/Long Rest" }, { level: 5, spellId: "darkness", perDay: "1/Long Rest" }],
  hexblood: [{ level: 1, spellId: "disguise_self", perDay: "1/Long Rest" }, { level: 1, spellId: "hex", perDay: "1/Long Rest" }],
  fairy: [{ level: 1, spellId: "druidcraft" }, { level: 3, spellId: "faerie_fire", perDay: "1/Long Rest" }],
  aasimar: [{ level: 1, spellId: "light" }],
  firbolg: [{ level: 1, spellId: "disguise_self", perDay: "1/Short Rest" }],
};

// ---------- Race natural attacks ----------
const DB_TYPE: Record<string, [string, string]> = {
  "db-black": ["חומצה (acid)", "קו 5×30ft · DEX save"], "db-copper": ["חומצה (acid)", "קו 5×30ft · DEX save"],
  "db-blue": ["ברק (lightning)", "קו 5×30ft · DEX save"], "db-bronze": ["ברק (lightning)", "קו 5×30ft · DEX save"],
  "db-brass": ["אש (fire)", "קו 5×30ft · DEX save"], "db-gold": ["אש (fire)", "חרוט 15ft · DEX save"],
  "db-red": ["אש (fire)", "חרוט 15ft · DEX save"], "db-green": ["רעל (poison)", "חרוט 15ft · CON save"],
  "db-silver": ["קור (cold)", "חרוט 15ft · CON save"], "db-white": ["קור (cold)", "חרוט 15ft · CON save"],
};

function natural(name: string, die: string, type: string, ab: Ability, x: Ctx, source: string, notes = ""): GrantedAttack {
  const m = x.mods[ab];
  return {
    name, bonus: formatMod(m + x.pb), damage: `${die}${m ? formatMod(m) : ""}`, damageType: type,
    range: "מגע 5ft", resource: "חופשי — Action (Unarmed Strike)", notes, source,
  };
}

function raceAttacks(c: Character, x: Ctx): GrantedAttack[] {
  const out: GrantedAttack[] = [];
  const r = c.raceId;
  if (r === "dragonborn") {
    const [type, area] = DB_TYPE[c.subraceId ?? ""] ?? ["לפי אב דרקוני", "קו 5×30ft / חרוט 15ft"];
    const dice = x.level >= 16 ? 5 : x.level >= 11 ? 4 : x.level >= 6 ? 3 : 2;
    const dc = 8 + x.mods.con + x.pb;
    out.push({
      name: "נשיפת דרקון (Breath Weapon)", bonus: `DC ${dc}`, damage: `${dice}d6`, damageType: type,
      range: area, resource: "1/Short or Long Rest — Action",
      notes: "הצלה מוצלחת = חצי נזק. הנזק עולה ברמות 6/11/16.", source: "גזע: Dragonborn",
    });
  }
  if (r === "tabaxi") out.push(natural("טפרי חתול (Cat's Claws)", "1d4", "חיתוך (slashing)", "str", x, "גזע: Tabaxi", "גם מהירות טיפוס 20ft"));
  if (r === "minotaur") out.push(natural("קרניים (Horns)", "1d6", "דקירה (piercing)", "str", x, "גזע: Minotaur", "Goring Rush: אחרי Dash — התקפת קרניים כ-Bonus Action"));
  if (r === "centaur") out.push(natural("פרסות (Hooves)", "1d4", "הלם (bludgeoning)", "str", x, "גזע: Centaur", "Charge: אחרי 30ft בקו ישר — פרסות כ-Bonus Action"));
  if (r === "leonin") {
    out.push(natural("טפרים (Claws)", "1d4", "חיתוך (slashing)", "str", x, "גזע: Leonin"));
    out.push({ name: "שאגה מאיימת (Daunting Roar)", bonus: `DC ${8 + x.mods.con + x.pb}`, damage: "Frightened", damageType: "—", range: "10ft סביבך", resource: "1/Short or Long Rest — Bonus Action", notes: "WIS save או Frightened עד סוף התור הבא שלך", source: "גזע: Leonin" });
  }
  if (r === "aarakocra") out.push(natural("טפרי עוף (Talons)", "1d4", "חיתוך (slashing)", "str", x, "גזע: Aarakocra"));
  if (r === "tortle") out.push(natural("טפרים (Claws)", "1d4", "חיתוך (slashing)", "str", x, "גזע: Tortle"));
  if (r === "satyr") out.push(natural("נגיחה (Ram)", "1d4", "הלם (bludgeoning)", "str", x, "גזע: Satyr"));
  if (r === "lizardfolk") out.push(natural("נשיכה (Bite)", "1d6", "דקירה (piercing)", "str", x, "גזע: Lizardfolk", "Hungry Jaws: 1/Short Rest כ-Bonus Action — temp HP = CON mod"));
  return out;
}

// ---------- Class option groups (chosen in the Feats step) ----------
export interface ClassOption { id: string; name: string; desc: string; attack?: (x: Ctx) => Omit<GrantedAttack, "source"> }
export interface ClassOptionGroup {
  id: string; label: string; classId: string; subclassId?: string;
  countAt: [number, number][]; // [classLevel, totalChoices]
  options: ClassOption[];
}

const supDie = (lvl: number) => (lvl >= 18 ? "d12" : lvl >= 10 ? "d10" : "d8");
const maneuver = (id: string, name: string, desc: string, extra = ""): ClassOption => ({
  id, name, desc,
  attack: x => ({
    name: `תמרון: ${name}`, bonus: "לפי הנשק", damage: `+1${supDie(x.level)}`, damageType: "לפי הנשק",
    range: "לפי הנשק", resource: "Superiority Die",
    notes: `${desc}${extra ? ` · DC ${8 + x.pb + Math.max(x.mods.str, x.mods.dex)}` : ""}`,
  }),
});

export const CLASS_OPTION_GROUPS: ClassOptionGroup[] = [
  {
    id: "maneuvers", label: "תמרונים (Battle Master)", classId: "fighter", subclassId: "battlemaster",
    countAt: [[3, 3], [7, 5], [10, 7], [15, 9]],
    options: [
      maneuver("trip", "Trip Attack", "STR save או Prone", "dc"),
      maneuver("precision", "Precision Attack", "מוסיף את הקוביה לגלגול הפגיעה (לא לנזק)"),
      maneuver("riposte", "Riposte", "Reaction: כשאויב מחטיא אותך — התקפה נגדית"),
      maneuver("menacing", "Menacing Attack", "WIS save או Frightened", "dc"),
      maneuver("pushing", "Pushing Attack", "STR save או נדחף 15ft", "dc"),
      maneuver("disarming", "Disarming Attack", "STR save או מפיל חפץ", "dc"),
      maneuver("goading", "Goading Attack", "WIS save או Disadvantage נגד אחרים", "dc"),
      maneuver("sweeping", "Sweeping Attack", "נזק הקוביה ליצור שני בטווח 5ft"),
      maneuver("distracting", "Distracting Strike", "ההתקפה הבאה של בן ברית נגד היעד ב-Advantage"),
      maneuver("lunging", "Lunging Attack", "+5ft טווח להתקפה"),
      maneuver("feinting", "Feinting Attack", "Bonus Action: Advantage על ההתקפה"),
      maneuver("parry", "Parry", "Reaction: מפחית נזק = קוביה + DEX"),
      maneuver("rally", "Rally", "Bonus Action: בן ברית מקבל temp HP = קוביה + CHA"),
      maneuver("commanders", "Commander's Strike", "בן ברית תוקף במקומך כ-Reaction"),
    ],
  },
  {
    id: "runes", label: "רונות (Rune Knight)", classId: "fighter", subclassId: "rune_knight",
    countAt: [[3, 2], [7, 3], [10, 4], [15, 5]],
    options: [
      { id: "fire", name: "Fire Rune", desc: "בפגיעה: +2d6 אש ו-STR save או Restrained", attack: x => ({ name: "רונת אש (Fire Rune)", bonus: `DC ${8 + x.pb + x.mods.con}`, damage: "+2d6", damageType: "אש (fire)", range: "בפגיעת נשק", resource: "1/Short Rest", notes: "STR save או Restrained, נזק 2d6 בכל תחילת תור" }) },
      { id: "frost", name: "Frost Rune", desc: "Bonus Action: +2 לבדיקות ו-saves של STR/CON ל-10 דק'" },
      { id: "stone", name: "Stone Rune", desc: "Reaction: יצור ב-30ft — WIS save או Charmed/מוקסם", attack: x => ({ name: "רונת אבן (Stone Rune)", bonus: `DC ${8 + x.pb + x.mods.con}`, damage: "Charmed", damageType: "—", range: "30ft", resource: "1/Short Rest — Reaction", notes: "WIS save או Incapacitated ל-דקה" }) },
      { id: "hill", name: "Hill Rune", desc: "Bonus Action: Resistance ל-bludgeoning/piercing/slashing ל-דקה" },
      { id: "storm", name: "Storm Rune", desc: "Bonus Action: Advantage / Disadvantage כ-Reaction ל-דקה" },
      { id: "cloud", name: "Cloud Rune", desc: "Reaction: מעביר פגיעה ליצור אחר ב-30ft" },
    ],
  },
  {
    id: "totem", label: "רוח טוטם (Totem Warrior)", classId: "barbarian", subclassId: "totem",
    countAt: [[3, 1]],
    options: [
      { id: "bear", name: "Bear", desc: "בזעם: Resistance לכל נזק חוץ מ-Psychic" },
      { id: "eagle", name: "Eagle", desc: "בזעם: Dash כ-Bonus Action, Disadvantage על OA נגדך" },
      { id: "wolf", name: "Wolf", desc: "בזעם: בני ברית ב-Advantage נגד אויבים לידך" },
      { id: "elk", name: "Elk", desc: "בזעם: +15ft מהירות" },
      { id: "tiger", name: "Tiger", desc: "בזעם: קפיצות +10ft" },
    ],
  },
];

export function classLevelOf(c: Character, classId: string): { level: number; subclassId?: string } {
  if (c.classId === classId) {
    const other = (c.multiclass ?? []).reduce((s, m) => s + m.level, 0);
    return { level: Math.max(1, c.level - other), subclassId: c.subclassId };
  }
  const m = (c.multiclass ?? []).find(m => m.classId === classId);
  return m ? { level: m.level, subclassId: m.subclassId } : { level: 0 };
}

export function availableOptionGroups(c: Character) {
  return CLASS_OPTION_GROUPS.map(g => {
    const cl = classLevelOf(c, g.classId);
    if (!cl.level || (g.subclassId && cl.subclassId !== g.subclassId)) return null;
    const max = g.countAt.filter(([l]) => cl.level >= l).reduce((_, [, n]) => n, 0);
    return max ? { group: g, max, classLevel: cl.level } : null;
  }).filter(Boolean) as { group: ClassOptionGroup; max: number; classLevel: number }[];
}

// ---------- Instruments ----------
export function hasItem(c: Character, id: string) {
  return c.itemIds.some(i => i.id === id && i.equipped);
}
export const STORM_GUITAR_BONUS = "+1d6 ברק";

// ---------- Main entry ----------
export function computeGrants(c: Character, x: Ctx) {
  const attacks: GrantedAttack[] = raceAttacks(c, x);
  const spellIds: string[] = [];
  const resources: GrantedResource[] = [];
  const effects: { name: string; effect: string }[] = [];

  const innate = RACE_SPELLS[c.subraceId ?? ""] ?? RACE_SPELLS[c.raceId] ?? [];
  innate.filter(s => x.level >= s.level).forEach(s => {
    spellIds.push(s.spellId);
    if (s.perDay) resources.push({ name: `${s.spellId.replace(/_/g, " ")} (כישוף גזעי)`, value: "1", recharge: s.perDay, desc: "ללא Spell Slot", className: "גזע" });
  });

  for (const { group, max, classLevel } of availableOptionGroups(c)) {
    const chosen = (c.classChoices?.[group.id] ?? []).slice(0, max);
    const cx = { ...x, level: classLevel };
    chosen.forEach(id => {
      const o = group.options.find(o => o.id === id);
      if (!o) return;
      if (o.attack) attacks.push({ ...o.attack(cx), source: group.label });
      else effects.push({ name: `${group.label}: ${o.name}`, effect: o.desc });
    });
  }

  if (hasItem(c, "minst_storm_guitar")) effects.push({ name: "🎸 גיטרת הסערה", effect: `${STORM_GUITAR_BONUS} נוסף לכל כישוף שגורם נזק (מוצג בטבלת הכישופים)` });
  if (hasItem(c, "minst_healing_guitar")) {
    resources.push({ name: "🎸 אקורד מרפא", value: "1", recharge: "Long Rest", desc: `ריפוי 2d8${formatMod(x.mods.cha)} לכל בני הברית ב-30ft`, className: "חפץ" });
  }
  if (hasItem(c, "minst_charm_guitar")) effects.push({ name: "🎸 גיטרת לשון הכסף", effect: "Advantage על Persuasion / Deception / Performance / Intimidation בזמן נגינה" });
  if (c.itemIds.some(i => i.id === "wmi_harp_bow")) {
    attacks.push({ name: "ירייה מנוגנת (Harpstring Bow)", bonus: formatMod(x.mods.dex + x.pb), damage: `1d8${formatMod(x.mods.dex)}`, damageType: "דקירה (piercing)", range: "150/600", resource: "3/יום", notes: "Advantage על ההתקפה (דורש proficiency בנבל)", source: "חפץ: קשת-נבל" });
  }
  const cf = classFeatureGrants(c, x, new Set(attacks.map(a => a.name)));
  attacks.push(...cf.attacks); spellIds.push(...cf.spellIds);
  return { attacks, spellIds, resources, effects };
}

// ---------- Generic class-feature classifier ----------
// Every unlocked class/subclass feature is inspected: features naming a known spell go to the
// Spells tab; features that are actions/attacks (action keyword or damage dice) become Attack cards.
import { getClass } from "./classes";
import { SPELLS } from "./spells";

const SPELL_INDEX = SPELLS.filter(s => s.name.length > 3)
  .map(s => ({ id: s.id, re: new RegExp(`\\b${s.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i") }));
const PASSIVE = /^(Ability Score Improvement|Spellcasting|Pact Magic|Primal Path|Expertise|Unarmored Defense|Fighting Style|.*Subclass.*|Otherworldly Patron|Sacred Oath|Arcane Tradition|Martial Archetype|Roguish Archetype|Divine Domain|Druid Circle|Bardic College|Sorcerous Origin|Ranger Archetype|Monastic Tradition|Artificer Specialist)/i;

function actionType(t: string): string {
  if (/bonus action/i.test(t)) return "Bonus Action";
  if (/reaction/i.test(t)) return "Reaction";
  if (/\baction\b|attack action/i.test(t)) return "Action";
  if (/on hit|בפגיעה|פעם בתור|once per turn/i.test(t)) return "בפגיעה (פעם בתור)";
  return "יכולת";
}
function uses(t: string): string {
  const rest = /long rest/i.test(t) ? "Long Rest" : /short rest/i.test(t) ? "Short Rest" : "";
  const prof = /prof(iciency)? bonus|פעמים = prof/i.test(t) ? "PB×" : "";
  if (prof && rest) return `${prof} / ${rest}`;
  if (rest) return `1 / ${rest}`;
  if (/spell slot|סלוט/i.test(t)) return "Spell Slot";
  if (/\bki\b/i.test(t)) return "Ki";
  if (/superiority/i.test(t)) return "Superiority Die";
  if (/פעמים|times|uses/i.test(t)) return "מוגבל (ראה תיאור)";
  return "חופשי";
}
const IS_COMBAT = /\d+d\d+|\baction\b|bonus action|reaction|attack|התקפ|נזק|damage|save|הצלת/i;

export function classFeatureGrants(c: Character, x: Ctx, existingNames: Set<string>) {
  const attacks: GrantedAttack[] = [];
  const spellIds: string[] = [];
  const entries = [{ classId: c.classId }, ...(c.multiclass ?? []).map(m => ({ classId: m.classId }))];
  for (const { classId } of entries) {
    const cls = getClass(classId);
    if (!cls) continue;
    const cl = classLevelOf(c, classId);
    const sub = cls.subclasses.find(s => s.id === cl.subclassId);
    const feats = [...cls.features, ...(sub?.features ?? [])].filter(f => f.level <= cl.level && f.desc);
    const seen = new Set<string>();
    for (const f of feats) {
      const base = f.name.replace(/\s*\(.*\)$/, "");
      if (seen.has(base) || PASSIVE.test(f.name)) continue;
      const text = `${f.name} ${f.desc}`;
      const spells = SPELL_INDEX.filter(s => s.re.test(text)).map(s => s.id);
      if (spells.length) { spellIds.push(...spells); seen.add(base); continue; }
      if (!IS_COMBAT.test(text)) continue;
      // Keep only the highest-level version of a scaling feature (e.g. Brutal Critical 1→2→3 dice).
      const later = feats.filter(g => g.name.replace(/\s*\(.*\)$/, "") === base).pop()!;
      seen.add(base);
      if ([...existingNames].some(n => n.includes(base))) continue;
      const dice = `${later.name} ${later.desc}`.match(/\d+d\d+/)?.[0] ?? "—";
      attacks.push({
        name: later.name, bonus: /save|הצלת/i.test(later.desc) && cls.spellAbility ? `DC ${8 + x.pb + x.mods[cls.spellAbility]}` : "—",
        damage: dice, damageType: "ראה תיאור", range: "—",
        resource: `${actionType(later.desc)} · ${uses(later.desc)}`,
        notes: later.desc, source: `${sub && sub.features.includes(later) ? sub.nameHe : cls.nameHe} ${later.level}`,
      });
    }
  }
  return { attacks, spellIds };
}
