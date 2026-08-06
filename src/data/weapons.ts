import type { Ability } from "../lib/dnd-types";

// Structured weapon table (PHB + common extras) with sharpened damage data.
// Used by the builder to auto-generate attack rows (to-hit + damage) for the sheet.
export interface Weapon {
  id: string;
  name: string;
  nameHe: string;
  group: "simple_melee" | "martial_melee" | "simple_ranged" | "martial_ranged";
  damageDice: string;            // "1d8"
  damageType: string;            // slashing / piercing / bludgeoning ...
  versatileDice?: string;        // two-handed damage for versatile weapons
  properties: string[];          // Finesse, Light, Heavy, Two-Handed, Reach, Thrown, Loading, Ammunition...
  range?: string;                // "20/60" or "150/600"
  weight?: number;               // lb
  cost?: string;
  notes?: string;
  magicBonus?: number;           // for magic entries below
}

const W = (
  id: string, name: string, nameHe: string, group: Weapon["group"],
  damageDice: string, damageType: string, properties: string[],
  extra?: Partial<Weapon>,
): Weapon => ({ id, name, nameHe, group, damageDice, damageType, properties, ...extra });

export const WEAPONS: Weapon[] = [
  // ===== Simple melee =====
  W("w_club", "Club", "אלה", "simple_melee", "1d4", "bludgeoning", ["Light"], { weight: 2, cost: "1 sp" }),
  W("w_dagger", "Dagger", "פגיון", "simple_melee", "1d4", "piercing", ["Finesse", "Light", "Thrown"], { range: "20/60", weight: 1, cost: "2 gp" }),
  W("w_greatclub", "Greatclub", "אלה כבדה", "simple_melee", "1d8", "bludgeoning", ["Two-Handed"], { weight: 10, cost: "2 sp" }),
  W("w_handaxe", "Handaxe", "גרזן-יד", "simple_melee", "1d6", "slashing", ["Light", "Thrown"], { range: "20/60", weight: 2, cost: "5 gp" }),
  W("w_javelin", "Javelin", "כידון", "simple_melee", "1d6", "piercing", ["Thrown"], { range: "30/120", weight: 2, cost: "5 sp" }),
  W("w_light_hammer", "Light Hammer", "פטיש קל", "simple_melee", "1d4", "bludgeoning", ["Light", "Thrown"], { range: "20/60", weight: 2, cost: "2 gp" }),
  W("w_mace", "Mace", "אלת לחימה", "simple_melee", "1d6", "bludgeoning", [], { weight: 4, cost: "5 gp" }),
  W("w_quarterstaff", "Quarterstaff", "מקל לחימה", "simple_melee", "1d6", "bludgeoning", ["Versatile"], { versatileDice: "1d8", weight: 4, cost: "2 sp" }),
  W("w_sickle", "Sickle", "מגל", "simple_melee", "1d4", "slashing", ["Light"], { weight: 2, cost: "1 gp" }),
  W("w_spear", "Spear", "חנית", "simple_melee", "1d6", "piercing", ["Thrown", "Versatile"], { versatileDice: "1d8", range: "20/60", weight: 3, cost: "1 gp" }),
  W("w_unarmed", "Unarmed Strike", "מכת יד חשופה", "simple_melee", "1", "bludgeoning", [], { notes: "מונק: קוביית אמנויות לחימה במקום 1." }),

  // ===== Simple ranged =====
  W("w_crossbow_light", "Light Crossbow", "קשת-חצים קלה", "simple_ranged", "1d8", "piercing", ["Ammunition", "Loading", "Two-Handed"], { range: "80/320", weight: 5, cost: "25 gp" }),
  W("w_dart", "Dart", "חץ-יד", "simple_ranged", "1d4", "piercing", ["Finesse", "Thrown"], { range: "20/60", weight: 0.25, cost: "5 cp" }),
  W("w_shortbow", "Shortbow", "קשת קצרה", "simple_ranged", "1d6", "piercing", ["Ammunition", "Two-Handed"], { range: "80/320", weight: 2, cost: "25 gp" }),
  W("w_sling", "Sling", "קלע", "simple_ranged", "1d4", "bludgeoning", ["Ammunition"], { range: "30/120", cost: "1 sp" }),

  // ===== Martial melee =====
  W("w_battleaxe", "Battleaxe", "גרזן קרב", "martial_melee", "1d8", "slashing", ["Versatile"], { versatileDice: "1d10", weight: 4, cost: "10 gp" }),
  W("w_flail", "Flail", "שוט-שרשרת", "martial_melee", "1d8", "bludgeoning", [], { weight: 2, cost: "10 gp" }),
  W("w_glaive", "Glaive", "גלייב", "martial_melee", "1d10", "slashing", ["Heavy", "Reach", "Two-Handed"], { weight: 6, cost: "20 gp" }),
  W("w_greataxe", "Greataxe", "גרזן ענק", "martial_melee", "1d12", "slashing", ["Heavy", "Two-Handed"], { weight: 7, cost: "30 gp" }),
  W("w_greatsword", "Greatsword", "חרב ענק", "martial_melee", "2d6", "slashing", ["Heavy", "Two-Handed"], { weight: 6, cost: "50 gp" }),
  W("w_halberd", "Halberd", "הלברד", "martial_melee", "1d10", "slashing", ["Heavy", "Reach", "Two-Handed"], { weight: 6, cost: "20 gp" }),
  W("w_lance", "Lance", "רומח פרשים", "martial_melee", "1d12", "piercing", ["Reach", "Special"], { weight: 6, cost: "10 gp", notes: "Disadvantage בטווח 5ft; דורש שתי ידיים ללא רכיבה." }),
  W("w_longsword", "Longsword", "חרב ארוכה", "martial_melee", "1d8", "slashing", ["Versatile"], { versatileDice: "1d10", weight: 3, cost: "15 gp" }),
  W("w_maul", "Maul", "פטיש ענק", "martial_melee", "2d6", "bludgeoning", ["Heavy", "Two-Handed"], { weight: 10, cost: "10 gp" }),
  W("w_morningstar", "Morningstar", "כוכב בוקר", "martial_melee", "1d8", "piercing", [], { weight: 4, cost: "15 gp" }),
  W("w_pike", "Pike", "כידון ארוך", "martial_melee", "1d10", "piercing", ["Heavy", "Reach", "Two-Handed"], { weight: 18, cost: "5 gp" }),
  W("w_rapier", "Rapier", "רפיר", "martial_melee", "1d8", "piercing", ["Finesse"], { weight: 2, cost: "25 gp" }),
  W("w_scimitar", "Scimitar", "סקימיטר", "martial_melee", "1d6", "slashing", ["Finesse", "Light"], { weight: 3, cost: "25 gp" }),
  W("w_shortsword", "Shortsword", "חרב קצרה", "martial_melee", "1d6", "piercing", ["Finesse", "Light"], { weight: 2, cost: "10 gp" }),
  W("w_trident", "Trident", "קלשון", "martial_melee", "1d6", "piercing", ["Thrown", "Versatile"], { versatileDice: "1d8", range: "20/60", weight: 4, cost: "5 gp" }),
  W("w_war_pick", "War Pick", "מכוש מלחמה", "martial_melee", "1d8", "piercing", [], { weight: 2, cost: "5 gp" }),
  W("w_warhammer", "Warhammer", "פטיש מלחמה", "martial_melee", "1d8", "bludgeoning", ["Versatile"], { versatileDice: "1d10", weight: 2, cost: "15 gp" }),
  W("w_whip", "Whip", "שוט", "martial_melee", "1d4", "slashing", ["Finesse", "Reach"], { weight: 3, cost: "2 gp" }),
  W("w_double_bladed_scimitar", "Double-Bladed Scimitar", "סקימיטר דו-להבי", "martial_melee", "2d4", "slashing", ["Two-Handed", "Special"], { weight: 6, cost: "100 gp", notes: "Revenant Blade / אלף: bonus action התקפה 1d4." }),

  // ===== Martial ranged =====
  W("w_blowgun", "Blowgun", "מקל נשיפה", "martial_ranged", "1", "piercing", ["Ammunition", "Loading"], { range: "25/100", weight: 1, cost: "10 gp" }),
  W("w_crossbow_hand", "Hand Crossbow", "קשת יד", "martial_ranged", "1d6", "piercing", ["Ammunition", "Light", "Loading"], { range: "30/120", weight: 3, cost: "75 gp" }),
  W("w_crossbow_heavy", "Heavy Crossbow", "קשת-חצים כבדה", "martial_ranged", "1d10", "piercing", ["Ammunition", "Heavy", "Loading", "Two-Handed"], { range: "100/400", weight: 18, cost: "50 gp" }),
  W("w_longbow", "Longbow", "קשת ארוכה", "martial_ranged", "1d8", "piercing", ["Ammunition", "Heavy", "Two-Handed"], { range: "150/600", weight: 2, cost: "50 gp" }),
  W("w_net", "Net", "רשת", "martial_ranged", "—", "—", ["Special", "Thrown"], { range: "5/15", weight: 3, cost: "1 gp", notes: "יצור Large או קטן יותר מוגבל (restrained); DC 10 STR לשחרור." }),

  // ===== Magic / special weapons (auto attack bonus) =====
  W("w_plus1_any", "+1 Weapon (generic)", "נשק +1", "martial_melee", "1d8", "לפי נשק", ["Magic"], { magicBonus: 1, notes: "+1 להתקפה ולנזק." }),
  W("w_plus2_any", "+2 Weapon (generic)", "נשק +2", "martial_melee", "1d8", "לפי נשק", ["Magic"], { magicBonus: 2, notes: "+2 להתקפה ולנזק." }),
  W("w_plus3_any", "+3 Weapon (generic)", "נשק +3", "martial_melee", "1d8", "לפי נשק", ["Magic"], { magicBonus: 3, notes: "+3 להתקפה ולנזק." }),
  W("w_flame_tongue", "Flame Tongue", "להב הלהבה", "martial_melee", "1d8", "slashing", ["Magic", "Versatile"], { versatileDice: "1d10", notes: "+2d6 נזק אש כשמופעל (bonus action)." }),
  W("w_frost_brand", "Frost Brand", "להב הכפור", "martial_melee", "1d8", "slashing", ["Magic", "Versatile"], { versatileDice: "1d10", notes: "+1d6 קור; התנגדות לאש." }),
  W("w_sun_blade", "Sun Blade", "להב השמש", "martial_melee", "1d8", "radiant", ["Finesse", "Magic"], { magicBonus: 2, notes: "+2 התקפה; +1d8 נגד undead; אור שמש 15ft." }),
  W("w_dragon_slayer", "Dragon Slayer", "קוטל דרקונים", "martial_melee", "1d8", "slashing", ["Magic", "Versatile"], { magicBonus: 1, versatileDice: "1d10", notes: "+3d6 נזק נגד דרקונים." }),
  W("w_giant_slayer", "Giant Slayer", "קוטל ענקים", "martial_melee", "1d8", "slashing", ["Magic", "Versatile"], { magicBonus: 1, versatileDice: "1d10", notes: "+2d6 נגד ענקים; STR save או נופל." }),
  W("w_vicious", "Vicious Weapon", "נשק מרושע", "martial_melee", "1d8", "לפי נשק", ["Magic"], { notes: "בגלגול 20 להתקפה — +7 נזק." }),
  W("w_holy_avenger", "Holy Avenger", "נוקם קדוש", "martial_melee", "1d8", "slashing", ["Magic", "Versatile"], { magicBonus: 3, versatileDice: "1d10", notes: "+2d10 radiant נגד fiend/undead; aura 10ft." }),
  W("w_oathbow", "Oathbow", "קשת השבועה", "martial_ranged", "1d8", "piercing", ["Ammunition", "Heavy", "Magic", "Two-Handed"], { range: "150/600", notes: "\"Sworn enemy\" — +3d6 piercing נגד היעד." }),
  W("w_hexblade_pact", "Pact Weapon (Hex Warrior)", "נשק ברית", "martial_melee", "1d8", "לפי נשק", ["Magic", "Special"], { notes: "השתמש ב-CHA להתקפה ולנזק במקום STR/DEX." }),

  // ===== Baldur's Gate 3 — melee weapons =====
  W("wb3_everburn", "The Everburn Blade", "להב הבעירה הנצחית", "martial_melee", "2d6", "slashing", ["Heavy", "Magic", "Two-Handed"], { notes: "+1d4 נזק אש בכל פגיעה." }),
  W("wb3_phalar_aluve", "Phalar Aluve", "פאלאר אלוּבֶה", "martial_melee", "1d8", "slashing", ["Finesse", "Magic", "Versatile"], { versatileDice: "1d10", notes: "Shriek: +1d4 thunder לאויבים · Sing: +1d4 לבעלי ברית." }),
  W("wb3_sussur_greatsword", "Sussur Greatsword", "להב הסוסור", "martial_melee", "2d6", "slashing", ["Heavy", "Magic", "Two-Handed"], { notes: "מבטל קסם באזור — היעד לא יכול להטיל כישופים עד תורו הבא." }),
  W("wb3_crimson_mischief", "Crimson Mischief", "מזימת הארגמן", "martial_melee", "1d6", "piercing", ["Finesse", "Light", "Magic"], { magicBonus: 2, notes: "+1d4 נזק נגד יעד עם Advantage; +Sneak Attack." }),
  W("wb3_bloodthirst", "Bloodthirst", "צמא-הדם", "martial_melee", "1d4", "piercing", ["Finesse", "Light", "Magic", "Thrown"], { magicBonus: 1, range: "20/60", notes: "קריטי על 19-20." }),
  W("wb3_duellists_prerogative", "Duellist's Prerogative", "זכות הדואליסט", "martial_melee", "1d8", "piercing", ["Finesse", "Magic"], { magicBonus: 2, notes: "Riposte נוסף כ-reaction; +1 טווח קריטיות בקרב יחיד." }),
  W("wb3_balduran_giantslayer", "Balduran's Giantslayer", "קוטל-הענקים של בלדוראן", "martial_melee", "2d6", "slashing", ["Heavy", "Magic", "Two-Handed"], { magicBonus: 3, notes: "STR הופך ל-23; נזק כפול נגד ענקים." }),
  W("wb3_nyrulna", "Nyrulna", "נירולנה", "martial_melee", "1d6", "piercing", ["Magic", "Thrown", "Versatile"], { magicBonus: 3, versatileDice: "1d8", range: "60/120", notes: "זריקה חוזרת ליד + פיצוץ thunder 2d4 ברדיוס 15ft." }),
  W("wb3_infernal_rapier", "Infernal Rapier", "רפיר תופתי", "martial_melee", "1d8", "piercing", ["Finesse", "Magic"], { magicBonus: 2, notes: "זימון Cambion פעם ביום." }),
  W("wb3_blood_of_lathander", "The Blood of Lathander", "דמו של לאתאנדר", "martial_melee", "1d8", "bludgeoning", ["Magic"], { magicBonus: 2, notes: "Sunbeam פעם ליום; ריפוי אוטומטי כשיורד ל-0 HP." }),
  W("wb3_sword_of_justice", "Sword of Justice", "חרב הצדק", "martial_melee", "1d8", "slashing", ["Magic", "Versatile"], { magicBonus: 1, versatileDice: "1d10", notes: "Justiciar's Retribution — bonus action מגן על בעל ברית." }),
  W("wb3_larethian_wrath", "Larethian's Wrath", "חמת לארתיאן", "martial_melee", "1d10", "slashing", ["Magic", "Two-Handed"], { magicBonus: 1, notes: "Bleeding Wound בפגיעה קריטית." }),
  W("wb3_shadow_blade", "Shar's Spear of Evening", "חנית הערביים", "martial_melee", "1d6", "piercing", ["Magic", "Thrown", "Versatile"], { magicBonus: 2, versatileDice: "1d8", range: "20/60", notes: "יוצרת חשיכה קסומה; Advantage בחשיכה." }),
  W("wb3_selunes_spear", "Selûne's Spear of Night", "חנית הליל של סלוּנֶה", "martial_melee", "1d6", "piercing", ["Magic", "Thrown", "Versatile"], { magicBonus: 2, versatileDice: "1d8", range: "20/60", notes: "Moonbeam פעם ליום; אור ירח 20ft." }),
  W("wb3_adamantine_scimitar", "Adamantine Scimitar", "סקימיטר אדמנטין", "martial_melee", "1d6", "slashing", ["Finesse", "Light", "Magic"], { notes: "פגיעה בשריון = קריטי אוטומטי; מתעלם מהתנגדות פיזית." }),
  W("wb3_adamantine_mace", "Adamantine Mace", "אלת אדמנטין", "simple_melee", "1d6", "bludgeoning", ["Magic"], { notes: "פגיעה מהממת (Prone) על יצור משוריין." }),
  W("wb3_sussur_dagger", "Sussur Dagger", "פגיון סוסור", "simple_melee", "1d4", "piercing", ["Finesse", "Light", "Magic", "Thrown"], { range: "20/60", notes: "מונע הטלת כישופים מהיעד." }),
  W("wb3_knife_of_undermountain", "Knife of the Undermountain King", "פגיון מלך המחתרת", "martial_melee", "1d4", "piercing", ["Finesse", "Light", "Magic"], { magicBonus: 1, notes: "התקפה חשאית מוסיפה 1d4 piercing." }),
  W("wb3_orphic_hammer", "The Orphic Hammer", "פטיש האורפי", "martial_melee", "1d8", "bludgeoning", ["Magic", "Versatile"], { magicBonus: 3, versatileDice: "1d10", notes: "פגיעה מבטלת התנגדויות ואזיקים קסומים." }),
  W("wb3_shattered_flail", "Shattered Flail", "שוט השברים", "martial_melee", "1d8", "bludgeoning", ["Magic"], { magicBonus: 1, notes: "+1d4 necrotic; מוריד CON של היעד." }),
  W("wb3_hellfire_greataxe", "Infernal Alloy Greataxe", "גרזן סגסוגת התופת", "martial_melee", "1d12", "slashing", ["Heavy", "Magic", "Two-Handed"], { magicBonus: 1, notes: "+1d6 נזק אש." }),
  W("wb3_gontrs_hammer", "Gontr Mael", "גונטר מאל", "martial_melee", "1d8", "bludgeoning", ["Magic", "Versatile"], { magicBonus: 3, versatileDice: "1d10", notes: "אור radiant; +1d6 radiant לפגיעות." }),
  W("wb3_unseen_menace", "Unseen Menace", "האיום הבלתי-נראה", "martial_melee", "1d10", "piercing", ["Heavy", "Magic", "Reach", "Two-Handed"], { magicBonus: 1, notes: "הופך שקוף — התקפות מגיעות עם Advantage." }),
  W("wb3_shar_dark_justiciar", "Justiciar's Greatsword", "חרב השופט האפל", "martial_melee", "2d6", "slashing", ["Heavy", "Magic", "Two-Handed"], { magicBonus: 1, notes: "+1d6 necrotic בחשיכה." }),

  // ===== Baldur's Gate 3 — ranged weapons =====
  W("wb3_titanstring_bow", "Titanstring Bow", "קשת מיתר-הטיטאן", "martial_ranged", "1d8", "piercing", ["Ammunition", "Heavy", "Magic", "Two-Handed"], { range: "150/600", notes: "מוסיפה את מודיפייר ה-STR לנזק בנוסף ל-DEX." }),
  W("wb3_hellrider_longbow", "Hellrider Longbow", "קשת רוכבי-הגיהינום", "martial_ranged", "1d8", "piercing", ["Ammunition", "Heavy", "Magic", "Two-Handed"], { range: "150/600", notes: "Bonus action: התקפה נוספת אחרי Dash." }),
  W("wb3_darkfire_shortbow", "Darkfire Shortbow", "קשת אש-האופל", "simple_ranged", "1d6", "piercing", ["Ammunition", "Magic", "Two-Handed"], { range: "80/320", magicBonus: 1, notes: "התנגדות לאש וקור; Haste פעם ליום." }),
  W("wb3_ne_una_shortbow", "The Dead Shot", "היורה המדויק", "martial_ranged", "1d8", "piercing", ["Ammunition", "Heavy", "Magic", "Two-Handed"], { range: "150/600", magicBonus: 1, notes: "+2 לגלגולי נזק; טווח קריטיות מורחב." }),
  W("wb3_gontr_mael_bow", "Gontr Mael (Longbow)", "קשת גונטר מאל", "martial_ranged", "1d8", "piercing", ["Ammunition", "Heavy", "Magic", "Two-Handed"], { range: "150/600", magicBonus: 3, notes: "חצי אור radiant — +1d4 radiant." }),
  W("wb3_bow_of_awareness", "Bow of Awareness", "קשת הערנות", "martial_ranged", "1d8", "piercing", ["Ammunition", "Heavy", "Magic", "Two-Handed"], { range: "150/600", notes: "+1 ליוזמה ולתפיסה." }),
  W("wb3_hand_crossbow_hellfire", "Hellfire Hand Crossbow", "קשת יד תופתית", "martial_ranged", "1d6", "piercing", ["Ammunition", "Light", "Loading", "Magic"], { range: "30/120", magicBonus: 1, notes: "Scorching Ray פעם ליום." }),
  W("wb3_firestoker", "Firestoker", "מלהיב-האש", "martial_ranged", "1d6", "piercing", ["Ammunition", "Light", "Loading", "Magic"], { range: "30/120", notes: "+1d4 אש כשהיעד בוער." }),
  W("wb3_crossbow_arcane_archery", "Crossbow of Arcane Precision", "קשת הדיוק הנסתר", "martial_ranged", "1d10", "piercing", ["Ammunition", "Heavy", "Loading", "Magic", "Two-Handed"], { range: "100/400", magicBonus: 2, notes: "מתעלמת מ-Cover קל." }),
  W("wb3_ballistic_library", "Ballista Bolt Thrower", "משגר הבליסטרה", "martial_ranged", "1d10", "piercing", ["Ammunition", "Heavy", "Loading", "Two-Handed"], { range: "100/400", notes: "פגיעה דוחפת את היעד 10ft." }),
  W("wb3_returning_pike", "Returning Pike", "כידון חוזר", "martial_ranged", "1d6", "piercing", ["Magic", "Thrown"], { range: "60/120", notes: "חוזר לידך אחרי הזריקה." }),

  // ===== The Creed (Assassin's Creed roguish archetype) — signature weapons =====
  W("wcr_hidden_blade", "Hidden Blade", "להב נסתר", "martial_melee", "1d6", "piercing", ["Finesse", "Light", "Special"], { weight: 1, notes: "נסתר בשרוול (DC 20 לגלות); על יעד מופתע — נזק Sneak Attack מקסימלי." }),
  W("wcr_twin_hidden_blades", "Twin Hidden Blades", "להבים נסתרים תאומים", "martial_melee", "1d6", "piercing", ["Finesse", "Light", "Special"], { weight: 2, notes: "התקפת שני נשקים ללא bonus action בפעם הראשונה בתור." }),
  W("wcr_phantom_blade", "Phantom Blade", "להב הפאנטום", "martial_ranged", "1d8", "piercing", ["Ammunition", "Light", "Loading", "Special"], { range: "60/180", weight: 2, notes: "קשת-להב נסתרת; שקטה — לא שוברת התגנבות." }),
  W("wcr_hookblade", "Hookblade", "להב-הוו", "martial_melee", "1d6", "slashing", ["Finesse", "Light", "Special"], { weight: 2, notes: "טיפוס וגרירה: bonus action לגרור יעד 10ft או להיתלות מקצה." }),
  W("wcr_assassin_kukri", "Creed Kukri", "קוקרי הכת", "martial_melee", "1d6", "slashing", ["Finesse", "Light"], { weight: 2, notes: "קריטי על 19-20 נגד יעד שאינו רואה אותך." }),
  W("wcr_rope_dart", "Rope Dart", "חץ-חבל", "simple_ranged", "1d4", "piercing", ["Finesse", "Thrown", "Special"], { range: "20/60", weight: 2, notes: "בפגיעה — מותר לגרור את היעד 10ft או להוריד אותו מגובה." }),
  W("wcr_smoke_bomb_launcher", "Smoke Launcher", "משגר עשן", "simple_ranged", "—", "—", ["Ammunition", "Special"], { range: "30/60", weight: 2, notes: "יוצר ענן עשן ברדיוס 10ft — מאפשר Hide מיידי." }),
  W("wcr_poison_darts", "Berserk Darts", "חצי הזעם", "simple_ranged", "1d4", "piercing", ["Finesse", "Thrown", "Special"], { range: "30/90", weight: 0.25, notes: "CON save DC 13 או היעד תוקף את הקרוב אליו בתורו." }),
];

