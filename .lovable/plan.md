## מה נעשה

### 1. Auto-grant feats לפי קלאס/תת-קלאס
- ב-`src/data/feats.ts` נוסיף `getAutoFeats(classId, subclassId, level)` — מחזיר feats "קבועים" (למשל Champion → Remarkable Athlete בונוס דמוי-feat, Rune Knight → Rune Carver כפייט מותאם).
- נכניס למערכת מושג `AutoFeat` — פייט שאינו נספר ב-ASI budget, מסומן ב-`auto: true`.
- ב-`calculations.ts`: כל חישוב bonuses של feats יאחד `[...c.featIds, ...autoFeatIds]`, כך שההשפעה (ability/hp/speed/ac/initiative) חלה אוטומטית ומעדכנת סטטים מיד אחרי שינוי קלאס/תת-קלאס.
- שדה חדש `asi.autoFeats` להצגה בדף.

### 2. סינון feats לפי תנאי (גזע/מקצוע/יכולת)
- נעשיר את שדה `prerequisite` לשדה מובנה `requirements?: { race?: string[]; class?: string[]; subclass?: string[]; minAbility?: Partial<Record<Ability, number>>; spellcasting?: boolean; armorProf?: "light"|"medium"|"heavy"|"shield" }`.
- ב-`builder.tsx` בשלב הפייטים: מסנן חדש (Select) לפי גזע/קלאס/רמה + toggle "הצג רק פייטים זמינים לי". פונקציית `isFeatAvailable(feat, character)`.
- שמירה על תאימות: כל feat קיים ישאר עובד; נמלא `requirements` בהדרגה לפייטים הידועים.

### 3. הרחבת רשימת feats
נוסיף עוד ~25 פייטים חסרים: Athlete-variant, Blessed Warrior/Blessed Strikes, Musician, Practiced Expert, Rune Carver, Squire of Solamnia, Knight of Solamnia, Sun Blessed, Metabolic Control, Wonder Maker, Piercer/Slasher/Crusher variants (כבר יש), Aberrant Dragonmark, Strixhaven Initiate x5, Fey Touched, Shadow Touched variants, Telepathic (יש), Chef (יש), plus ~10 UA/Wikidot: Weapon Master (יש), Athlete (יש) — נסמן requirements נכון.
נאמת שאין כפילויות עם הרשימה הקיימת.

### 4. עריכה ידנית של ערכי מאפיינים
- `manualOverrides.abilities` כבר קיים; נחשוף אותו ב-UI:
  - ב-`builder.tsx` שלב Review: לכל מאפיין input מספרי "עקוף ידני" עם כפתור איפוס. השינוי מיידית מזין את `calculateCharacter` דרך `manualOverrides`.
  - גם ב-`character.$id.tsx` (עריכה מהירה מדף הדמות): drawer "עריכה ידנית של מאפיינים".

### 5. אוטומציה של Fighter (יכולות + כישופים)
- ב-`src/data/classes.ts` — למחלקת fighter נוודא ש-`features` מכסים כל רמה עם הטקסט המלא של Wikidot (Second Wind, Action Surge, Extra Attack, Indomitable), וש-כל תת-קלאס (Champion, Battle Master, Eldritch Knight, Arcane Archer, Cavalier, Samurai, Psi Warrior, Echo Knight, Rune Knight, Purple Dragon Knight) מכיל `features` מלאים + `grantedSpells` (ל-EK ו-AA).
- Auto-Fighting-Style: פייטר רמה 1 יוסיף פייטינג-סטייל מומלץ אם המשתמש טרם בחר (default = Defense).
- Auto-feats: Champion רמה 7 → Remarkable Athlete (auto), Rune Knight → Giant's Might (כבר משאב), Battle Master → Combat Superiority (משאב).

### 6. הוספת כישופים כהתקפות
- טיפוס חדש `Character.spellAttacks?: string[]` — spellIds שסומנו כ"פעולת מתקפה" בגיליון.
- ב-`character.$id.tsx` תחת סקציית "התקפות": כפתור "הוסף כישוף כמתקפה" עם דיאלוג בוחר מ-`spellIds` הידועים. עבור כל כישוף מוצג אוטומטית: שם, טווח, זמן הטלה, קומפוננטים, סוג נזק (מנותח מ-`description` או משדה חדש), קוביית נזק, To-Hit (`spellAttackBonus`) או DC (`spellSaveDc`), רמת slot נדרשת (= level, או ניתן לשדרג).
- נוסיף לטיפוס `Spell` שדות אופציונליים: `damageDice?: string`, `damageType?: string`, `attackType?: "melee_spell" | "ranged_spell" | "save"`, `saveAbility?: Ability`. נמלא לכישופי התקפה הנפוצים ב-`src/data/spells.ts` (Fire Bolt, Eldritch Blast, Chromatic Orb, Scorching Ray, Fireball, ...).
- כישופים ללא מטא-דאטה — נציג עדיין את השורה עם ידני-נזק ריק לעריכה.

### 7. קבצים שיושפעו
- `src/lib/dnd-types.ts` — `Feat.requirements`, `Feat.auto?`, `Spell.damageDice/type/attackType/saveAbility`, `Character.spellAttacks`.
- `src/data/feats.ts` — הרחבה + requirements + `getAutoFeats()`.
- `src/data/spells.ts` — הוספת שדות מטא-דאטה לכישופי התקפה.
- `src/data/classes.ts` — השלמת features/grantedSpells לכל תת-קלאס של fighter.
- `src/lib/calculations.ts` — מיזוג autoFeats, חשיפת `autoFeats` ב-DerivedStats.
- `src/routes/builder.tsx` — סינון feats, UI עריכה ידנית של מאפיינים, ברירת מחדל Fighting Style ל-fighter.
- `src/routes/character.$id.tsx` — סקציית "כישופים כמתקפות" + drawer עריכה ידנית של מאפיינים.
- `scripts/validate-data.ts` — validation לשדות החדשים.

## מה לא נעשה בסבב הזה
- לא נגע במערכת הפריטים/גזעים/רקעים.
- לא נשנה את מנוע ה-PDF (יעודכן בסבב נפרד אם תרצה שהמתקפות-מכישוף יופיעו שם).
