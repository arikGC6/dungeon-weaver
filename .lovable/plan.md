
# אתר בונה דמויות D&D 5e – "בר הקסמים"

אתר עברי (RTL) בסגנון בר/טברנה קסומה (עץ כהה, נרות, זהב עתיק, פונטים פנטזיים) שמוביל אותך דרך אשף יצירת דמות שלב-אחר-שלב, מאפשר עריכה ידנית לכל ערך סופי, ומפיק PDF + JSON.

## זרימת המשתמש

```text
דף בית (בר קסום)
   │
   ├── דמויות שמורות (גלריה) ──► טען / ערוך / שכפל / מחק
   │
   └── יצירת דמות חדשה (אשף 10 שלבים)
         1. פרטים בסיסיים + תמונת פרופיל (העלאה מהגלריה)
         2. גזע / Lineage (כולל Hexblood, Thri-kreen, וכל הגזעים)
         3. קלאס + תת-קלאס (כולל יכולות וכישופים שמוענקים)
         4. רקע (Background)
         5. Ability Scores (Standard / Point Buy / Manual)
         6. מיומנויות + שפות + Proficiencies
         7. Feats / Fates (toc70) + בונוסים אוטומטיים
         8. כישופים – חיפוש מלא ברשימת spells של wikidot, סינון לפי קלאס/רמה, כולל מה שמוענק מתת-קלאס/feats
         9. פריטים – מתוך toc67, החלת בונוסים (AC, HP, ability, התקפות, מהירות)
        10. סקירה ועריכה ידנית של כל הערכים הסופיים → שמירה / יצוא PDF / יצוא JSON
```

## מה ייכלל

**גזעים (מלא):** כל הגזעים מ-wikidot כולל Hexblood, Thri-kreen, plus subraces. תכונות מוחלות אוטומטית (+ability, speed, darkvision, traits).

**קלאסים + תת-קלאסים:** כל 13 הקלאסים, חישוב Spell Slots לפי קלאס+רמה (כולל multiclass בעתיד), Pact Magic ל-Warlock, יכולות תת-קלאס וכישופים אוטומטיים (Domain spells, Oath spells, Patron spells וכו').

**כישופים:** קטלוג מלא של spells מ-wikidot/spells עם חיפוש (שם/בית-ספר/רמה/קלאס), סימון מה מוכן/ידוע, הצגת stat block מלא (casting time, range, components, duration, description).

**Fates / Feats (toc70):** כל ה-feats עם החלת בונוסים אוטומטית על הגיליון (Tough → +HP/level, Mobile → +10ft speed, Lucky וכו').

**פריטים (toc67):** קטלוג ציוד+קסמים, בחירה ומיקום (worn/carried), החלת בונוסי AC/HP/ability/attack/speed.

**חישובים אוטומטיים:**
- Ability modifiers, Proficiency bonus לפי level
- AC (armor + dex + shield + bonuses)
- HP (hit die + CON + Tough וכו')
- Spell Save DC + Spell Attack Bonus
- Spell Slots לפי טבלת קלאס/רמה (Full caster, Half, Third, Pact, Warlock)
- **מרחק הליכה:** speed (גזע) + מודיפיקטורים (Mobile, Longstrider, Boots of Striding וכו'), הצגת "כמה רגל לתור" + "כמה לדקה (×10)" + "ק״מ לשעה משוערים"

**עריכה ידנית:** בשלב הסקירה כל ערך סופי ניתן לדריסה (ability scores, HP, AC, speed, skills, save DC) לפני יצוא ה-PDF, כדי להתאים לחוקי הבית שלך.

**יצוא:**
- **PDF**: גיליון דמות מעוצב בסגנון פנטזיה עם כל הפרטים, רשימת כישופים, פריטים, תכונות. נוצר ב-pdf-lib בצד הלקוח.
- **JSON**: ייצוא מלא של state הדמות + ייבוא חזרה לגרסאות בית.

**שמירת דמויות + תמונת פרופיל:** ב-localStorage (ללא צורך ב-backend). העלאת תמונה מהגלריה של המכשיר, נשמרת כ-base64 על הדמות.

## עיצוב

- רקע: עץ כהה עם טקסטורת קלף ישן, אורות נרות חמים
- פלטה: בורדו עמוק, זהב עתיק, פרגמנט שמנת, ירוק בקבוק
- פונטים: כותרות בסגנון פנטזיה (Cinzel/IM Fell), גוף בעברית (Frank Ruhl Libre)
- אלמנטים: מסגרות מעוטרות, חותמות שעווה לכפתורים, אייקונים של כוסות/חרבות/מגילות
- RTL מלא

## פרטים טכניים

- **Stack:** TanStack Start קיים, React, Tailwind v4, shadcn
- **נתוני D&D:** מובנים בקוד כ-TypeScript data files (`src/data/races.ts`, `classes.ts`, `spells.ts`, `feats.ts`, `items.ts`). אאסוף מ-wikidot ואטמיע. שלבים גדולים — אתחיל מסט בסיסי עשיר ואוסיף בהדרגה אם תאשר. (אפשרות חלופית: לטעון מ-API חיצוני, אבל wikidot אין לו API רשמי; הטמעה סטטית יציבה יותר.)
- **State אשף:** Zustand store עם persist ל-localStorage
- **PDF:** `pdf-lib` בצד הלקוח, תבנית מעוצבת עם פונטים מוטמעים בעברית+אנגלית
- **תמונות:** קלט file → base64 → שמירה ב-character state
- **אין צורך ב-backend / Lovable Cloud** לגרסה הראשונה (הכל לוקאלי). אם בעתיד תרצה סנכרון בין מכשירים — נוסיף אז.

## הערות וסיכונים

1. **היקף עצום**: ספריית הכישופים, ה-feats והפריטים של D&D היא ענקית. אטמיע את כל הליבה (PHB + Xanathar + Tasha) ואוסיף בקצב סביר. אם תרצה גם Fizban / Spelljammer / מקורות נוספים — נוסיף בסבב המשך.
2. **זכויות יוצרים**: אעבוד עם תיאורים תמציתיים שלי בנוסח SRD; לא אעתיק טקסטים מילה-במילה מ-wikidot/DDB.
3. **Multiclass**: בגרסה ראשונה רק קלאס אחד. multiclass זה מורכב מאוד — נוסיף אחר כך אם תרצה.
4. **עברית ב-PDF**: אטמיע פונט עברי (Frank Ruhl) ב-pdf-lib עם תמיכה ב-RTL/bidi.
5. ה-Build הראשון יתפרס על כמה הודעות — אתחיל מהשלד (עיצוב, אשף, חישובים, PDF, JSON, שמירה) עם דאטה ליבה, ואז ארחיב את הקטלוגים.

מאשר שאצא לדרך?
