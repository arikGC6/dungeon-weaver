import type { Feat } from "../lib/dnd-types";

// Feats (Fates) — bonuses applied automatically where structured.
export const FEATS: Feat[] = [
  { id: "alert", name: "Alert", nameHe: "ערני",
    description: "+5 initiative; אינך מופתע בעוד הכרתך פעילה; יצורים לא מקבלים advantage בלתי-נראה.",
    bonuses: { initiative: 5 } },
  { id: "athlete", name: "Athlete", nameHe: "אתלט", prerequisite: "—",
    description: "+1 STR או DEX. עלייה מ-prone — 5ft בלבד. טיפוס לא עולה תנועה. ריצה — 5ft start.",
    bonuses: { ability: [{ ability: "str", amount: 1 }] } },
  { id: "actor", name: "Actor", nameHe: "שחקן",
    description: "+1 CHA. Advantage על Deception/Performance להתחזות. חיקוי דיבור.",
    bonuses: { ability: [{ ability: "cha", amount: 1 }] } },
  { id: "charger", name: "Charger", nameHe: "מסתער",
    description: "אחרי Dash — bonus action התקפה. +5 נזק או דחיפה 10ft." },
  { id: "crossbow_expert", name: "Crossbow Expert", nameHe: "מומחה קשת",
    description: "ללא loading על קשתות; אין disadvantage מ-melee; bonus action התקפה עם hand crossbow." },
  { id: "defensive_duelist", name: "Defensive Duelist", nameHe: "דו-קרבן הגנתי", prerequisite: "DEX 13+",
    description: "Reaction — +proficiency bonus AC נגד התקפה אחת." },
  { id: "dual_wielder", name: "Dual Wielder", nameHe: "כפול-נשק",
    description: "+1 AC עם 2 נשקים; שני-נשק עם non-light; שליפת 2 נשקים." },
  { id: "dungeon_delver", name: "Dungeon Delver", nameHe: "חוקר מבוכים",
    description: "Advantage על Perception/Investigation למלכודות; resistance לנזק מלכודות." },
  { id: "durable", name: "Durable", nameHe: "עמיד",
    description: "+1 CON. Hit dice ריפוי מינימום = 2× CON mod.",
    bonuses: { ability: [{ ability: "con", amount: 1 }] } },
  { id: "elemental_adept", name: "Elemental Adept", nameHe: "אמן יסוד", prerequisite: "Spellcasting",
    description: "Ignore resistance; minimum 2 לכל קוביית נזק יסוד." },
  { id: "grappler", name: "Grappler", nameHe: "תופס", prerequisite: "STR 13+",
    description: "Advantage על התקפות נגד grappled; pin שני יצורים restrained." },
  { id: "great_weapon_master", name: "Great Weapon Master", nameHe: "אומן נשק גדול",
    description: "אחרי קריט/הריגה — bonus action attack. -5 התקפה ל-+10 נזק עם heavy melee." },
  { id: "healer", name: "Healer", nameHe: "מרפא",
    description: "Healer's kit — 1 HP + מספר hit dice. Action — 1d6+4+level HP." },
  { id: "heavily_armored", name: "Heavily Armored", nameHe: "משוריין-כבד", prerequisite: "Medium armor prof",
    description: "+1 STR; Heavy armor proficiency.",
    bonuses: { ability: [{ ability: "str", amount: 1 }] } },
  { id: "heavy_armor_master", name: "Heavy Armor Master", nameHe: "אומן שריון כבד", prerequisite: "Heavy armor prof",
    description: "+1 STR; -3 לנזק bludgeoning/piercing/slashing מ-non-magical.",
    bonuses: { ability: [{ ability: "str", amount: 1 }] } },
  { id: "inspiring_leader", name: "Inspiring Leader", nameHe: "מנהיג מעורר השראה", prerequisite: "CHA 13+",
    description: "10 דק' נאום — עד 6 בני ברית מקבלים level + CHA mod temp HP." },
  { id: "keen_mind", name: "Keen Mind", nameHe: "חד-מחשבה",
    description: "+1 INT. זוכר כיוון צפון, שעה, ופעולות 30 ימים אחורה.",
    bonuses: { ability: [{ ability: "int", amount: 1 }] } },
  { id: "lightly_armored", name: "Lightly Armored", nameHe: "שריון קל",
    description: "+1 STR או DEX. Light armor proficiency." },
  { id: "linguist", name: "Linguist", nameHe: "בלשן",
    description: "+1 INT. לומד 3 שפות. יוצר צפנים.",
    bonuses: { ability: [{ ability: "int", amount: 1 }] } },
  { id: "lucky", name: "Lucky", nameHe: "בר-מזל",
    description: "3 נקודות מזל פר long rest — re-roll התקפה/save/check, או החלפת d20 של אויב." },
  { id: "mage_slayer", name: "Mage Slayer", nameHe: "צייד קוסמים",
    description: "Reaction attack כשspellcaster ליד; advantage על saves נגד spells של יצורים סמוכים." },
  { id: "magic_initiate", name: "Magic Initiate", nameHe: "מתחיל בקסם",
    description: "בחר קלאס — 2 cantrips + spell רמה 1 (1×/long rest)." },
  { id: "martial_adept", name: "Martial Adept", nameHe: "טוקטיקאי קרב",
    description: "2 maneuvers של Battle Master + superiority die d6 (1×/rest)." },
  { id: "medium_armor_master", name: "Medium Armor Master", nameHe: "אומן שריון בינוני", prerequisite: "Medium armor prof",
    description: "Medium armor אין disadvantage על Stealth; DEX cap +3 (במקום +2)." },
  { id: "mobile", name: "Mobile", nameHe: "זריז",
    description: "+10 ft מהירות; Dash דרך difficult terrain; melee attack — no OA מאותה מטרה.",
    bonuses: { speed: 10 } },
  { id: "moderately_armored", name: "Moderately Armored", nameHe: "שריון בינוני",
    description: "+1 STR או DEX; Medium armor + shield proficiency." },
  { id: "mounted_combatant", name: "Mounted Combatant", nameHe: "פרש",
    description: "Advantage נגד יצורים קטנים יותר על קרקע; הפנייה התקפה למרכז; advantage על DEX saves." },
  { id: "observant", name: "Observant", nameHe: "מבחין",
    description: "+1 INT או WIS. קורא שפתיים. +5 לציון פסיבי Perception ו-Investigation.",
    bonuses: { ability: [{ ability: "wis", amount: 1 }] } },
  { id: "polearm_master", name: "Polearm Master", nameHe: "אומן רומח",
    description: "Bonus action — נזק ידית 1d4. OA על כניסה לטווח." },
  { id: "resilient", name: "Resilient", nameHe: "עמיד",
    description: "+1 לאחת היכולות + proficiency על save שלה." },
  { id: "ritual_caster", name: "Ritual Caster", nameHe: "חוזר על טקסים",
    description: "ספר טקסים — 2 spells רמה 1 ראשונה, יכול להוסיף." },
  { id: "savage_attacker", name: "Savage Attacker", nameHe: "מכה פראית",
    description: "פעם פר תור — re-roll נזק נשק קרבי, בחר טוב יותר." },
  { id: "sentinel", name: "Sentinel", nameHe: "זקיף",
    description: "OA — 0 speed; Disengage לא חוסם OA; reaction על Attack על בעל ברית." },
  { id: "sharpshooter", name: "Sharpshooter", nameHe: "צלף",
    description: "אין disadvantage על long range; cover רגיל לא חוסם; -5 התקפה ל-+10 נזק." },
  { id: "shield_master", name: "Shield Master", nameHe: "אומן מגן",
    description: "Bonus action — shove. +shield AC על DEX saves. Reaction חצי נזק על save שעבר." },
  { id: "skilled", name: "Skilled", nameHe: "מיומן",
    description: "Proficiency ב-3 מיומנויות או tools." },
  { id: "skulker", name: "Skulker", nameHe: "מסתתר", prerequisite: "DEX 13+",
    description: "Hide גם עם cover קל. החמצה ranged לא חושפת מיקום." },
  { id: "spell_sniper", name: "Spell Sniper", nameHe: "צלף קסמים", prerequisite: "Spellcasting",
    description: "טווח כפול; cover רגיל לא חוסם; +cantrip מ-attack roll." },
  { id: "tavern_brawler", name: "Tavern Brawler", nameHe: "בריון פאב",
    description: "+1 STR או CON. נזק unarmed d4; bonus action grapple אחרי unarmed/improvised attack.",
    bonuses: { ability: [{ ability: "str", amount: 1 }] } },
  { id: "tough", name: "Tough", nameHe: "חסון",
    description: "+2 HP לרמה.",
    bonuses: { hpPerLevel: 2 } },
  { id: "war_caster", name: "War Caster", nameHe: "מטיל קסם בקרב", prerequisite: "Spellcasting",
    description: "Advantage על CON concentration saves; somatic עם ידיים תפוסות; OA — להטיל spell במקום." },
  { id: "weapon_master", name: "Weapon Master", nameHe: "אומן נשק",
    description: "+1 STR או DEX; proficiency ב-4 נשקים נוספים." },
  { id: "fey_touched", name: "Fey Touched", nameHe: "מגע פיות",
    description: "+1 INT/WIS/CHA; Misty Step + 1 spell רמה 1 enchantment/divination. 1×/long rest free.",
    bonuses: { ability: [{ ability: "wis", amount: 1 }] } },
  { id: "shadow_touched", name: "Shadow Touched", nameHe: "מגע צל",
    description: "+1 INT/WIS/CHA; Invisibility + 1 spell illusion/necromancy רמה 1. 1×/rest free.",
    bonuses: { ability: [{ ability: "int", amount: 1 }] } },
  { id: "telekinetic", name: "Telekinetic", nameHe: "טלקינטי",
    description: "+1 INT/WIS/CHA; Mage Hand 30ft, invisible. Bonus action — דחיפה 5ft.",
    bonuses: { ability: [{ ability: "int", amount: 1 }] } },
  { id: "telepathic", name: "Telepathic", nameHe: "טלפתי",
    description: "+1 INT/WIS/CHA; טלפתיה 60ft; Detect Thoughts 1×/rest.",
    bonuses: { ability: [{ ability: "cha", amount: 1 }] } },
  { id: "fortune_eater", name: "Eldritch Adept", nameHe: "מתחיל אלדריטץ'", prerequisite: "Spellcasting",
    description: "לומד Eldritch Invocation אחת של Warlock." },
  { id: "piercer", name: "Piercer", nameHe: "דוקר",
    description: "+1 STR/DEX. Reroll קוביית נזק piercing פעם בתור; קריט piercing — קובייה נוספת.",
    bonuses: { ability: [{ ability: "dex", amount: 1 }] } },
  { id: "slasher", name: "Slasher", nameHe: "חותך",
    description: "+1 STR/DEX. פגיעה slashing מפחיתה 10ft מהירות; קריט slashing — disadvantage לתקוף.",
    bonuses: { ability: [{ ability: "str", amount: 1 }] } },
  { id: "crusher", name: "Crusher", nameHe: "מוחץ",
    description: "+1 STR/CON. פגיעה bludgeoning זזה יעד 5ft; קריט bludgeoning — advantage נגד היעד.",
    bonuses: { ability: [{ ability: "str", amount: 1 }] } },
  { id: "skill_expert", name: "Skill Expert", nameHe: "מומחה מיומנות",
    description: "+1 לאיזו יכולת שתבחר; proficiency במיומנות + expertise במיומנות אחרת." },
  { id: "chef", name: "Chef", nameHe: "שף",
    description: "+1 CON/WIS. Cook's utensils. Short rest — מכין אוכל שנותן +d8 HP; פינוק מתוק — temp HP.",
    bonuses: { ability: [{ ability: "con", amount: 1 }] } },
  { id: "gunner", name: "Gunner", nameHe: "רובאי",
    description: "+1 DEX. Proficiency בכל נשק אש; אין disadvantage מ-melee; loading לא חוסם.",
    bonuses: { ability: [{ ability: "dex", amount: 1 }] } },
  { id: "metamagic_adept", name: "Metamagic Adept", nameHe: "מיומן מטמגיה", prerequisite: "Spellcasting",
    description: "לומד 2 metamagic + 2 sorcery points." },
  { id: "fighting_initiate", name: "Fighting Initiate", nameHe: "מתחיל קרב", prerequisite: "Weapon prof",
    description: "לומד Fighting Style אחד של Fighter." },
  { id: "poisoner", name: "Poisoner", nameHe: "רעלן",
    description: "+1 DEX/INT. התקפות אינן מפחיתות מ-resistance לרעל; מריחת רעל bonus action; רעלים ייחודיים.",
    bonuses: { ability: [{ ability: "dex", amount: 1 }] } },
  { id: "artificer_initiate", name: "Artificer Initiate", nameHe: "מתחיל ארטיפיסר",
    description: "לומד cantrip של Artificer + spell רמה 1 (1×/rest); proficiency ב-tools." },
  { id: "gift_of_the_chromatic_dragon", name: "Gift of the Chromatic Dragon", nameHe: "מתת דרקון צבעוני",
    description: "Bonus action — נשק +1d4 יסוד; reaction — resistance ליסוד עד סוף התור." },
  { id: "gift_of_the_metallic_dragon", name: "Gift of the Metallic Dragon", nameHe: "מתת דרקון מתכתי",
    description: "לומד Cure Wounds; reaction — כנפי דרקון תפצה +AC." },
  { id: "fey_teleportation", name: "Fey Teleportation", nameHe: "טלפורט פייה", prerequisite: "Elf (high)",
    description: "+1 INT/CHA. Sylvan. Misty Step 1×/rest.",
    bonuses: { ability: [{ ability: "int", amount: 1 }] } },
  { id: "orcish_fury", name: "Orcish Fury", nameHe: "זעם אורק", prerequisite: "Half-Orc",
    description: "+1 STR/CON. פעם פר rest — קוביית נזק נוספת בפגיעה; reaction bite d4.",
    bonuses: { ability: [{ ability: "str", amount: 1 }] } },

  // ===== Extended feats (PHB + XGtE + TCoE + FTD + Wikidot) =====
  { id: "prodigy", name: "Prodigy", nameHe: "עילוי", prerequisite: "Half-elf, Half-orc, Human",
    description: "Proficiency במיומנות + כלי + שפה נוספת. Expertise במיומנות אחת שאתה בקיא בה." },
  { id: "squat_nimbleness", name: "Squat Nimbleness", nameHe: "זריזות קטן-גזרה", prerequisite: "Small race",
    description: "+1 STR/DEX. +5ft speed. Proficiency ב-Acrobatics או Athletics; advantage על escape מ-grapple.",
    bonuses: { ability: [{ ability: "dex", amount: 1 }], speed: 5 } },
  { id: "bountiful_luck", name: "Bountiful Luck", nameHe: "מזל שופע", prerequisite: "Halfling",
    description: "בעל ברית 30ft שגלגל 1 — אתה גורם לו לגלגל מחדש." },
  { id: "dragon_fear", name: "Dragon Fear", nameHe: "אימת דרקון", prerequisite: "Dragonborn",
    description: "+1 STR/CON/CHA. Action — אויבים 30ft: WIS save DC=8+prof+CHA או frightened דקה.",
    bonuses: { ability: [{ ability: "str", amount: 1 }] } },
  { id: "dragon_hide", name: "Dragon Hide", nameHe: "עור דרקון", prerequisite: "Dragonborn",
    description: "+1 STR/CON/CHA. Natural armor 13+DEX. טופר — 1d4+STR slashing.",
    bonuses: { ability: [{ ability: "con", amount: 1 }] } },
  { id: "drow_high_magic", name: "Drow High Magic", nameHe: "קסם דרואו גבוה", prerequisite: "Elf (Drow)",
    description: "לומד Detect Magic (at will), Levitate + Dispel Magic (1×/rest each)." },
  { id: "elven_accuracy", name: "Elven Accuracy", nameHe: "דיוק אלף", prerequisite: "Elf/Half-elf",
    description: "+1 DEX/INT/WIS/CHA. עם advantage בהתקפה שמשתמשת ב-DEX/INT/WIS/CHA — reroll d20 אחד.",
    bonuses: { ability: [{ ability: "dex", amount: 1 }] } },
  { id: "flames_of_phlegethos", name: "Flames of Phlegethos", nameHe: "להבות פלגתוס", prerequisite: "Tiefling",
    description: "+1 INT/CHA. Reroll 1 בקסמי אש. יעדים סמוכים 5ft — 1d4 fire בהיטעה בהתקפה שלך.",
    bonuses: { ability: [{ ability: "int", amount: 1 }] } },
  { id: "infernal_constitution", name: "Infernal Constitution", nameHe: "חוסן שאולי", prerequisite: "Tiefling",
    description: "+1 CON. Resistance ל-cold ולרעל. Advantage על saves נגד poisoned.",
    bonuses: { ability: [{ ability: "con", amount: 1 }] } },
  { id: "second_chance", name: "Second Chance", nameHe: "הזדמנות שנייה", prerequisite: "Halfling",
    description: "+1 DEX/CON/CHA. Reaction — אויב פגע בך — הוא מגלגל שוב.",
    bonuses: { ability: [{ ability: "dex", amount: 1 }] } },
  { id: "wood_elf_magic", name: "Wood Elf Magic", nameHe: "קסם אלף היער", prerequisite: "Elf (Wood)",
    description: "לומד Longstrider + Pass Without Trace + 1 druid cantrip." },
  { id: "revenant_blade", name: "Revenant Blade", nameHe: "להב שב", prerequisite: "Elf",
    description: "+1 DEX/STR. Double-bladed scimitar — finesse, versatile (d6). +1 AC כשמחזיק אותו.",
    bonuses: { ability: [{ ability: "dex", amount: 1 }] } },
  { id: "dwarven_fortitude", name: "Dwarven Fortitude", nameHe: "עקשנות ננסית", prerequisite: "Dwarf",
    description: "+1 CON. Dodge — יכול לבזבז hit die להחזיר HP.",
    bonuses: { ability: [{ ability: "con", amount: 1 }] } },
  { id: "fade_away", name: "Fade Away", nameHe: "היעלמות", prerequisite: "Gnome",
    description: "+1 DEX/INT. Reaction אחרי נזק — Invisible עד סוף התור הבא.",
    bonuses: { ability: [{ ability: "dex", amount: 1 }] } },
  { id: "gift_of_the_gem_dragon", name: "Gift of the Gem Dragon", nameHe: "מתת דרקון-אבן",
    description: "+1 INT/WIS/CHA. Reaction פסי — יעד שדחף אותך: INT save או telekinetic push.",
    bonuses: { ability: [{ ability: "wis", amount: 1 }] } },
  { id: "rune_shaper", name: "Rune Shaper", nameHe: "מעצב רונות", prerequisite: "Giant/Dwarf",
    description: "לומד רונה אחת של Rune Knight." },
  { id: "fey_teleportation_hi", name: "High Elven Teleportation", nameHe: "טלפורט אלף גבוה", prerequisite: "Elf (High)",
    description: "+1 INT/CHA. Sylvan. Misty Step 1×/rest ללא slot.",
    bonuses: { ability: [{ ability: "cha", amount: 1 }] } },
  { id: "svirfneblin_magic", name: "Svirfneblin Magic", nameHe: "קסם סווירפנבלין", prerequisite: "Deep Gnome",
    requirements: { race: ["gnome"], subrace: ["deep-gnome", "svirfneblin"] },
    description: "לומד Nondetection, Blindness/Deafness, Blur, Disguise Self (1×/long rest each)." },

  // ===== Additional feats (TCoE / SCAG / FTD / SAiS / Wikidot) =====
  { id: "blessed_warrior", name: "Blessed Warrior", nameHe: "לוחם ברוך",
    requirements: { class: ["fighter"] },
    description: "לומד 2 cantrips מרשימת ה-Cleric (WIS). מיועד ללוחם." },
  { id: "blessed_strikes", name: "Blessed Strikes", nameHe: "מכות ברוכות",
    requirements: { class: ["cleric"] },
    description: "פעם בתור — נזק +1d8 radiant בפגיעת נשק, או cantrip radiant מרשימה." },
  { id: "practiced_expert", name: "Practiced Expert", nameHe: "מומחה מנוסה",
    description: "+1 לכל יכולת. Proficiency במיומנות/כלי. Expertise במיומנות אחת." },
  { id: "musician", name: "Musician", nameHe: "מוזיקאי",
    description: "Proficiency ב-3 כלי נגינה. אחרי short/long rest — עד prof בעלי ברית מקבלים Inspiration." },
  { id: "rune_carver", name: "Rune Carver", nameHe: "חורט רונות",
    description: "לומד רונה של Rune Knight — Cloud/Fire/Frost/Stone/Hill/Storm." },
  { id: "squire_of_solamnia", name: "Squire of Solamnia", nameHe: "נושא-כלים סולמניה",
    requirements: { class: ["fighter", "paladin"] },
    description: "אחת מ-3: Precise Strike / Adept Rider / Squire's Haste (bonus action Dash 1×/rest)." },
  { id: "knight_of_solamnia", name: "Knight of Solamnia", nameHe: "אביר סולמניה", prerequisite: "Squire of Solamnia",
    requirements: { class: ["fighter", "paladin"] },
    description: "אחת מ-3: Honorable Strike / Mounted Guardian / Aggressive Advance." },
  { id: "aberrant_dragonmark", name: "Aberrant Dragonmark", nameHe: "טביעת דרקון סוררת",
    requirements: { race: ["human"] },
    description: "+1 CON. לומד cantrip של Sorcerer + spell רמה 1 (1×/rest). אבל surge של קסם פראי כשמעלה רמה.",
    bonuses: { ability: [{ ability: "con", amount: 1 }] } },
  { id: "strixhaven_initiate", name: "Strixhaven Initiate", nameHe: "מתחיל סטריקסהייבן",
    description: "בחר מכללה: 2 cantrips + 1 spell רמה 1 + spell נוסף רמה 2 (1×/rest)." },
  { id: "strixhaven_mascot", name: "Strixhaven Mascot", nameHe: "מסקוט סטריקסהייבן", prerequisite: "Strixhaven Initiate + 4+",
    description: "מזמין find familiar כמסקוט + bonus reactions לפי מכללה." },
  { id: "gunner_alt", name: "Gunner (Repeating)", nameHe: "רובאי חוזר",
    requirements: { minAbility: { dex: 13 } },
    description: "+1 DEX. Loading לא חוסם; אין disadvantage מ-melee עם נשק חם.",
    bonuses: { ability: [{ ability: "dex", amount: 1 }] } },
  { id: "wonder_maker", name: "Wonder Maker", nameHe: "יוצר פלאות",
    requirements: { class: ["artificer"] },
    description: "לומד 2 סוגי nifty tricks על חפצים קטנים." },
  { id: "sun_blessed", name: "Sun Blessed", nameHe: "מבורך שמש",
    description: "+1 CON. Resistance ל-radiant. פעם ב-rest — bonus action פליטת אור 30ft.",
    bonuses: { ability: [{ ability: "con", amount: 1 }] } },
  { id: "metabolic_control", name: "Metabolic Control", nameHe: "שליטה מטבולית",
    description: "+1 CON. אין צורך באוכל/שינה במשך 3 ימים; advantage על exhaustion saves.",
    bonuses: { ability: [{ ability: "con", amount: 1 }] } },
  { id: "silver_tongue", name: "Silver Tongue", nameHe: "לשון כסופה",
    requirements: { minAbility: { cha: 13 } },
    description: "+1 CHA. Persuasion/Deception — יעד נמוך מ-10 מגלגל כאילו הוציא 10.",
    bonuses: { ability: [{ ability: "cha", amount: 1 }] } },
  { id: "shield_training", name: "Shield Training", nameHe: "אימון מגן",
    requirements: { armorProf: "shield" },
    description: "+1 STR/DEX/CON. Proficiency במגנים. שימוש בקסם עם מגן ביד." },
];