export const getWeapon = (id: string) => WEAPONS.find(w => w.id === id);

export const WEAPON_GROUP_LABELS: Record<Weapon["group"], string> = {
  simple_melee: "פשוט — קרב פנים",
  martial_melee: "לחימה — קרב פנים",
  simple_ranged: "פשוט — טווח",
  martial_ranged: "לחימה — טווח",
};

/** Which ability a weapon uses (finesse/ranged → DEX unless STR is higher). */
export function weaponAbility(w: Weapon, mods: Record<Ability, number>, pactCha = false): Ability {
  if (pactCha && w.properties.includes("Special") && w.id === "w_hexblade_pact") return "cha";
  const ranged = w.group === "simple_ranged" || w.group === "martial_ranged";
  if (ranged) return "dex";
  if (w.properties.includes("Finesse")) return mods.dex >= mods.str ? "dex" : "str";
  return "str";
}

/** Build an attack row (bonus/damage strings) for a weapon. */
export function buildWeaponAttack(
  w: Weapon,
  opts: { mods: Record<Ability, number>; proficiencyBonus: number; proficient?: boolean; twoHanded?: boolean; pactCha?: boolean },
): { name: string; bonus: string; damage: string; notes: string } {
  const ab = weaponAbility(w, opts.mods, opts.pactCha);
  const abMod = opts.mods[ab] ?? 0;
  const magic = w.magicBonus ?? 0;
  const toHit = abMod + (opts.proficient === false ? 0 : opts.proficiencyBonus) + magic;
  const dice = opts.twoHanded && w.versatileDice ? w.versatileDice : w.damageDice;
  const dmgMod = abMod + magic;
  const dmg = dice === "—" ? "—" : `${dice}${dmgMod !== 0 ? (dmgMod > 0 ? `+${dmgMod}` : dmgMod) : ""} ${w.damageType}`;
  const noteBits = [
    w.range ? `טווח ${w.range}` : null,
    w.properties.length ? w.properties.join(", ") : null,
    ab.toUpperCase(),
    w.notes ?? null,
  ].filter(Boolean);
  return {
    name: w.nameHe,
    bonus: `${toHit >= 0 ? "+" : ""}${toHit}`,
    damage: dmg,
    notes: noteBits.join(" · "),
  };
}
