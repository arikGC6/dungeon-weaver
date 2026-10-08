// Subclass + Ranger base updates from the player's rule notes. Overrides the shorter catalog text.
// spells: [classLevel, English spell name] — resolved to ids and always prepared.
export interface SubUpdate { features: { level: number; name: string; desc: string }[]; spells?: [number, string][] }
export const SUBCLASS_UPDATES: Record<string, SubUpdate> = {
 "sorcerer:draconic": {
  "features": [
   {
    "level": 1,
    "name": "Draconic Resilience",
    "desc": "+1 נק\"פ מקסימלי לרמה 1, +1 בכל עליית רמת סורסרר. כשאתה בלי שריון AC = 13 + DEX mod."
   },
   {
    "level": 6,
    "name": "Elemental Affinity",
    "desc": "כשאתה מטיל לחש מהסוג של הדרקון שלך, הוסף CHA mod לנזק אחד של הלחש. הוצא 1 SP כפעולה לקבל עמידות לסוג הנזק הזה למשך שעה."
   },
   {
    "level": 14,
    "name": "Dragon Wings",
    "desc": "פעולת בונוס - מצמיח כנפיים, מהירות תעופה 30 פיט למשך שעה או עד ביטול."
   },
   {
    "level": 18,
    "name": "Draconic Presence",
    "desc": "הוצא 5 SP כפעולה - כל יצור ב-60 פיט לבחירתך צריך הצלת חכמה נגד DC הלחשים שלך. כישלון = Charm או Frightened (לבחירתך) ל-1 דקה."
   }
  ]
 },
 "sorcerer:wild_magic": {
  "features": [
   {
    "level": 1,
    "name": "Wild Magic Surge",
    "desc": "לאחר הטלת לחש דרג 1+, ה-DM יכול לבקש d20. ב-1 -> גלגל d100 בטבלת Wild Surge."
   },
   {
    "level": 1,
    "name": "Tides of Chaos",
    "desc": "יתרון בגלגול אחד של התקפה/הצלה/בדיקה. מתחדש אחרי Surge או מנוחה ארוכה."
   },
   {
    "level": 6,
    "name": "Bend Luck",
    "desc": "תגובה כשיצור אחר מגלגל d20. הוצא 2 SP, גלגל 1d4 והוסף/החסר מהתוצאה. טווח 60 פיט."
   },
   {
    "level": 14,
    "name": "Controlled Chaos",
    "desc": "ב-Surge אתה מגלגל 2 תוצאות ובוחר."
   },
   {
    "level": 18,
    "name": "Spell Bombardment",
    "desc": "כשאתה מגלגל נזק ללחש, אם יצאה תוצאה מקסימלית בקוביה אחת, גלגל עוד קוביה מאותו סוג והוסף."
   }
  ]
 },
 "sorcerer:divine_soul": {
  "features": [
   {
    "level": 1,
    "name": "Divine Magic",
    "desc": "למד לחש אחד מרשימת Cleric. + לחשים אוטומטיים לפי זיקה תמיד מוכנים."
   },
   {
    "level": 1,
    "name": "Favored by the Gods",
    "desc": "כשנכשלת בהצלה או התקפה, הוסף 2d4 לגלגול. פעם אחת בין מנוחה קצרה/ארוכה."
   },
   {
    "level": 6,
    "name": "Empowered Healing",
    "desc": "כשאתה או בן ברית ב-5 פיט מגלגל ריפוי, אתה יכול להוציא 1 SP כדי לגלגל מחדש עד CHA mod קוביות ריפוי."
   },
   {
    "level": 14,
    "name": "Otherworldly Wings",
    "desc": "פעולת בונוס - כנפיים, תעופה 30 פיט."
   },
   {
    "level": 18,
    "name": "Unearthly Recovery",
    "desc": "פעולה כמעט מת - כשאתה בחצי חיים ומטה, מרפא חצי מהנק\"פ המקסימלי שלך. פעם ביום."
   }
  ]
 },
 "sorcerer:shadow": {
  "features": [
   {
    "level": 1,
    "name": "Eyes of the Dark",
    "desc": "ראיית חושך 120 פיט. יכול להטיל Darkness עם 2 SP, רואה דרכו."
   },
   {
    "level": 1,
    "name": "Strength of the Grave",
    "desc": "כשנזק מוריד אותך ל-0, גלגל הצלת CHA נגד DC = 5 + הנזק שספגת. הצלחה = אתה נשאר ב-1 נק\"פ. לא עובד מול נזק קורן או מכה קריטית."
   },
   {
    "level": 6,
    "name": "Hound of Ill Omen",
    "desc": "פעולת בונוס, 3 SP - זמן כלב צללים ליד מטרה. לכלב יש חצי חיים שלך, AC 14, התקפה 1d8+prof נקרוטי. למטרה יש חיסרון בהצלות נגד הלחשים שלך כל עוד הכלב ב-5 פיט ממנה."
   },
   {
    "level": 14,
    "name": "Shadow Walk",
    "desc": "פעולת בונוס בצל/חושך - טלפורט 120 פיט ממקום אפל למקום אפל."
   },
   {
    "level": 18,
    "name": "Umbral Form",
    "desc": "פעולת בונוס, 6 SP? בגרסת XGE זה פעולה - למשך 1 דקה אתה עמיד לנזק פרט לכוח/קורן, יכול לעבור דרך יצורים/חפצים כאילו קשים."
   }
  ]
 },
 "sorcerer:aberrant_mind": {
  "features": [
   {
    "level": 1,
    "name": "Psionic Spells + Telepathic Speech",
    "desc": "10 לחשים פסיוניים אוטומטיים תמיד מוכנים (Dissonant Whispers, Mind Sliver וכו'). פעולת בונוס - דיבור טלפתי ליצור ב-CHA mod מיילים, למשך דקות = רמת סורסרר."
   },
   {
    "level": 6,
    "name": "Psionic Sorcery",
    "desc": "אתה יכול להטיל לחש מהרשימה הפסיונית עם נקודות כישוף במקום סלוט, בלי רכיבים. אם אתה מטיל עם SP = דרג הלחש, בלי רכיב מילולי/תנועתי. כשאתה מטיל ככה, אתה יכול להוציא עוד 1 SP כדי להטיל עם Subtle+Extended בלי עלות נוספת."
   },
   {
    "level": 14,
    "name": "Revelation in Flesh",
    "desc": "פעולת בונוס, X SP - קבל ראיית אמת 120 פיט / תעופה 30 פיט / ראיית חושך 120 + שקיפות חלקית."
   },
   {
    "level": 18,
    "name": "Warping Implosion",
    "desc": "פעולה, 2 SP - טלפורט 120 פיט, פיצוץ ב-10 פיט מהמקום הקודם: כל יצור STR הצלה, כישלון 3d10 כוח + נשאב 10 פיט למרכז."
   }
  ]
 },
 "sorcerer:clockwork_soul": {
  "features": [
   {
    "level": 1,
    "name": "Clockwork Magic + Restore Balance",
    "desc": "10 לחשים אוטומטיים של סדר (Alarm, Protection from Evil etc). תגובה 60 פיט - כשיצור מגלגל עם יתרון/חיסרון, בטל את היתרון/חיסרון. CHA mod פעמים ביום."
   },
   {
    "level": 6,
    "name": "Bastion of Law",
    "desc": "פעולה, הוצא 1-5 SP - צור מחסום סביבך או בן ברית ב-30 פיט שסופג נזק = 1d8 לכל SP שהוצאת. המחסום עם d8 נוספים כל פעם שמתקבל נזק עד שנגמר."
   },
   {
    "level": 14,
    "name": "Manifestation of Order",
    "desc": "כשאתה מטיל לחש דרג 1+, הילה 30 פיט ל-10 דקות. יצורים בהילה לא יכולים לגלגל עם יתרון נגדך, אתה מתעלם מהסחות."
   },
   {
    "level": 18,
    "name": "Clockwork Cavalcade",
    "desc": "פעולה, 5 SP - קובייה 30 פיט, כל יצור בפנים נרפא 100 נק\"פ מתחלק בין כולם או מתקן חפצים, מבטל לחשי דרג 6 ומטה."
   }
  ]
 },
 "sorcerer:storm": {
  "features": [
   {
    "level": 1,
    "name": "Tempestuous Magic",
    "desc": "מיד אחרי שאתה מטיל לחש דרג 1+, פעולת בונוס - תעופה 10 פיט בלי התקפות מזדמנות."
   },
   {
    "level": 6,
    "name": "Heart of the Storm + Storm's Fury",
    "desc": "עמידות לברק ורעם. כשאתה מטיל לחש ברק/רעם דרג 1+, כל יצור ב-10 פיט סופג CHA mod נזק מהסוג. בנוסף, כשאתה נפגע בקפא\"פ, תגובה - 60 פיט, DEX הצלה נגד DC שלך, 1d8 ברק/רעם ודחיפה 30 פיט. רמה 14: Storm's Fury upgrade.*"
   },
   {
    "level": 18,
    "name": "Wind Soul",
    "desc": "חסינות לברק/רעם, תעופה 60 פיט תמידית. כפעולה - פיצוץ 30 פיט: 2d6 רעם + דחיפה."
   }
  ]
 },
 "druid:moon": {
  "features": [
   {
    "level": 2,
    "name": "Combat Wild Shape",
    "desc": "שינוי צורה כפעולת בונוס. ריפוי בצורה: הוצא סלוט לחש, רפא 1d8 לכל דרג סלוט. CR מותר = 1, עולה ל-דרג/3 ברמות גבוהות."
   },
   {
    "level": 6,
    "name": "Primal Strike",
    "desc": "התקפות החיה נחשבות קסומות לעניין עמידויות."
   },
   {
    "level": 10,
    "name": "Elemental Wild Shape",
    "desc": "הוצא 2 שימושי Wild Shape - הפוך ל- Air/Earth/Fire/Water Elemental (סטט בלוק מה-MM, CR 5)."
   },
   {
    "level": 14,
    "name": "Thousand Forms",
    "desc": "מטיל Alter Self כרצונך."
   }
  ]
 },
 "druid:land": {
  "features": [
   {
    "level": 2,
    "name": "Natural Recovery",
    "desc": "במנוחה קצרה החזר סלוטים עד חצי רמת דרואיד, מקס דרג 5."
   },
   {
    "level": 3,
    "name": "Circle Spells",
    "desc": "2 לחשים לכל דרג תמיד מוכנים לפי הקרקע."
   },
   {
    "level": 6,
    "name": "Land's Stride",
    "desc": "תנועה בשטח קשה לא קסום רגילה, חסין לקוצים/מלכודות צמחים, יתרון בהצלה נגד צמחים קסומים."
   },
   {
    "level": 10,
    "name": "Nature's Ward",
    "desc": "חסין ל-Charm/Frighten מיסודנים/פיות, חסין למחלה ורעל."
   },
   {
    "level": 14,
    "name": "Nature's Sanctuary",
    "desc": "חיות וצמחים שתוקפים אותך - WIS הצלה נגד DC שלך, כישלון = Charm/תוקף מטרה אחרת."
   }
  ]
 },
 "druid:shepherd": {
  "features": [
   {
    "level": 2,
    "name": "Spirit Totem",
    "desc": "פעולת בונוס, 60 פיט, הילה 30 פיט ל-1 דקה: דב = כל בן ברית בהילה מקבל 5+דרג דרואיד נק\"פ זמני + יתרון בבדיקות/הצלות כוח. נץ = יתרון בתפיסה + תגובה להתקפה עם יתרון. חד קרן = יתרון בהצלות נגד פחד + כל ריפוי בטווח מוסיף דרג דרואיד."
   },
   {
    "level": 6,
    "name": "Mighty Summoner",
    "desc": "זימונים מקבלים +2 נק\"פ לכל קוביית חיים, והתקפות שלהם קסומות."
   },
   {
    "level": 10,
    "name": "Guardian Spirit",
    "desc": "טוטם הרוח מרפא כל בן ברית בהילה ב-דרג דרואיד/2 בסוף כל תור."
   },
   {
    "level": 14,
    "name": "Faithful Summons",
    "desc": "אם אתה ב-0 נק\"פ, 4 חיות CR 2 מזומנות אוטומטית להגן עליך."
   }
  ]
 },
 "druid:spores": {
  "features": [
   {
    "level": 2,
    "name": "Halo of Spores",
    "desc": "תגובה כשיצור ב-10 פיט זז, CON הצלה נגד DC, כישלון 1d4 נקרוטי, עולה ל-1d6 ברמה 6, 1d8 ברמה 10, 1d10 ברמה 14."
   },
   {
    "level": 2,
    "name": "Symbiotic Entity",
    "desc": "פעולה, שימוש Wild Shape - 4 * דרג דרואיד נק\"פ זמני, Halo עושה כפול, התקפות קפא\"פ +1d6 נקרוטי."
   },
   {
    "level": 6,
    "name": "Fungal Infestation",
    "desc": "כשחיה/דמוי אדם מת ב-10 פיט ממך, תגובה - הקם כזומבי נבגים עם 1 נק\"פ למשך שעה."
   },
   {
    "level": 10,
    "name": "Spreading Spores",
    "desc": "פעולה - שלח נבגים למקום ב-30 פיט, ענן 10 פיט, יצורים שנכנסים - Halo."
   },
   {
    "level": 14,
    "name": "Fungal Body",
    "desc": "חסין לעיוורון/חירשות/פחד/שיתוק, לא צריך לנשום, התקפות קריטיות נגדך נחשבות רגילות."
   }
  ]
 },
 "druid:stars": {
  "features": [
   {
    "level": 2,
    "name": "Star Map + Guiding Bolt חינם",
    "desc": "אתה תמיד מכין Guiding Bolt בלי לספור. מפת כוכבים = מיקוד."
   },
   {
    "level": 2,
    "name": "Starry Form",
    "desc": "פעולת בונוס, שימוש Wild Shape - צורת כוכב ל-10 דקות: Archer = פעולת בונוס 1d8+WIS קורן, טווח 60 פיט, התקפת לחש. Chalice = כשאתה מרפא עם לחש, רפא עוד 1d8+WIS ליצור אחר ב-30 פיט. Dragon = +1 לכל הצלות ריכוז + ריחוף."
   },
   {
    "level": 6,
    "name": "Cosmic Omen",
    "desc": "במנוחה ארוכה גלגל d6, בחר אם להשתמש בתגובה להוסיף/להחסיר d6 מבדיקה/התקפה/הצלה."
   },
   {
    "level": 14,
    "name": "Twinkling Constellations",
    "desc": "הצורה משודרגת, Archer 2d8, Chalice ריפוי כפול."
   }
  ]
 },
 "druid:wildfire": {
  "features": [
   {
    "level": 2,
    "name": "Summon Wildfire Spirit",
    "desc": "פעולה, 1 שימוש Wild Shape - זמן רוח אש CR 1, 10+דרג דרואיד נק\"פ, התקפה 1d6+prof אש, טווח 60 פיט, טלפורט שלך ושל 2 יצורים ב-5 פיט מהרוח ל-15 פיט, 1d6+WIS אש באזור."
   },
   {
    "level": 6,
    "name": "Enhanced Bond",
    "desc": "כשאתה מטיל לחש אש/ריפוי, הוסף 1d8 לנזק/ריפוי אחד אם אתה ב-30 פיט מהרוח."
   },
   {
    "level": 10,
    "name": "Cauterizing Flames",
    "desc": "תגובה כשרוח מתה - פיצוץ 10 פיט, DEX הצלה, 2d10+WIS אש, חצי בהצלחה, או ריפוי במקום."
   },
   {
    "level": 14,
    "name": "Blazing Revival",
    "desc": "אם אתה מת, הרוח מקריבה עצמה להחזיר אותך ל-50% נק\"פ."
   }
  ]
 },
 "druid:dreams": {
  "features": [
   {
    "level": 2,
    "name": "Balm of the Summer Court",
    "desc": "מאגר d6 = דרג דרואיד. פעולת בונוס 120 פיט - הענק d6 ריפוי. 1d6 ברמה 2, 1d8 ברמה 6, 1d10 ברמה 10."
   },
   {
    "level": 6,
    "name": "Hearth of Moonlight and Shadow",
    "desc": "במנוחה קצרה/ארוכה, אתה יוצר מחסה - יצורים בפנים +5 להתגנבות ותפיסה."
   },
   {
    "level": 10,
    "name": "Hidden Paths",
    "desc": "פעולת בונוס, 60 פיט - טלפורט לעצמך או בן ברית."
   },
   {
    "level": 14,
    "name": "Walker in Dreams",
    "desc": "לחש Scrying/Teleport תמיד מוכנים, פעם ביום טלפורט קבוצתי."
   }
  ]
 },
 "cleric:life": {
  "features": [
   {
    "level": 1,
    "name": "Disciple of Life",
    "desc": "ריפוי מדרג 1+ -> הוסף 2 + דרג הלחש. רמה 1: Heavy Armor.*"
   },
   {
    "level": 2,
    "name": "Preserve Life CD",
    "desc": "פעולה 30 פיט - חלק 5 * רמת קלריק נק\"פ בין יצורים, לא מעל חצי מקס."
   },
   {
    "level": 6,
    "name": "Blessed Healer",
    "desc": "כשאתה מרפא אחר, אתה מרפא 2 + דרג הלחש גם."
   },
   {
    "level": 8,
    "name": "Divine Strike",
    "desc": "פעם בתור, נשק עושה +1d8 קורן, +2d8 ברמה 14."
   },
   {
    "level": 17,
    "name": "Supreme Healing",
    "desc": "כל ריפוי עם קוביות = מקסימום קוביות."
   }
  ]
 },
 "cleric:light": {
  "features": [
   {
    "level": 1,
    "name": "Warding Flare",
    "desc": "תגובה כשיצור ב-30 פיט תוקף אותך - הטל חיסרון להתקפה. WIS mod פעמים ביום."
   },
   {
    "level": 2,
    "name": "Radiance of the Dawn CD",
    "desc": "פעולה, פיזור חושך 30 פיט, כל אויב CON הצלה, כישלון 2d10+רמת קלריק קורן, חצי בהצלחה."
   },
   {
    "level": 6,
    "name": "Improved Flare",
    "desc": "Flare גם מגן על בן ברית ב-30 פיט."
   },
   {
    "level": 8,
    "name": "Potent Spellcasting",
    "desc": "הוסף WIS mod לנזק של לחשון (Cantrip)."
   },
   {
    "level": 17,
    "name": "Corona of Light",
    "desc": "פעולה, הילה 60 פיט ל-1 דקה, חיסרון להצלות נגד לחשי האור שלך, אויבים מתחילים תור בהילה סופגים WIS mod קורן."
   }
  ]
 },
 "cleric:war": {
  "features": [
   {
    "level": 1,
    "name": "War Priest + Heavy/Martial",
    "desc": "כשאתה תוקף בפעולה, פעולת בונוס התקפת נשק. WIS mod פעמים ביום."
   },
   {
    "level": 2,
    "name": "Guided Strike CD",
    "desc": "+10 להתקפה אחת שלך או של בן ברית ב-30 פיט."
   },
   {
    "level": 6,
    "name": "War God's Blessing CD",
    "desc": "Guided Strike גם על בן ברית."
   },
   {
    "level": 8,
    "name": "Divine Strike",
    "desc": "נשק +1d8 נזק מסוג הנשק, +2d8 ברמה 14."
   },
   {
    "level": 17,
    "name": "Avatar of Battle",
    "desc": "עמידות לנזק מוחץ/דוקר/חודר לא קסום."
   }
  ]
 },
 "cleric:knowledge": {
  "features": [
   {
    "level": 1,
    "name": "Expertise + Languages",
    "desc": "2 מיומנויות ידע מקבלות Expertise (כפול תוסף), 2 שפות."
   },
   {
    "level": 2,
    "name": "Knowledge of the Ages CD",
    "desc": "פעולה - שליטה זמנית בכל המיומנויות של תכונה אחת ל-10 דקות."
   },
   {
    "level": 6,
    "name": "Read Thoughts CD",
    "desc": "פעולה - Detect Thoughts בלי סלוט, וגם קריאת מחשבות עמוקה."
   },
   {
    "level": 8,
    "name": "Potent Spellcasting",
    "desc": "+WIS mod לנזק לחשון."
   },
   {
    "level": 17,
    "name": "Visions of the Past",
    "desc": "פעם ביום - חזה עבר של חפץ/אזור."
   }
  ]
 },
 "cleric:nature": {
  "features": [
   {
    "level": 1,
    "name": "Acolyte of Nature",
    "desc": "לחשון דרואיד אחד + מיומנות טבע/חיות/הישרדות + שריון כבד."
   },
   {
    "level": 2,
    "name": "Charm Animals and Plants CD",
    "desc": "פעולה 30 פיט, WIS הצלה, כישלון = Charm ל-1 דקה."
   },
   {
    "level": 6,
    "name": "Dampen Elements",
    "desc": "תגובה כשאתה/בן ברית ב-30 פיט סופג נזק אש/קור/ברק/חומצה/רעל/רעם - עמידות לנזק הזה."
   },
   {
    "level": 8,
    "name": "Divine Strike",
    "desc": "+1d8 לבחירה קור/אש/ברק על נשק."
   },
   {
    "level": 17,
    "name": "Master of Nature",
    "desc": "כשאתה משתמש ב-CD Charm, יצורים גם Incapacitated."
   }
  ]
 },
 "cleric:tempest": {
  "features": [
   {
    "level": 1,
    "name": "Wrath of the Storm",
    "desc": "תגובה כשיצור ב-5 פיט פוגע בך בקפא\"פ, DEX הצלה נגד DC, כישלון 2d8 ברק/רעם (לבחירתך), חצי בהצלחה. עולה ל-3d8 ברמה 11, 4d8 ברמה 17."
   },
   {
    "level": 2,
    "name": "Destructive Wrath CD",
    "desc": "כשאתה מגלגל נזק ברק/רעם, במקום לגלגל - נזק מקסימלי."
   },
   {
    "level": 6,
    "name": "Thunderbolt Strike",
    "desc": "כשאתה עושה נזק ברק, דחוף יצור Large ומטה 10 פיט."
   },
   {
    "level": 8,
    "name": "Divine Strike",
    "desc": "+1d8 רעם על נשק."
   },
   {
    "level": 17,
    "name": "Stormborn",
    "desc": "תעופה 60 פיט כשאתה בחוץ בסערה/גשם."
   }
  ]
 },
 "cleric:trickery": {
  "features": [
   {
    "level": 1,
    "name": "Blessing of the Trickster",
    "desc": "פעולה, מגע, יצור אחר מקבל יתרון להתגנבות לשעה."
   },
   {
    "level": 2,
    "name": "Invoke Duplicity CD",
    "desc": "פעולה, צור אשליה שלך ל-1 דקה ריכוז, 30 פיט, זז 30 פיט כפעולת בונוס, אתה יכול להטיל דרכה לחשים."
   },
   {
    "level": 6,
    "name": "Cloak of Shadows CD",
    "desc": "פעולה, נעלם עד סוף תורך הבא, יתרון להתגנבות."
   },
   {
    "level": 8,
    "name": "Divine Strike",
    "desc": "נשק +1d8 רעל."
   },
   {
    "level": 17,
    "name": "Improved Duplicity",
    "desc": "4 כפילים, כולם יחד."
   }
  ]
 },
 "cleric:death": {
  "features": [
   {
    "level": 1,
    "name": "Reaper",
    "desc": "כשאתה מטיל לחשון נקרומנסיה שפוגע ביצור אחד, יכול לפגוע בעוד יצור ב-5 פיט מהראשון."
   },
   {
    "level": 2,
    "name": "Touch of Death CD?* בגרסת DMG",
    "desc": "+5+2*דרג נקרוטי להתקפה אחת."
   },
   {
    "level": 6,
    "name": "Inescapable Destruction",
    "desc": "נזק נקרוטי שלך מתעלם מעמידות."
   },
   {
    "level": 8,
    "name": "Divine Strike",
    "desc": "נשק +1d8 נקרוטי, +2d8 ברמה 14. רמה 17: Improved Reaper.*"
   }
  ]
 },
 "cleric:grave": {
  "features": [
   {
    "level": 1,
    "name": "Circle of Mortality",
    "desc": "Spare the Dying כפעולת בונוס 30 פיט, ריפוי מקסימלי ליצור ב-0 נק\"פ."
   },
   {
    "level": 2,
    "name": "Path to the Grave CD",
    "desc": "פעולה 30 פיט, קלל יצור - ההתקפה הבאה שפוגעת בו מקבלת פגיעות (Vulnerability) לכל הנזק."
   },
   {
    "level": 6,
    "name": "Sentinel at Death's Door",
    "desc": "תגובה - כשיצור ב-30 פיט סופג מכה קריטית, הפוך לרגילה. רמה 8: Potent Spellcasting.*"
   },
   {
    "level": 17,
    "name": "Keeper of Souls",
    "desc": "כשאויב מת ב-60 פיט, אתה או בן ברית מרפא 3d6+WIS."
   }
  ]
 },
 "ranger:hunter": {
  "features": [
   {
    "level": 3,
    "name": "Hunter's Prey",
    "desc": "בחירה אחת: Colossus Slayer: כשהמטרה מתחת למקס נק\"פ, פעם בתור +1d8 נזק נוסף. Giant Killer: כשיצור Large+ ב-5 פיט פוגע/מפספס אותך, תגובה - התקפה אחת. Horde Breaker: כשאתה פוגע, אתה יכול לתקוף יצור אחר ב-5 פיט מהראשון ובטווח הנשק שלך, אותה התקפה."
   },
   {
    "level": 7,
    "name": "Defensive Tactics",
    "desc": "בחירה אחת: Escape the Horde: התקפות מזדמנות נגדך בחיסרון Multiattack Defense: כשיצור פוגע בך, +4 AC נגד שאר ההתקפות שלו באותו תור Steel Will: יתרון בהצלות נגד מפוחד"
   },
   {
    "level": 11,
    "name": "Multiattack",
    "desc": "בחירה אחת: Volley: פעולה - התקפה אחת נגד כל יצור ב-10 פיט מנקודה בטווח הנשק שלך. גלגול נפרד לכל מטרה. Whirlwind Attack: פעולה - התקפה אחת נגד כל יצור ב-5 פיט ממך. גלגול נפרד."
   },
   {
    "level": 15,
    "name": "Superior Hunter's Defense",
    "desc": "בחירה אחת: Evasion: כשאתה עושה הצלת זריזות לחצי נזק - חצי בהצלחה, 0 בכישלון. Stand Against the Tide: כשאויב מפספס אותך בקפא\"פ, תגובה - כפה עליו לתקוף יצור אחר. Uncanny Dodge: תגובה כשאתה רואה תוקף פוגע בך - חצי נזק."
   }
  ]
 },
 "ranger:beastmaster": {
  "features": [
   {
    "level": 3,
    "name": "Ranger's Companion (PHB)",
    "desc": "בחר חיה CR 1/4 ללא תעופה/שחייה מיוחדת. HP = 4 * רמת סייר, AC/התקפה/נזק/הצלות + תוסף שליטה. פעולה שלך = פקודה לחיה לתקוף. אם לא פוקד - Dodge. גרסת Tasha: Primal Companion - בחירה: Beast of the Land / Sea / Sky. פעולת בונוס לפקד. נתונים: AC 13+PB, HP 5+5*רמת סייר, התקפה = PB+WIS לפגיעה, נזק 1d8+2+PB קסום. טווח תעופה/שחייה לפי סוג."
   },
   {
    "level": 7,
    "name": "Exceptional Training",
    "desc": "החיה יכולה גם Dash/Disengage/Help כפעולת בונוס. ב-Tasha: היא יכולה לתקוף אחרי שאתה תוקף."
   },
   {
    "level": 11,
    "name": "Bestial Fury",
    "desc": "החיה תוקפת פעמיים כשאתה פוקד."
   },
   {
    "level": 15,
    "name": "Share Spells",
    "desc": "כשאתה מטיל לחש על עצמך, גם החיה ב-30 פיט מקבלת אם היא מטרה חוקית."
   }
  ]
 },
 "ranger:gloomstalker": {
  "features": [
   {
    "level": 3,
    "name": "Dread Ambusher",
    "desc": "+WIS ליוזמה. בתור הראשון בקרב - מהירות +10 פיט, וכשאתה תוקף - התקפה נוספת אחת שגורמת +1d8 נזק אם פוגעת. טווח 60 פיט."
   },
   {
    "level": 3,
    "name": "Umbral Sight",
    "desc": "ראיית חושך 60 -> 90 פיט. בחושך אתה בלתי נראה ליצורים עם ראיית חושך."
   },
   {
    "level": 7,
    "name": "Iron Mind",
    "desc": "שליטה בהצלות חוכמה. אם כבר יש - שליטה בהצלות חכמה או כריזמה."
   },
   {
    "level": 11,
    "name": "Stalker's Flurry",
    "desc": "פעם בתור כשאתה מפספס התקפת נשק, אתה יכול לתקוף שוב."
   },
   {
    "level": 15,
    "name": "Shadowy Dodge",
    "desc": "תגובה כשיצור פוגע בך - כפה חיסרון על גלגול ההתקפה."
   }
  ],
  "spells": [
   [
    3,
    "Disguise Self"
   ],
   [
    5,
    "Rope Trick"
   ],
   [
    9,
    "Fear"
   ],
   [
    13,
    "Greater Invisibility"
   ],
   [
    17,
    "Seeming"
   ]
  ]
 },
 "ranger:fey_wanderer": {
  "features": [
   {
    "level": 3,
    "name": "Dreadful Strikes",
    "desc": "פעם בתור כשאתה פוגע, +1d4 נזק תודעתי, עולה ל-1d6 ברמה 11. טווח נשק."
   },
   {
    "level": 3,
    "name": "Otherworldly Glamour",
    "desc": "+WIS לבדיקות כריזמה, שליטה באחד: Deception/Performance/Persuasion."
   },
   {
    "level": 7,
    "name": "Beguiling Twist",
    "desc": "תגובה 120 פיט - כשיצור מצליח בהצלה נגד Charm/Frightened, אתה כופה על יצור אחר ב-120 פיט WIS הצלה נגד DC שלך, כישלון = Charm/Frightened ל-1 דקה."
   },
   {
    "level": 11,
    "name": "Fey Reinforcements",
    "desc": "פעולה, Summon Fey בלי רכיבים, פעם ביום בחינם."
   },
   {
    "level": 15,
    "name": "Misty Wanderer",
    "desc": "אתה יכול להטיל Misty Step בלי סלוט, WIS mod פעמים ביום, ואחרי זה כל אחד ב-10 פיט ממך וממקום היציאה מקבל 1d10+WIS נק\"פ זמני."
   }
  ],
  "spells": [
   [
    3,
    "Charm Person"
   ],
   [
    5,
    "Misty Step"
   ],
   [
    9,
    "Dispel Magic"
   ],
   [
    13,
    "Dimension Door"
   ],
   [
    17,
    "Mislead"
   ]
  ]
 },
 "ranger:horizon_walker": {
  "features": [
   {
    "level": 3,
    "name": "Detect Portal",
    "desc": "פעולה - חוש שערים מישוריים ב-1 מייל."
   },
   {
    "level": 3,
    "name": "Planar Warrior",
    "desc": "פעולת בונוס - ההתקפה הבאה שתפגע לפני סוף תור זה +1d8 כוח, עולה ל-2d8 ברמה 11. טווח 30 פיט."
   },
   {
    "level": 7,
    "name": "Ethereal Step",
    "desc": "פעולת בונוס - מטיל Etherealness למשך תור אחד, WIS mod פעמים למנוחה ארוכה. אתה יכול לעבור דרך יצורים/חפצים."
   },
   {
    "level": 11,
    "name": "Distant Strike",
    "desc": "כשאתה לוקח פעולת התקפה, אתה יכול לטלפורט 10 פיט לפני כל התקפה. אם אתה תוקף 2 יצורים שונים לפחות, אתה מקבל התקפה שלישית בחינם."
   },
   {
    "level": 15,
    "name": "Spectral Defense",
    "desc": "תגובה כשאתה נפגע - עמידות לכל הנזק של ההתקפה הזאת."
   }
  ],
  "spells": [
   [
    3,
    "Protection from Evil and Good"
   ],
   [
    5,
    "Misty Step"
   ],
   [
    9,
    "Haste"
   ],
   [
    13,
    "Dimension Door"
   ],
   [
    17,
    "Teleportation Circle"
   ]
  ]
 },
 "ranger:monster_slayer": {
  "features": [
   {
    "level": 3,
    "name": "Hunter's Sense",
    "desc": "פעולה 60 פיט - למד אם יצור חסין/עמיד/פגיע למשהו."
   },
   {
    "level": 3,
    "name": "Slayer's Prey",
    "desc": "פעולת בונוס 60 פיט - סמן יצור. הפעם הראשונה בכל תור שאתה פוגע בו, +1d6 נזק. פעם אחת בלבד על כל יצור. נמשך עד מנוחה ארוכה או סימון אחר."
   },
   {
    "level": 7,
    "name": "Supernatural Defense",
    "desc": "כשמטרה של Slayer's Prey כופה עליך הצלה, הוסף 1d6 להצלה. גם כשאתה פוגע בה עם Hunter's Mark - הצלה שלה."
   },
   {
    "level": 11,
    "name": "Magic-User's Nemesis",
    "desc": "תגובה 60 פיט - כשמטרת ה-Prey מטילה לחש או טלפורט, אתה תוקף אותה, ואם פוגע - WIS הצלה נגד DC שלך, כישלון = הלחש נכשל."
   },
   {
    "level": 15,
    "name": "Slayer's Counter",
    "desc": "כשמטרת ה-Prey כופה עליך הצלה, תגובה - תתקוף אותה מיד, אם פגעת - אתה מצליח אוטומטית בהצלה + 1d6 נזק נוסף אם ההתקפה פגעה."
   }
  ],
  "spells": [
   [
    3,
    "Protection from Evil and Good"
   ],
   [
    5,
    "Zone of Truth"
   ],
   [
    9,
    "Magic Circle"
   ],
   [
    13,
    "Banishment"
   ],
   [
    17,
    "Hold Monster"
   ]
  ]
 },
 "barbarian:beast": {
  "features": [
   {
    "level": 3,
    "name": "Form of the Beast",
    "desc": "בחירה כל Rage מחדש: כשאתה נכנס ל-Rage, אתה מצמיח נשק טבעי. בחר אחד: Bite - נשיכה: פעולה/התקפה, 1d8 חודר + STR mod, טווח 5 פיט. אם אתה מתחת לחצי נק\"פ ופוגע, אתה מרפא פעם בתור = 1d12? ב-Tasha זה = תוסף שליטה. גרסת 2024: מרפא = 1d12 + CON mod. Claws - טפרים: 1d6 חותך + STR mod לכל יד. כשאתה לוקח פעולת התקפה, אתה מקבל התקפת Claws נוספת אחת כחלק ממנה. ברמה 5 זה אומר 3 התקפות. Tail - זנב: 1d8 חודר + STR mod, טווח 10 פיט, + תגובה: כשיצור שאתה רואה ב-10 פיט תוקף אותך, תגובה - גלגל 1d8 והוסף ל-AC שלך נגד אותה התקפה. כל הנשקים נחשבים קסומים מול עמידות."
   },
   {
    "level": 6,
    "name": "Bestial Soul",
    "desc": "ההתקפות הטבעיות נחשבות קסומות. + יכולת לפי הצורה שבחרת: Bite = שחייה 30 פיט, Claws = טיפוס 30 פיט, Tail = אתה יכול לגלגל Acrobatics כדי לקפוץ 3x רחוק. אתה יכול לדבר עם חיות בצורה פשוטה."
   },
   {
    "level": 10,
    "name": "Infectious Fury",
    "desc": "כפעולה, 30 פיט, כשאתה פוגע עם הנשק הטבעי, מטרה צריכה CON הצלה נגד DC = 8 + PROF + STR mod. כישלון = 2d12 תודעתי + מורעל עד סוף תורך הבא. הצלחה = חצי נזק. PB פעמים ביום."
   },
   {
    "level": 14,
    "name": "Call the Hunt",
    "desc": "כשאתה נכנס ל-Rage, אתה ו-PB בעלי ברית ב-30 פיט מקבלים 1d6 נזק נוסף פעם בתור, + יתרון על WIS (Perception) ויש לכולכם עמידות לתודעתי."
   }
  ]
 },
 "barbarian:giant": {
  "features": [
   {
    "level": 3,
    "name": "Giant's Power + Giant's Havoc",
    "desc": "לומד שפת ענקים + לחשון Thaumaturgy - CHA להטלה. כשנכנס ל-Rage: אתה הופך ל-Large אם אתה קטן יותר, טווח קפא\"פ +5 פיט (Giant Stature), ויש לך יתרון בבדיקות כוח. Crushing Throw: נזק ה-Rage שלך מתווסף גם להתקפות זריקה, וטווח הזריקה שלך *2."
   },
   {
    "level": 6,
    "name": "Elemental Cleaver",
    "desc": "פעולת בונוס במהלך Rage - הנשק שלך מקבל 1d6 נזק אש/קור/ברק/רעם/חומצה (לבחירתך כל Rage) + הוא חוזר אליך כשהוא נזרק. נזק עולה ל-2d6 ברמה 14."
   },
   {
    "level": 10,
    "name": "Mighty Impel",
    "desc": "פעולת בונוס, 30 פיט, יצור Medium ומטה (או Large אם אתה Large) - STR הצלה נגד DC שלך, כישלון = אתה זורק אותו 30 פיט אופקית + הוא נופל Prone + 2d6 מוחץ. אתה יכול לזרוק גם בעל ברית בלי נזק."
   },
   {
    "level": 14,
    "name": "Demiurgic Colossus",
    "desc": "כשאתה ב-Rage אתה Huge, טווח +10 פיט, + אתה יכול לשאת פי 2 משקל. פעם בתור כשאתה פוגע עם Giant's Havoc, עוד 2d6 מאותו סוג אלמנטלי."
   }
  ]
 },
 "monk:astral_self": {
  "features": [
   {
    "level": 3,
    "name": "Arms of the Astral Self",
    "desc": "פעולת בונוס, הוצא 1 Ki - ל-10 דקות מזמן ידיים רוחניות. מכניקה: התקפות לא חמושות שלך טווח 10 פיט, נזק Force (במקום מוחץ), ואתה משתמש ב-WIS במקום STR/DEX להתקפה, נזק, ובדיקות/הצלות כוח. כשאתה לוקח פעולת התקפה, אתה יכול לתקוף פעם נוספת עם הידיים כחלק ממנה."
   },
   {
    "level": 6,
    "name": "Visage of the Astral Self",
    "desc": "פעולת בונוס, 1 Ki, ל-10 דקות - פנים רוחניות: ראיית חושך 60 פיט, רואה בלתי נראה 5 פיט. יתרון ב-Insight ו-Intimidation. כשיש לך גם Arms וגם Visage פעילים, אתה יכול להשתמש ב-WIS לכל בדיקות CHA."
   },
   {
    "level": 11,
    "name": "Body of the Astral Self",
    "desc": "כשיש לך Arms+Visage פעילים: +2 AC. כשאתה משתמש ב-Flurry of Blows, כל פגיעה +1d6 Force. כשמישהו פוגע בך, תגובה - 2 Ki - הפחת נזק ב-2d10 + WIS mod."
   },
   {
    "level": 17,
    "name": "Awakened Astral Self",
    "desc": "Complete: פעולת בונוס, 5 Ki - למשך 10 דקות אתה מקבל 4 ידיים, 5 התקפות ב-Flurry, + כשאתה מת, אתה יכול להוציא 10 Ki לחזור ל-1 HP עם פיצוץ 10 פיט 2d10 Force, STR הצלה."
   }
  ]
 },
 "ranger:swarmkeeper": {
  "features": [
   {
    "level": 3,
    "name": "Swarmkeeper Magic + Gathered Swarm",
    "desc": "הלב: לחשים תמיד מוכנים: רמה 3 Faerie Fire, רמה 5 Web, רמה 9 Gaseous Form, רמה 13 Arcane Eye, רמה 17 Insect Plague. Gathered Swarm: פעם בתור מיד אחרי שפגעת בהתקפה, בחר אחד, טווח היכולת 30 פיט מהמטרה: נזק: +1d6 חודר (עולה ל-1d8 ברמה 11) למטרה. דחיפה: המטרה STR הצלה נגד DC הלחשים שלך, כישלון = דחיפה 15 פיט אופקית + היא Prone אם בחרת. הזזה: אתה זז 5 פיט בלי התקפות מזדמנות (הנחיל מרים אותך)."
   },
   {
    "level": 7,
    "name": "Writhing Tide",
    "desc": "בחירה: פעולת בונוס - הנחיל מרים אותך, אתה מקבל מהירות תעופה 10 פיט + ריחוף למשך 1 דקה. PB פעמים ביום."
   },
   {
    "level": 11,
    "name": "Mighty Swarm",
    "desc": "ה-Gathered Swarm משתדרג: הנזק 1d8. דחיפה - המטרה עפה 15 פיט גם אנכית אם תרצה. הזזה - אתה זז 15 פיט במקום 5."
   },
   {
    "level": 15,
    "name": "Swarming Dispersal",
    "desc": "תגובה כשאתה סופג נזק - אתה הופך לנחיל, חצי נזק מההתקפה, וטלפורט 30 פיט למקום שאתה רואה."
   }
  ],
  "spells": [
   [
    3,
    "Faerie Fire"
   ],
   [
    5,
    "Web"
   ],
   [
    9,
    "Gaseous Form"
   ],
   [
    13,
    "Arcane Eye"
   ],
   [
    17,
    "Insect Plague"
   ]
  ]
 }
};
export const RANGER_BASE_UPDATE = [
 {
  "level": 1,
  "name": "אויב מועדף",
  "desc": "בחירה בחר סוג: Aberrations, Beasts, Celestials, Constructs, Dragons, Elementals, Fey, Fiends, Giants, Monstrosities, Oozes, Plants, Undead או 2 גזעי Humanoid. מכניקה: יתרון בבדיקות הישרדות לעקוב אחריו, יתרון בידע עליו, שפה אחת שהוא דובר. ברמה 6 ו-14: עוד אויב אחד + שפה. אופציה חלופית Tasha: Favored Foe במקום Favored Enemy. כשאתה פוגע בהתקפה, אתה יכול לסמן כמועדף ל-1 דקה (כמו ריכוז). הפעם הראשונה בכל תור שאתה פוגע בו ועושה נזק, תוספת 1d4, עולה ל-1d6 ברמה 6, 1d8 ברמה 14. מספר שימושים = תוסף שליטה למנוחה ארוכה."
 },
 {
  "level": 1,
  "name": "חוקר טבעי",
  "desc": "Natural Explorer - בחירה בחר שטח: ארקטי, חוף, מדבר, יער, עשב, הר, ביצה, Underdark. הטבות בשטח הזה: שטח קשה לא מאט קבוצה, לא הולכים לאיבוד, ערני גם כשעושה פעילות אחרת, מוצא פי 2 אוכל, לומד מספר/גודל/זמן עקבות. ברמה 6 ו-10: עוד שטח. אופציה חלופית Tasha: Deft Explorer רמה 1 Canny: בחר מיומנות שאתה מיומן בה - הכפלת תוסף שליטה + 2 שפות. רמה 6 Roving: מהירות הליכה +5, מהירות טיפוס ושחייה = מהירות הליכה. רמה 10 Tireless: פעולה, נק\"פ זמני = 1d8 + WIS, מספר שימושים = תוסף שליטה למנוחה ארוכה. במנוחה קצרה מוריד 1 דרגת תשישות."
 },
 {
  "level": 2,
  "name": "סגנון לחימה",
  "desc": "Fighting Style - בחירה אחת: Archery: +2 להתקפות טווח Defense: +1 ל-AC כשאתה עם שריון Dueling: +2 לנזק כשנשק קפא\"פ ביד אחת ובלי נשק שני Two-Weapon Fighting: מוסיף את תוסף התכונה לנזק של ההתקפה השנייה Blind Fighting: ראיית עיוורון 10 פיט Druidic Warrior: לומד 2 לחשונים מרשימת דרואיד, WIS להטלה Thrown Weapon: +2 נזק לזריקה"
 },
 {
  "level": 2,
  "name": "הטלת לחשים",
  "desc": "יודע 2 לחשים דרג 1, 2 סלוטים דרג 1. מתחדש במנוחה ארוכה."
 },
 {
  "level": 3,
  "name": "Primeval Awareness",
  "desc": "פעולה + הוצאת סלוט - למשך 1 דקה לכל דרג סלוט, חוש האם יש ב-1 מייל (6 מייל בשטח מועדף) Aberrations/Celestials/Dragons/Elementals/Fey/Fiends/Undead. אופציה Tasha: Primal Awareness: מקבל לחשים אוטומטיים תמיד מוכנים: רמה 3 Speak with Animals, רמה 5 Beast Sense, רמה 9 Speak with Plants, רמה 13 Locate Creature, רמה 17 Commune with Nature. כל אחד פעם ביום בלי סלוט."
 },
 {
  "level": 4,
  "name": "ASI",
  "desc": "+2 לתכונה אחת או +1 לשתיים עד 20, או Feat."
 },
 {
  "level": 5,
  "name": "Extra Attack",
  "desc": "2 התקפות בפעולת התקפה."
 },
 {
  "level": 8,
  "name": "ASI + Land's Stride",
  "desc": "תנועה בשטח קשה לא קסום לא עולה יותר, עובר בצמחים לא קסומים בלי נזק/האטה, יתרון בהצלות נגד צמחים קסומים כמו Entangle."
 },
 {
  "level": 10,
  "name": "Hide in Plain Sight / Nature's Veil",
  "desc": "פעולה 1 דקה הסוואה עם בוץ/צמחים - +10 להתגנבות עד שאתה זז. ב-Tasha: Nature's Veil - פעולת בונוס, נעלם עד סוף תורך הבא, WIS mod פעמים ביום. רמה 14: Vanish + Favored Foe שדרוג"
 },
 {
  "level": 18,
  "name": "Feral Senses",
  "desc": "רואה יצור בלתי נראה ב-30 פיט, יצור מוסתר לא מקבל יתרון נגדך."
 },
 {
  "level": 20,
  "name": "Foe Slayer",
  "desc": "פעם בתור, כשאתה פוגע באויב מועדף, מוסיף WIS mod לנזק אחד."
 }
];
export const NEW_SUBCLASSES: Record<string, { id: string; name: string; nameHe: string }[]> = {
  barbarian: [{ id: "beast", name: "Path of the Beast", nameHe: "מסלול החיה" }, { id: "giant", name: "Path of the Giant", nameHe: "מסלול הענק" }],
  monk: [{ id: "astral_self", name: "Way of the Astral Self", nameHe: "דרך העצמי האסטרלי" }],
  ranger: [{ id: "swarmkeeper", name: "Swarmkeeper", nameHe: "שומר הנחיל" }],
};