export const getFeat = (id: string) => FEATS.find(f => f.id === id);

// ===== Auto feats — granted automatically by class/subclass. =====
// These are separate "feat-like" bonuses so we can display them in the
// character sheet and (optionally) apply structured bonuses via calculations.
export interface AutoFeat {
  id: string;
  name: string;
  nameHe: string;
  source: string; // "Fighter · Champion (7)"
  description: string;
  bonuses?: Feat["bonuses"];
}

const AUTO_TABLE: { match: (classId: string, subclassId: string | undefined, level: number) => boolean; feat: AutoFeat }[] = [
  { match: (c, _s, l) => c === "fighter" && l >= 1, feat: {
    id: "auto_fighting_style", name: "Fighting Style", nameHe: "סגנון קרב",
    source: "Fighter (1)", description: "בחר סגנון קרב אחד — הבונוס מיושם אוטומטית ברגע שתסמן אותו במסך ה-Feats.",
  } },
  { match: (c, s, l) => c === "fighter" && s === "champion" && l >= 7, feat: {
    id: "auto_remarkable_athlete", name: "Remarkable Athlete", nameHe: "אתלט יוצא דופן",
    source: "Champion (7)", description: "מוסיף חצי בקיאות לכל בדיקת STR/DEX/CON שאינך בקיא בה + קפיצה גדולה יותר.",
  } },
  { match: (c, s, l) => c === "fighter" && s === "champion" && l >= 15, feat: {
    id: "auto_superior_critical", name: "Superior Critical", nameHe: "קריט עליון",
    source: "Champion (15)", description: "קריט על 18-20.",
  } },
  { match: (c, s, l) => c === "fighter" && s === "champion" && l >= 18, feat: {
    id: "auto_survivor", name: "Survivor", nameHe: "שורד",
    source: "Champion (18)", description: "בתחילת התור — 5+CON HP אם מתחת לחצי HP.",
  } },
  { match: (c, s, l) => c === "fighter" && s === "battlemaster" && l >= 3, feat: {
    id: "auto_combat_superiority", name: "Combat Superiority", nameHe: "עליונות בקרב",
    source: "Battle Master (3)", description: "Superiority dice + לומד maneuvers.",
  } },
  { match: (c, s, l) => c === "fighter" && s === "rune_knight" && l >= 3, feat: {
    id: "auto_rune_carving", name: "Rune Carver", nameHe: "חורט רונות",
    source: "Rune Knight (3)", description: "לומד רונות + Giant's Might.",
  } },
  { match: (c, s, l) => c === "fighter" && s === "psi_warrior" && l >= 3, feat: {
    id: "auto_psionic_power", name: "Psionic Power", nameHe: "כוח פסיוני",
    source: "Psi Warrior (3)", description: "Psionic Energy dice — Protective Field, Psionic Strike, Telekinetic Movement.",
  } },
  { match: (c, s, l) => c === "fighter" && s === "arcane_archer" && l >= 3, feat: {
    id: "auto_arcane_shot", name: "Arcane Shot", nameHe: "חץ נסתר",
    source: "Arcane Archer (3)", description: "2 Arcane Shots — Banishing/Piercing/Seeking Arrow. משתדרג ב-7/10/15/18.",
  } },
  { match: (c, s, l) => c === "fighter" && s === "echo_knight" && l >= 3, feat: {
    id: "auto_manifest_echo", name: "Manifest Echo", nameHe: "הד ממדים",
    source: "Echo Knight (3)", description: "מקים הד עד 15ft — יכול לתקוף/לזוז דרכו.",
  } },
  { match: (c, s, l) => c === "ranger" && l >= 1, feat: {
    id: "auto_favored_enemy", name: "Favored Enemy", nameHe: "אויב מועדף",
    source: "Ranger (1)", description: "יתרון על שרידה/חקירה ליעד המועדף.",
  } },
  { match: (c, s, l) => c === "paladin" && l >= 6, feat: {
    id: "auto_aura_of_protection", name: "Aura of Protection", nameHe: "הילת הגנה",
    source: "Paladin (6)", description: "+CHA לכל save לבעלי ברית בטווח 10ft.",
  } },
];

