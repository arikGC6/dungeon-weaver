import type { FightingStyle } from "../lib/dnd-types";

// Fighting Styles (PHB + XGtE + TCoE). Applied via calculations when relevant.
export const FIGHTING_STYLES: FightingStyle[] = [
  { id: "archery", name: "Archery", nameHe: "קליעה", desc: "+2 להתקפה עם נשק ranged.", bonuses: { rangedAttack: 2 } },
  { id: "defense", name: "Defense", nameHe: "הגנה", desc: "+1 AC כשלובש שריון כלשהו.", bonuses: { acWhenArmored: 1 } },
  { id: "dueling", name: "Dueling", nameHe: "דו-קרב", desc: "+2 נזק בנשק יד אחת ללא נשק נוסף.", bonuses: { oneHandedDamage: 2 } },
  { id: "great_weapon_fighting", name: "Great Weapon Fighting", nameHe: "נשק גדול", desc: "Reroll 1 או 2 בקוביית נזק של נשק two-handed/versatile ביד אחת." },
  { id: "protection", name: "Protection", nameHe: "הגנת בעלי-ברית", desc: "Reaction — disadvantage להתקפה נגד בעל ברית סמוך (כשמחזיק מגן)." },
  { id: "two_weapon_fighting", name: "Two-Weapon Fighting", nameHe: "שני נשקים", desc: "מוסיף את מודיפייר היכולת גם לנזק ה-off-hand." },
  { id: "blind_fighting", name: "Blind Fighting", nameHe: "קרב עיוור", desc: "Blindsight 10ft — רואה יצורים סמוכים גם ללא ראייה." },
  { id: "interception", name: "Interception", nameHe: "יירוט", desc: "Reaction — מפחית 1d10+prof נזק להתקפה על בעל ברית סמוך." },
  { id: "superior_technique", name: "Superior Technique", nameHe: "טכניקה עליונה", desc: "לומד maneuver אחד של Battle Master + superiority die d6 (1×/rest)." },
  { id: "thrown_weapon_fighting", name: "Thrown Weapon Fighting", nameHe: "נשק זריקה", desc: "שליפת נשק זריקה כחלק מההתקפה; +2 נזק כשזורק.", bonuses: { thrownDamage: 2 } },
  { id: "unarmed_fighting", name: "Unarmed Fighting", nameHe: "קרב ללא נשק", desc: "נזק unarmed d6 (d8 עם שתי ידיים פנויות); grapple — 1d4 נזק לתור." },
  { id: "close_quarters_shooter", name: "Close Quarters Shooter", nameHe: "יורה מקרוב", desc: "אין disadvantage מ-melee; +1 להתקפה ranged." },
  { id: "mariner", name: "Mariner", nameHe: "ימאי", desc: "+1 AC כשלא לובש שריון כבד; מהירות שחייה וטיפוס = מהירות רגילה.", bonuses: { acWhenArmored: 1 } },
  { id: "tunnel_fighter", name: "Tunnel Fighter", nameHe: "לוחם מנהרות", desc: "Bonus action — עמדת הגנה; OA ללא עלות reaction." },
  { id: "druidic_warrior", name: "Druidic Warrior", nameHe: "לוחם דרואידי", desc: "לומד 2 cantrips של Druid; WIS כיכולת ההטלה." },
];

export const getFightingStyle = (id: string) => FIGHTING_STYLES.find(s => s.id === id);

// How many fighting styles does the character know? (class + level)
export function fightingStyleSlots(classId: string, subclassId: string | undefined, level: number): number {
  let n = 0;
  if (classId === "fighter") n = 1;
  if (classId === "ranger" && level >= 2) n = 1;
  if (classId === "paladin" && level >= 2) n = 1;
  if (classId === "bard" && subclassId === "swords" && level >= 3) n = Math.max(n, 1);
  if (classId === "fighter" && subclassId === "champion" && level >= 10) n = 2;
  if (classId === "fighter" && subclassId === "samurai" && level >= 10) n = 2;
  if (classId === "fighter" && subclassId === "cavalier" && level >= 10) n = 2;
  return n;
}

// Fighting styles limited per class (which are legal).
export function fightingStylesFor(classId: string): string[] {
  const all = FIGHTING_STYLES.map(s => s.id);
  if (classId === "fighter") return all.filter(id => id !== "druidic_warrior" && id !== "mariner");
  if (classId === "paladin") return ["defense", "dueling", "great_weapon_fighting", "protection", "blind_fighting", "interception"];
  if (classId === "ranger") return ["archery", "defense", "dueling", "two_weapon_fighting", "blind_fighting", "druidic_warrior", "thrown_weapon_fighting"];
  if (classId === "bard") return ["dueling", "two_weapon_fighting", "blind_fighting"]; // College of Swords
  return all;
}
