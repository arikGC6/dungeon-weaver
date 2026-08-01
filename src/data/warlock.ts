import type { Ability } from "../lib/dnd-types";

// Warlock Pact Boon + Eldritch Invocations (dnd5e.wikidot.com/warlock).
export interface PactBoon {
  id: string;
  name: string;
  nameHe: string;
  desc: string;
  grantsSpellIds?: string[];
  attackAbility?: Ability; // Pact of the Blade → CHA for pact weapon
}

export const PACT_BOONS: PactBoon[] = [
  {
    id: "chain", name: "Pact of the Chain", nameHe: "ברית השרשרת",
    desc: "לומד Find Familiar; הפמיליאר יכול להיות imp, pseudodragon, quasit או sprite. אתה יכול לוותר על התקפה כדי שהפמיליאר יתקוף בתגובה שלו.",
    grantsSpellIds: ["find_familiar"],
  },
  {
    id: "blade", name: "Pact of the Blade", nameHe: "ברית הלהב",
    desc: "יוצר נשק ברית (pact weapon) כ-action — כל נשק קרב פנים לבחירתך. אתה בקיא בו, והוא נחשב קסום. ניתן לקדש נשק קסום כדי שיהיה נשק הברית שלך.",
    attackAbility: "cha",
  },
  {
    id: "tome", name: "Pact of the Tome", nameHe: "ברית הספר",
    desc: "Book of Shadows — 3 קנטריפים מכל רשימת כישופים, ניתנים להטלה כרצונך ואינם נספרים בקנטריפים שלך.",
  },
  {
    id: "talisman", name: "Pact of the Talisman", nameHe: "ברית הקמע",
    desc: "קמע שנותן d4 לבדיקת יכולת שנכשלה, פרוף בונוס פעמים בין מנוחות ארוכות.",
  },
];

export const getPactBoon = (id?: string) => PACT_BOONS.find(p => p.id === id);

export interface Invocation {
  id: string;
  name: string;
  nameHe: string;
  desc: string;
  minLevel?: number;      // warlock level requirement
  requiresPact?: string;  // pact boon id
  requiresSpell?: string; // e.g. eldritch_blast
}