export function getAutoFeats(classId: string, subclassId: string | undefined, level: number, multiclass?: { classId: string; subclassId?: string; level: number }[]): AutoFeat[] {
  const out: AutoFeat[] = [];
  for (const row of AUTO_TABLE) {
    if (row.match(classId, subclassId, level)) out.push(row.feat);
  }
  for (const mc of multiclass ?? []) {
    for (const row of AUTO_TABLE) {
      if (row.match(mc.classId, mc.subclassId, mc.level)) {
        if (!out.find(f => f.id === row.feat.id)) out.push(row.feat);
      }
    }
  }
  return out;
}

// Filter feats by whether they're available to a given character context.
export function isFeatAvailable(feat: Feat, ctx: { raceId?: string; subraceId?: string; classId?: string; subclassId?: string; abilities?: Partial<Record<import("../lib/dnd-types").Ability, number>> }): boolean {
  const r = feat.requirements;
  if (!r) return true;
  if (r.race && r.race.length && (!ctx.raceId || !r.race.includes(ctx.raceId))) return false;
  if (r.subrace && r.subrace.length && (!ctx.subraceId || !r.subrace.includes(ctx.subraceId))) return false;
  if (r.class && r.class.length && (!ctx.classId || !r.class.includes(ctx.classId))) return false;
  if (r.subclass && r.subclass.length && (!ctx.subclassId || !r.subclass.includes(ctx.subclassId))) return false;
  if (r.minAbility) {
    for (const [k, v] of Object.entries(r.minAbility)) {
      const cur = ctx.abilities?.[k as any] ?? 10;
      if (cur < (v as number)) return false;
    }
  }
  return true;
}

