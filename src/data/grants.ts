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
  if (r === "goliath") {
    const use = `PB (${x.pb}) / Long Rest`;
    const G: Record<string, Omit<GrantedAttack, "source">> = {
      "gol-cloud": { name: "Cloud's Jaunt", bonus: "—", damage: "—", damageType: "טלפורט", range: "30ft", resource: `Bonus Action · ${use}`, notes: "טלפורט קסום למקום פנוי שאתה רואה" },
      "gol-fire": { name: "Fire's Burn", bonus: "—", damage: "+1d10", damageType: "אש (fire)", range: "בפגיעה", resource: `בפגיעה · ${use}`, notes: "נזק נוסף לאחר פגיעת התקפה" },
      "gol-frost": { name: "Frost's Chill", bonus: "—", damage: "+1d6", damageType: "קור (cold)", range: "בפגיעה", resource: `בפגיעה · ${use}`, notes: "מהירות המטרה −10ft עד תחילת תורך" },
      "gol-hill": { name: "Hill's Tumble", bonus: "—", damage: "Prone", damageType: "—", range: "בפגיעה", resource: `בפגיעה · ${use}`, notes: "מטרה Large או קטנה נופלת Prone" },
      "gol-stone": { name: "Stone's Endurance", bonus: "—", damage: `−(1d12${formatMod(x.mods.con)})`, damageType: "הפחתת נזק", range: "עצמי", resource: `Reaction · ${use}`, notes: "מפחית מהנזק שחטפת" },
      "gol-storm": { name: "Storm's Thunder", bonus: "—", damage: "1d8", damageType: "רעם (thunder)", range: "60ft", resource: `Reaction · ${use}`, notes: "לתוקף שפגע בך" },
    };
    const g = G[c.subraceId ?? ""]; if (g) out.push({ ...g, source: "גזע: Goliath" });
    if (x.level >= 5) out.push({ name: "Large Form", bonus: "—", damage: "—", damageType: "—", range: "עצמי", resource: "Bonus Action · 1/Long Rest", notes: "Large ל-10 דק', Advantage על STR, +10ft מהירות", source: "גזע: Goliath 5" });
  }
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
    id: "metamagic", label: "מטא-מג'יק (Metamagic)", classId: "sorcerer",
    countAt: [[3, 2], [10, 3], [17, 4]],
    options: [
      { id: "careful", name: "Careful Spell", desc: "1 SP · עד CHA mod יצורים מצליחים אוטומטית בהצלה" },
      { id: "distant", name: "Distant Spell", desc: "1 SP · טווח כפול; מגע → 30ft" },
      { id: "empowered", name: "Empowered Spell", desc: "1 SP · גלגול מחדש של עד CHA mod קוביות נזק" },
      { id: "extended", name: "Extended Spell", desc: "1 SP · משך כפול (עד 24 שעות)" },
      { id: "heightened", name: "Heightened Spell", desc: "3 SP · Disadvantage להצלה הראשונה של יצור אחד" },
      { id: "quickened", name: "Quickened Spell", desc: "2 SP · לחש של Action מוטל כ-Bonus Action" },
      { id: "subtle", name: "Subtle Spell", desc: "1 SP · ללא רכיבים V/S" },
      { id: "twinned", name: "Twinned Spell", desc: "SP = דרג הלחש (1 ללחשון) · מטרה שנייה" },
      { id: "seeking", name: "Seeking Spell", desc: "2 SP · גלגול מחדש של התקפת לחש שהחטיאה" },
      { id: "transmuted", name: "Transmuted Spell", desc: "1 SP · החלפת סוג הנזק (חומצה/קור/אש/ברק/רעל/רעם)" },
    ],
  },
  {
    id: "dragon_ancestor", label: "אב דרקוני (Draconic Bloodline)", classId: "sorcerer", subclassId: "draconic",
    countAt: [[1, 1]],
    options: [
      { id: "acid", name: "שחור / נחושת", desc: "חומצה" },
      { id: "lightning", name: "כחול / ברונזה", desc: "ברק" },
      { id: "fire", name: "אדום / זהב / פליז", desc: "אש" },
      { id: "poison", name: "ירוק", desc: "רעל" },
      { id: "cold", name: "כסף / לבן", desc: "קור" },
    ],
  },
  {
    id: "divine_affinity", label: "זיקה אלוהית (Divine Soul)", classId: "sorcerer", subclassId: "divine_soul",
    countAt: [[1, 1]],
    options: [
      { id: "good", name: "טוב", desc: "Cure Wounds" },
      { id: "evil", name: "רע", desc: "Inflict Wounds" },
      { id: "law", name: "חוק", desc: "Bless" },
      { id: "chaos", name: "תוהו", desc: "Bane" },
      { id: "neutral", name: "נייטרלי", desc: "Protection from Evil and Good" },
    ],
  },
  {
    id: "land_terrain", label: "סוג קרקע (Circle of the Land)", classId: "druid", subclassId: "land",
    countAt: [[2, 1]],
    options: [
      { id: "ארקטי", name: "ארקטי", desc: "קובע את לחשי המעגל" },
      { id: "חוף", name: "חוף", desc: "קובע את לחשי המעגל" },
      { id: "מדבר", name: "מדבר", desc: "קובע את לחשי המעגל" },
      { id: "יער", name: "יער", desc: "קובע את לחשי המעגל" },
      { id: "עשב", name: "עשב", desc: "קובע את לחשי המעגל" },
      { id: "הר", name: "הר", desc: "קובע את לחשי המעגל" },
      { id: "ביצה", name: "ביצה", desc: "קובע את לחשי המעגל" },
      { id: "תת-קרקע", name: "תת-קרקע", desc: "קובע את לחשי המעגל" },
    ],
  },
  {
    id: "favored_enemy", label: "אויב מועדף (Favored Enemy)", classId: "ranger",
    countAt: [[1, 1], [6, 2], [14, 3]],
    options: [
      { id: "aberrations", name: "Aberrations", desc: "Advantage במעקב ובידע + שפה" },
      { id: "beasts", name: "Beasts", desc: "Advantage במעקב ובידע + שפה" },
      { id: "celestials", name: "Celestials", desc: "Advantage במעקב ובידע + שפה" },
      { id: "constructs", name: "Constructs", desc: "Advantage במעקב ובידע + שפה" },
      { id: "dragons", name: "Dragons", desc: "Advantage במעקב ובידע + שפה" },
      { id: "elementals", name: "Elementals", desc: "Advantage במעקב ובידע + שפה" },
      { id: "fey", name: "Fey", desc: "Advantage במעקב ובידע + שפה" },
      { id: "fiends", name: "Fiends", desc: "Advantage במעקב ובידע + שפה" },
      { id: "giants", name: "Giants", desc: "Advantage במעקב ובידע + שפה" },
      { id: "monstrosities", name: "Monstrosities", desc: "Advantage במעקב ובידע + שפה" },
      { id: "oozes", name: "Oozes", desc: "Advantage במעקב ובידע + שפה" },
      { id: "plants", name: "Plants", desc: "Advantage במעקב ובידע + שפה" },
      { id: "undead", name: "Undead", desc: "Advantage במעקב ובידע + שפה" },
      { id: "humanoids (2)", name: "Humanoids (2)", desc: "Advantage במעקב ובידע + שפה" },
      { id: "favored_foe", name: "Favored Foe (Tasha)", desc: "סימון מטרה: +1d4 נזק (1d6 ברמה 6, 1d8 ברמה 14) · PB פעמים / Long Rest", attack: x => ({ name: "Favored Foe", bonus: "—", damage: x.level >= 14 ? "+1d8" : x.level >= 6 ? "+1d6" : "+1d4", damageType: "לפי הנשק", range: "לפי הנשק", resource: `בפגיעה · ${x.pb} / Long Rest`, notes: "פעם בתור, ריכוז דקה" }) },
    ],
  },
  {
    id: "natural_explorer", label: "שטח מועדף (Natural Explorer)", classId: "ranger",
    countAt: [[1, 1], [6, 2], [10, 3]],
    options: [
      { id: "ארקטי", name: "ארקטי", desc: "קבוצה לא מואטת, לא הולכים לאיבוד, פי 2 מזון" },
      { id: "חוף", name: "חוף", desc: "קבוצה לא מואטת, לא הולכים לאיבוד, פי 2 מזון" },
      { id: "מדבר", name: "מדבר", desc: "קבוצה לא מואטת, לא הולכים לאיבוד, פי 2 מזון" },
      { id: "יער", name: "יער", desc: "קבוצה לא מואטת, לא הולכים לאיבוד, פי 2 מזון" },
      { id: "עשב", name: "עשב", desc: "קבוצה לא מואטת, לא הולכים לאיבוד, פי 2 מזון" },
      { id: "הר", name: "הר", desc: "קבוצה לא מואטת, לא הולכים לאיבוד, פי 2 מזון" },
      { id: "ביצה", name: "ביצה", desc: "קבוצה לא מואטת, לא הולכים לאיבוד, פי 2 מזון" },
      { id: "Underdark", name: "Underdark", desc: "קבוצה לא מואטת, לא הולכים לאיבוד, פי 2 מזון" },
      { id: "deft", name: "Deft Explorer (Tasha)", desc: "Canny: Expertise + 2 שפות · Roving (6) · Tireless (10)" },
    ],
  },
  {
    id: "hunters_prey", label: "Hunter's Prey", classId: "ranger", subclassId: "hunter",
    countAt: [[3, 1]],
    options: [
      { id: "colossus", name: "Colossus Slayer", desc: "+1d8 פעם בתור למטרה פצועה", attack: x => ({ name: "Colossus Slayer", bonus: "—", damage: "+1d8", damageType: "לפי הנשק", range: "לפי הנשק", resource: "פעם בתור · חופשי", notes: "מטרה מתחת ל-HP מקסימלי" }) },
      { id: "giant_killer", name: "Giant Killer", desc: "Reaction: התקפה נגד Large+ ב-5ft שתקף אותך", attack: x => ({ name: "Giant Killer", bonus: "לפי הנשק", damage: "לפי הנשק", damageType: "לפי הנשק", range: "5ft", resource: "Reaction · חופשי", notes: "כשיצור Large+ פוגע/מחטיא אותך" }) },
      { id: "horde_breaker", name: "Horde Breaker", desc: "התקפה נוספת ליצור שני ב-5ft מהראשון", attack: x => ({ name: "Horde Breaker", bonus: "לפי הנשק", damage: "לפי הנשק", damageType: "לפי הנשק", range: "לפי הנשק", resource: "פעם בתור · חופשי", notes: "יצור אחר ב-5ft מהמטרה הראשונה" }) },
    ],
  },
  {
    id: "defensive_tactics", label: "Defensive Tactics", classId: "ranger", subclassId: "hunter",
    countAt: [[7, 1]],
    options: [
      { id: "escape", name: "Escape the Horde", desc: "OA נגדך ב-Disadvantage" },
      { id: "multiattack_def", name: "Multiattack Defense", desc: "+4 AC נגד שאר התקפות התוקף בתור" },
      { id: "steel_will", name: "Steel Will", desc: "Advantage נגד Frightened" },
    ],
  },
  {
    id: "multiattack", label: "Multiattack", classId: "ranger", subclassId: "hunter",
    countAt: [[11, 1]],
    options: [
      { id: "volley", name: "Volley", desc: "Action: התקפה לכל יצור ב-10ft מנקודה", attack: x => ({ name: "Volley", bonus: "לפי הנשק", damage: "לפי הנשק", damageType: "לפי הנשק", range: "10ft מנקודה בטווח", resource: "Action · חופשי", notes: "גלגול נפרד לכל מטרה" }) },
      { id: "whirlwind", name: "Whirlwind Attack", desc: "Action: התקפה לכל יצור ב-5ft", attack: x => ({ name: "Whirlwind Attack", bonus: "לפי הנשק", damage: "לפי הנשק", damageType: "לפי הנשק", range: "5ft סביבך", resource: "Action · חופשי", notes: "גלגול נפרד לכל מטרה" }) },
    ],
  },
  {
    id: "superior_defense", label: "Superior Hunter's Defense", classId: "ranger", subclassId: "hunter",
    countAt: [[15, 1]],
    options: [
      { id: "evasion", name: "Evasion", desc: "DEX save: חצי/אפס נזק" },
      { id: "stand_tide", name: "Stand Against the Tide", desc: "Reaction: מחטיא מתקיף יצור אחר" },
      { id: "uncanny", name: "Uncanny Dodge", desc: "Reaction: חצי נזק" },
    ],
  },
  {
    id: "primal_companion", label: "חיית לוויה (Beast Master)", classId: "ranger", subclassId: "beastmaster",
    countAt: [[3, 1]],
    options: [
      { id: "land", name: "Beast of the Land", desc: "AC 13+PB · HP 5+5×רמה · Bonus Action לפקודה", attack: x => ({ name: "Beast of the Land", bonus: formatMod(x.pb + x.mods.wis), damage: `1d8+${2 + x.pb}`, damageType: "כוח (force)", range: "5ft", resource: "Bonus Action (פקודה) · חופשי", notes: "התקפת חיית הלוויה" }) },
      { id: "sea", name: "Beast of the Sea", desc: "AC 13+PB · HP 5+5×רמה · Bonus Action לפקודה", attack: x => ({ name: "Beast of the Sea", bonus: formatMod(x.pb + x.mods.wis), damage: `1d8+${2 + x.pb}`, damageType: "כוח (force)", range: "5ft", resource: "Bonus Action (פקודה) · חופשי", notes: "התקפת חיית הלוויה" }) },
      { id: "sky", name: "Beast of the Sky", desc: "AC 13+PB · HP 5+5×רמה · Bonus Action לפקודה", attack: x => ({ name: "Beast of the Sky", bonus: formatMod(x.pb + x.mods.wis), damage: `1d8+${2 + x.pb}`, damageType: "כוח (force)", range: "5ft", resource: "Bonus Action (פקודה) · חופשי", notes: "התקפת חיית הלוויה" }) },
    ],
  },
  {
    id: "beast_form", label: "צורת החיה (Path of the Beast)", classId: "barbarian", subclassId: "beast",
    countAt: [[3, 1]],
    options: [
      { id: "bite", name: "Bite", desc: "1d8 דקירה; ריפוי מתחת לחצי HP", attack: x => ({ name: "נשיכה (Bite)", bonus: formatMod(x.mods.str + x.pb), damage: `1d8${formatMod(x.mods.str)}`, damageType: "דקירה (piercing)", range: "5ft", resource: "בזעם · Action", notes: "ריפוי PB פעם בתור כשמתחת לחצי HP" }) },
      { id: "claws", name: "Claws", desc: "1d6 חיתוך; התקפת טפרים נוספת", attack: x => ({ name: "טפרים (Claws)", bonus: formatMod(x.mods.str + x.pb), damage: `1d6${formatMod(x.mods.str)}`, damageType: "חיתוך (slashing)", range: "5ft", resource: "בזעם · Action (+1 התקפה)", notes: "התקפת Claws נוספת בכל Attack action" }) },
      { id: "tail", name: "Tail", desc: "1d8 דקירה, טווח 10ft; Reaction +1d8 AC", attack: x => ({ name: "זנב (Tail)", bonus: formatMod(x.mods.str + x.pb), damage: `1d8${formatMod(x.mods.str)}`, damageType: "דקירה (piercing)", range: "10ft", resource: "בזעם · Action", notes: "Reaction: +1d8 AC נגד התקפה" }) },
    ],
  },
  {
    id: "elemental_cleaver", label: "Elemental Cleaver — סוג", classId: "barbarian", subclassId: "giant",
    countAt: [[6, 1]],
    options: [
      { id: "אש", name: "אש", desc: "", attack: x => ({ name: "Elemental Cleaver (אש)", bonus: "—", damage: x.level >= 14 ? "+2d6" : "+1d6", damageType: "אש", range: "לפי הנשק (חוזר כשנזרק)", resource: "Bonus Action בזעם", notes: "מתחלף בכל Rage" }) },
      { id: "קור", name: "קור", desc: "", attack: x => ({ name: "Elemental Cleaver (קור)", bonus: "—", damage: x.level >= 14 ? "+2d6" : "+1d6", damageType: "קור", range: "לפי הנשק (חוזר כשנזרק)", resource: "Bonus Action בזעם", notes: "מתחלף בכל Rage" }) },
      { id: "ברק", name: "ברק", desc: "", attack: x => ({ name: "Elemental Cleaver (ברק)", bonus: "—", damage: x.level >= 14 ? "+2d6" : "+1d6", damageType: "ברק", range: "לפי הנשק (חוזר כשנזרק)", resource: "Bonus Action בזעם", notes: "מתחלף בכל Rage" }) },
      { id: "רעם", name: "רעם", desc: "", attack: x => ({ name: "Elemental Cleaver (רעם)", bonus: "—", damage: x.level >= 14 ? "+2d6" : "+1d6", damageType: "רעם", range: "לפי הנשק (חוזר כשנזרק)", resource: "Bonus Action בזעם", notes: "מתחלף בכל Rage" }) },
      { id: "חומצה", name: "חומצה", desc: "", attack: x => ({ name: "Elemental Cleaver (חומצה)", bonus: "—", damage: x.level >= 14 ? "+2d6" : "+1d6", damageType: "חומצה", range: "לפי הנשק (חוזר כשנזרק)", resource: "Bonus Action בזעם", notes: "מתחלף בכל Rage" }) },
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
    const chosen = c.classChoices?.[group.id] ?? []; void max;
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
  const rt = raceTraitGrants(c, x, new Set(attacks.map(a => a.name)), new Set(spellIds));
  attacks.push(...rt.attacks); spellIds.push(...rt.spellIds);
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
  .sort((a, b) => b.name.length - a.name.length)
  .map(s => ({ id: s.id, name: s.name, re: new RegExp(`\\b${s.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`) }));
function matchSpells(text: string): string[] {
  let rest = text; const out: string[] = [];
  for (const s of SPELL_INDEX) if (s.re.test(rest)) { out.push(s.id); rest = rest.replace(s.re, " "); }
  return out;
}
const PASSIVE = /^(Ability Score Improvement|Spellcasting|Pact Magic|Primal Path|Expertise|Unarmored Defense|Fighting Style|.*Subclass.*|Otherworldly Patron|Sacred Oath|Arcane Tradition|Martial Archetype|Roguish Archetype|Divine Domain|Druid Circle|Bardic College|Sorcerous Origin|Ranger Archetype|Monastic Tradition|Artificer Specialist)/i;

function actionType(t: string): string {
  if (/bonus action|פעולת בונוס/i.test(t)) return "Bonus Action";
  if (/reaction|תגובה/i.test(t)) return "Reaction";
  if (/\baction\b|attack action|פעולה/i.test(t)) return "Action";
  if (/on hit|בפגיעה|פעם בתור|once per turn/i.test(t)) return "בפגיעה (פעם בתור)";
  return "יכולת";
}
function uses(t: string): string {
  const rest = /long rest|מנוחה ארוכה/i.test(t) ? "Long Rest" : /short rest|מנוחה קצרה/i.test(t) ? "Short Rest" : "";
  const prof = /prof(iciency)? bonus|פעמים = prof|PB פעמים|תוסף שליטה למנוחה/i.test(t) ? "PB×" : "";
  if (/WIS mod פעמים|CHA mod פעמים/i.test(t)) return /long rest|ארוכה|ביום/i.test(t) ? "mod× / Long Rest" : "mod×";
  if (/פעם ביום|1\/day/i.test(t)) return "1 / Long Rest";
  if (prof && rest) return `${prof} / ${rest}`;
  if (rest) return `1 / ${rest}`;
  if (/spell slot|סלוט/i.test(t)) return "Spell Slot";
  if (/\bki\b/i.test(t)) return "Ki";
  if (/superiority/i.test(t)) return "Superiority Die";
  if (/פעמים|times|uses/i.test(t)) return "מוגבל (ראה תיאור)";
  return "חופשי";
}
const DMG_TYPES: [RegExp, string][] = [
  [/fire|(^|[\s,(])אש($|[\s,).])/i, "אש (fire)"], [/cold|(^|[\s,(])קור($|[\s,).])/i, "קור (cold)"], [/lightning|ברק/i, "ברק (lightning)"], [/thunder|רעם/i, "רעם (thunder)"],
  [/acid|חומצה/i, "חומצה (acid)"], [/poison|רעל/i, "רעל (poison)"], [/necrotic|נקרוטי|נמק/i, "נמק (necrotic)"], [/radiant|קורן/i, "קורן (radiant)"],
  [/psychic|נפשי|תודעתי/i, "נפשי (psychic)"], [/force|כוח טהור/i, "כוח (force)"], [/slashing|חותך|חיתוך/i, "חיתוך (slashing)"], [/piercing|חודר|דוקר|דקירה/i, "דקירה (piercing)"],
  [/bludgeoning|מוחץ|חובט|הלם/i, "הלם (bludgeoning)"],
];
export function parseDamageType(t: string) { return DMG_TYPES.find(([re]) => re.test(t))?.[1] ?? "לפי הנשק / ראה תיאור"; }
// Dice that scale with level: "1d4, עולה ל-1d6 ברמה 6, 1d8 ברמה 10" → highest unlocked.
export function scaledDice(t: string, level: number): string {
  let dice = t.match(/\d+d\d+/)?.[0] ?? "—";
  for (const m of t.matchAll(/(\d+d\d+)\s*(?:ברמה|at level|ברמת)\s*(\d+)/gi)) if (level >= +m[2]) dice = m[1];
  return dice;
}
export function parseRange(t: string) {
  const m = t.match(/(\d+)\s*(?:ft|feet|רגל)/i);
  if (/self|עצמ/i.test(t) && !m) return "עצמי";
  if (/touch|מגע/i.test(t)) return "מגע";
  return m ? `${m[1]}ft` : /melee|קפא"פ|פנים/i.test(t) ? "מגע 5ft" : "—";
}
const CHOICE_ONLY = /^(אויב מועדף|חוקר טבעי|סגנון לחימה|ASI|Extra Attack|Hunter's Prey|Defensive Tactics|Multiattack$|Superior Hunter's Defense|Metamagic|Bonus Proficiency|Heavy Armor|Form of the Beast)/i;
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
      const spells = matchSpells(text).filter(id => {
        const nm = SPELL_INDEX.find(s => s.id === id)!.name;
        const m = text.match(new RegExp(`רמה (\\d+) ${nm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i"));
        return !m || cl.level >= +m[1];
      });
      if (spells.length) { spellIds.push(...spells); if (!/\d+d\d+/.test(f.desc)) { seen.add(base); continue; } }
      if (CHOICE_ONLY.test(f.name) || (/בחירה|בחר /.test(f.name + f.desc.slice(0, 40)) && !/\d+d\d+/.test(f.desc))) { seen.add(base); continue; }
      if (!IS_COMBAT.test(text)) continue;
      // Keep only the highest-level version of a scaling feature (e.g. Brutal Critical 1→2→3 dice).
      const later = feats.filter(g => g.name.replace(/\s*\(.*\)$/, "") === base).pop()!;
      seen.add(base);
      if ([...existingNames].some(n => n.includes(base))) continue;
      const dice = scaledDice(`${later.name} ${later.desc}`, cl.level);
      attacks.push({
        name: later.name, bonus: /save|הצלת/i.test(later.desc) && cls.spellAbility ? `DC ${8 + x.pb + x.mods[cls.spellAbility]}` : "—",
        damage: dice, damageType: dice === "—" ? "—" : parseDamageType(later.desc), range: parseRange(later.desc),
        resource: `${actionType(later.desc)} · ${uses(later.desc)}`,
        notes: later.desc, source: `${sub && sub.features.includes(later) ? sub.nameHe : cls.nameHe} ${later.level}`,
      });
    }
  }
  return { attacks, spellIds };
}

// ---------- Generic race-trait classifier ----------
import { getRace } from "./races";
export function raceTraitGrants(c: Character, x: Ctx, existingNames: Set<string>, existingSpells: Set<string>) {
  const attacks: GrantedAttack[] = []; const spellIds: string[] = [];
  const race = getRace(c.raceId); if (!race) return { attacks, spellIds };
  const sub = race.subraces?.find(s => s.id === c.subraceId);
  const traits = [...race.traits, ...(sub?.traits ?? [])].filter(t => (t.level ?? 1) <= x.level);
  const SKIP = /resilien|guardian of the depths|amphibious|resistance|darkvision|languages|proficiency|speed|build|size|creature type|longevity|age/i;
  for (const t of traits) {
    const text = `${t.name} ${t.desc}`;
    const spells = matchSpells(text).filter(id => !existingSpells.has(id));
    if (spells.length) { spellIds.push(...spells); continue; }
    if (SKIP.test(t.name) || !(IS_COMBAT.test(text) || /long rest|short rest|פעם ב|תגובה|bonus|Prof/i.test(t.desc))) continue;
    if ([...existingNames].some(n => n.toLowerCase().includes(t.name.toLowerCase().split(" (")[0]))) continue;
    const dice = text.match(/\d+d\d+/)?.[0] ?? "—";
    const dc = /save|הצלת/i.test(t.desc) ? `DC ${8 + x.pb + Math.max(x.mods.con, x.mods.cha, x.mods.wis)}` : /unarmed|claw|טפר|bite|נשיכ|horn|קרני/i.test(text) ? formatMod(x.mods.str + x.pb) : "—";
    attacks.push({
      name: t.name, bonus: dc, damage: dice, damageType: dice === "—" ? "—" : parseDamageType(t.desc), range: parseRange(t.desc),
      resource: `${actionType(t.desc)} · ${uses(t.desc)}`, notes: t.desc, source: `גזע: ${sub?.nameHe ?? race.nameHe}`,
    });
  }
  return { attacks, spellIds };
}