export const INVOCATIONS: Invocation[] = [
  { id: "agonizing_blast", name: "Agonizing Blast", nameHe: "פיצוץ מייסר", desc: "מוסיף CHA mod לנזק של כל קרן Eldritch Blast.", requiresSpell: "eldritch_blast" },
  { id: "repelling_blast", name: "Repelling Blast", nameHe: "פיצוץ הודף", desc: "פגיעה ב-Eldritch Blast הודפת את היעד עד 10ft.", requiresSpell: "eldritch_blast" },
  { id: "grasp_of_hadar", name: "Grasp of Hadar", nameHe: "אחיזת הדר", desc: "פעם בתור — Eldritch Blast מקרב את היעד 10ft אליך.", requiresSpell: "eldritch_blast" },
  { id: "lance_of_lethargy", name: "Lance of Lethargy", nameHe: "רומח הכבדות", desc: "פעם בתור — מוריד 10ft ממהירות היעד עד סוף תורך הבא.", requiresSpell: "eldritch_blast" },
  { id: "eldritch_spear", name: "Eldritch Spear", nameHe: "כידון על-טבעי", desc: "טווח Eldritch Blast עולה ל-300ft.", requiresSpell: "eldritch_blast" },
  { id: "devils_sight", name: "Devil's Sight", nameHe: "עין השד", desc: "רואה נורמלית בחשכה (כולל קסומה) עד 120ft." },
  { id: "agonizing_armor", name: "Armor of Shadows", nameHe: "שריון הצללים", desc: "מטיל Mage Armor על עצמך כרצונך, בלי slot." },
  { id: "mask_of_many_faces", name: "Mask of Many Faces", nameHe: "מסכת פנים רבות", desc: "מטיל Disguise Self כרצונך." },
  { id: "misty_visions", name: "Misty Visions", nameHe: "חזיונות אד", desc: "מטיל Silent Image כרצונך." },
  { id: "beast_speech", name: "Beast Speech", nameHe: "שפת החיות", desc: "מטיל Speak with Animals כרצונך." },
  { id: "beguiling_influence", name: "Beguiling Influence", nameHe: "השפעה מכשפת", desc: "בקיאות ב-Deception וב-Persuasion." },
  { id: "eyes_of_the_rune_keeper", name: "Eyes of the Rune Keeper", nameHe: "עיני שומר הרונות", desc: "קורא כל כתב." },
  { id: "thief_of_five_fates", name: "Thief of Five Fates", nameHe: "גנב חמש הגורלות", desc: "מטיל Bane פעם אחת בכל מנוחה ארוכה, עם slot." },
  { id: "fiendish_vigor", name: "Fiendish Vigor", nameHe: "מרץ שדי", desc: "מטיל False Life על עצמך כרצונך ברמה 1." },
  { id: "gaze_of_two_minds", name: "Gaze of Two Minds", nameHe: "מבט שני מוחות", desc: "חש דרך חושיו של יצור מסכים עד סוף תורך הבא." },
  { id: "book_of_ancient_secrets", name: "Book of Ancient Secrets", nameHe: "ספר סודות קדומים", desc: "לומד 2 ריטואלים מכל רשימה; ניתן להוסיף ריטואלים שנמצאו.", requiresPact: "tome" },
  { id: "aspect_of_the_moon", name: "Aspect of the Moon", nameHe: "פני הלבנה", desc: "אינך צריך לישון וקסם לא יכול להרדים אותך.", requiresPact: "tome", minLevel: 2 },
  { id: "voice_of_the_chain_master", name: "Voice of the Chain Master", nameHe: "קול אדון השרשרת", desc: "תקשורת טלפתית ותפיסת חושים דרך הפמיליאר בכל מרחק.", requiresPact: "chain" },
  { id: "investment_of_the_chain_master", name: "Investment of the Chain Master", nameHe: "השראת אדון השרשרת", desc: "הפמיליאר מקבל תעופה/שחייה 40ft, התקפות קסומות, DC לפי שלך.", requiresPact: "chain", minLevel: 5 },
  { id: "thirsting_blade", name: "Thirsting Blade", nameHe: "להב צמא", desc: "התקפה נוספת עם נשק הברית (Attack action ×2).", requiresPact: "blade", minLevel: 5 },
  { id: "eldritch_smite", name: "Eldritch Smite", nameHe: "מכת עלטה", desc: "לאחר פגיעה עם נשק הברית — נצל pact slot ל-1d8 force לכל רמה +1, והפלה.", requiresPact: "blade", minLevel: 5 },
  { id: "improved_pact_weapon", name: "Improved Pact Weapon", nameHe: "נשק ברית משופר", desc: "נשק הברית מקבל +1 להתקפה ולנזק; יכול להיות קשת; משמש כ-spellcasting focus.", requiresPact: "blade" },
  { id: "lifedrinker", name: "Lifedrinker", nameHe: "שותה חיים", desc: "נשק הברית מוסיף CHA mod נזק necrotic.", requiresPact: "blade", minLevel: 12 },
  { id: "rebukes_of_the_talisman", name: "Rebuke of the Talisman", nameHe: "גערת הקמע", desc: "כשעונד הקמע נפגע — reaction ל-PB נזק psychic והדיפה 10ft.", requiresPact: "talisman" },
  { id: "protection_of_the_talisman", name: "Protection of the Talisman", nameHe: "הגנת הקמע", desc: "עונד הקמע מוסיף d4 ל-saving throw שנכשל, PB פעמים.", requiresPact: "talisman", minLevel: 7 },
  { id: "one_with_shadows", name: "One with Shadows", nameHe: "אחד עם הצללים", desc: "באור עמום או חשכה — invisible עד שתזוז או תפעל.", minLevel: 5 },
  { id: "mire_the_mind", name: "Mire the Mind", nameHe: "בוץ המוח", desc: "מטיל Slow פעם אחת בכל מנוחה ארוכה, עם slot.", minLevel: 5 },
  { id: "sign_of_ill_omen", name: "Sign of Ill Omen", nameHe: "אות רע", desc: "מטיל Bestow Curse פעם בכל מנוחה ארוכה.", minLevel: 5 },
  { id: "trickster_magic", name: "Trickster's Escape", nameHe: "בריחת הנוכל", desc: "מטיל Freedom of Movement על עצמך פעם בכל מנוחה ארוכה.", minLevel: 7 },
  { id: "otherworldly_leap", name: "Otherworldly Leap", nameHe: "זינוק על-עולמי", desc: "מטיל Jump על עצמך כרצונך.", minLevel: 9 },
  { id: "ascendant_step", name: "Ascendant Step", nameHe: "צעד מרומם", desc: "מטיל Levitate על עצמך כרצונך.", minLevel: 9 },
  { id: "bewitching_whispers", name: "Bewitching Whispers", nameHe: "לחישות מכשפות", desc: "מטיל Compulsion פעם בכל מנוחה ארוכה עם slot.", minLevel: 7 },
  { id: "dreadful_word", name: "Dreadful Word", nameHe: "מילה מפחידה", desc: "מטיל Confusion פעם בכל מנוחה ארוכה עם slot.", minLevel: 7 },
  { id: "sculptor_of_flesh", name: "Sculptor of Flesh", nameHe: "פסל הבשר", desc: "מטיל Polymorph פעם בכל מנוחה ארוכה עם slot.", minLevel: 7 },
  { id: "minions_of_chaos", name: "Minions of Chaos", nameHe: "משרתי הכאוס", desc: "מטיל Conjure Elemental פעם בכל מנוחה ארוכה עם slot.", minLevel: 9 },
  { id: "whispers_of_the_grave", name: "Whispers of the Grave", nameHe: "לחישות הקבר", desc: "מטיל Speak with Dead כרצונך.", minLevel: 9 },
  { id: "master_of_myriad_forms", name: "Master of Myriad Forms", nameHe: "אדון הצורות", desc: "מטיל Alter Self כרצונך.", minLevel: 15 },
  { id: "visions_of_distant_realms", name: "Visions of Distant Realms", nameHe: "חזיונות ממלכות רחוקות", desc: "מטיל Arcane Eye כרצונך.", minLevel: 15 },
  { id: "witch_sight", name: "Witch Sight", nameHe: "ראיית מכשפות", desc: "רואה את צורתו האמיתית של יצור מוסווה/משנה-צורה עד 30ft.", minLevel: 15 },
  { id: "chains_of_carceri", name: "Chains of Carceri", nameHe: "שלשלאות קרקרי", desc: "מטיל Hold Monster על celestial/fiend/elemental ללא slot, פעם למנוחה ארוכה לכל יעד.", requiresPact: "chain", minLevel: 15 },
  { id: "eldritch_mind", name: "Eldritch Mind", nameHe: "מוח על-טבעי", desc: "יתרון ב-CON saves לשמירת ריכוז." },
  { id: "gift_of_the_depths", name: "Gift of the Depths", nameHe: "מנחת המעמקים", desc: "נשימה תחת מים, שחייה בקצב ההליכה, Water Breathing פעם למנוחה.", minLevel: 5 },
  { id: "gift_of_the_ever_living_ones", name: "Gift of the Ever-Living Ones", nameHe: "מנחת החיים הנצחיים", desc: "כשמתרפא בעוד הפמיליאר בטווח 100ft — מקבל את המקסימום של קוביות הריפוי.", requiresPact: "chain" },
  { id: "maddening_hex", name: "Maddening Hex", nameHe: "קללה מטריפה", desc: "Bonus action — נזק psychic בגובה CHA mod ליעד מקולל.", minLevel: 5 },
  { id: "relentless_hex", name: "Relentless Hex", nameHe: "קללה בלתי-נלאית", desc: "Bonus action — טלפורט 30ft לצד היעד המקולל.", minLevel: 7 },
  { id: "tomb_of_levistus", name: "Tomb of Levistus", nameHe: "קבר לוויסטוס", desc: "Reaction בנזק — 10 temp HP לכל רמת וורלוק, אך מהירות 0 והקפאה.", minLevel: 5 },
  { id: "shroud_of_shadow", name: "Shroud of Shadow", nameHe: "מעטה צל", desc: "מטיל Invisibility כרצונך.", minLevel: 15 },
  { id: "cloak_of_flies", name: "Cloak of Flies", nameHe: "מעטה זבובים", desc: "Bonus action — הילה 5ft, CHA mod נזק רעל ליריבים שמתחילים תור בה.", minLevel: 5 },
];

/** Number of invocations known by warlock level (PHB table). */
export function invocationsKnown(warlockLevel: number): number {
  if (warlockLevel < 2) return 0;
  const table = [0, 0, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 8];
  return table[Math.min(20, warlockLevel)] ?? 0;
}

export function isInvocationAvailable(inv: Invocation, opts: { level: number; pactBoonId?: string; knownSpellIds: string[] }): boolean {
  if (inv.minLevel && opts.level < inv.minLevel) return false;
  if (inv.requiresPact && inv.requiresPact !== opts.pactBoonId) return false;
  if (inv.requiresSpell && !opts.knownSpellIds.includes(inv.requiresSpell)) return false;
  return true;
}
