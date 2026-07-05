## מה נבנה

### 1. מילוי אוטומטי של grantedSpells לכל תת-קלאס
עבור כל תת-קלאס שחסר לו רשימה מלאה (או שיש רק חלקית), נמלא `grantedSpells` בכל רמה שהתת-קלאס מקבל כישופים חדשים (רמות 3/5/7/9/13/17 לפלדין/רריינג'ר, 1/3/5/7/9 לכומר/וורלוק, ורמות סאב-קלאס ספציפיות למכשף/דרויד/סורסרר/בארד/מונק/פייטר).

דגש מיוחד על:
- **Wizard** — כל 8 האסכולות (Evocation, Abjuration, Divination, Enchantment, Illusion, Necromancy, Transmutation, Conjuration + Bladesinging, War Magic, Chronurgy, Graviturgy, Scribes) מקבלות רשימת "signature spells" מוצעת ברמות 1/3/5/7/9.
- **Druid** — כל המעגלים (Moon, Land×6 subtypes, Shepherd, Spores, Stars, Wildfire, Dreams) עם רמות 3/5/7/9.
- **Fighter — Eldritch Knight / Arcane Archer / Psi Warrior / Echo Knight** — grantedSpells + arcane shots.
- **Ranger** — כל הקונקלייבים (Hunter, Beast Master, Gloom Stalker, Horizon Walker, Monster Slayer, Fey Wanderer, Swarmkeeper, Drakewarden) עם spells ברמות 3/5/9/13/17.
- **Sorcerer** — כל ה-Origins (Draconic, Wild Magic, Divine Soul, Shadow, Storm, Aberrant Mind, Clockwork Soul) — expanded spell lists.
- **Monk** — Way of the Four Elements (disciplines כ-spellIds), Way of Shadow (spells ברמות 3/6/11/17), Way of the Sun Soul, Way of Mercy, Way of the Astral Self.
- **Bard** — Colleges (Lore, Valor, Glamour, Whispers, Swords, Eloquence, Creation) — Magical Secrets מומלצים ברמה 6/14 כ-suggested list, לא forced.

כל spellId שנוסיף נאמת מול `src/data/spells.ts`; חסרים — נוסיף לספר הכישופים.

### 2. עורך פייטס מלא (Wikidot / PHB + XGtE + TCoE)
נחליף את `src/data/feats.ts` ברשימה מקיפה של כל הפייטס שלא קיימים עדיין. כל פייט יכלול:
- `name`, `nameHe`, `prerequisite`, `description` (הסבר עברית קצר), `bonuses` מובנה (כשרלוונטי — ability, hp, speed, ac, initiative).

פייטים שיתווספו/יעודכנו: Fey Touched, Shadow Touched, Telekinetic, Telepathic, Eldritch Adept, Metamagic Adept, Fighting Initiate, Artificer Initiate, Skill Expert, Chef, Gunner, Poisoner, Piercer, Slasher, Crusher, Gift of the Chromatic/Metallic/Gem Dragon, Fey Teleportation, Orcish Fury, Prodigy, Squat Nimbleness, Bountiful Luck, Dragon Fear, Dragon Hide, Drow High Magic, Elven Accuracy, Flames of Phlegethos, Infernal Constitution, Second Chance, Wood Elf Magic, Revenant Blade + כל ה-Racial UA feats מ-wikidot.

**Auto-grant לפי קלאס**: נוסיף פונקציה `getAutoFeats(classId, subclassId, level)` שמחזירה fixed feats שהקלאס מקבל אוטומטית (למשל Fighter — Fighting Style לוכד `fighting_initiate`-דמוי לא נספר; Variant Human/Custom Lineage feat רמה 1). ב-`calculations.ts` וב-`builder.tsx` נצרף אותם אוטומטית ל-featIds אפקטיביים בלי לגעת ב-featIds הידני של המשתמש.

### 3. Fighting Styles / התמחות בנשק
נגדיר `src/data/fighting-styles.ts` חדש עם כל ה-Fighting Styles (Archery, Defense, Dueling, Great Weapon Fighting, Protection, Two-Weapon Fighting, Blind Fighting, Interception, Superior Technique, Thrown Weapon Fighting, Unarmed Fighting, Close Quarters Shooter, Mariner, Tunnel Fighter, Druidic Warrior).

טיפוס חדש `FightingStyle { id, name, nameHe, desc, bonuses? }` ב-`dnd-types.ts`.

`Character` יקבל שדה `fightingStyleIds: string[]`.

בונוסים אוטומטיים:
- Archery — +2 to hit ranged (יוחל ב-`calculations.ts` על מתקפות ranged).
- Defense — +1 AC כשלובש שריון.
- Dueling — +2 damage עם נשק יד אחת.
- GWF — reroll 1s/2s בנזק.
- Two-Weapon — הוספת mod לנזק off-hand.

קלאסים שמקבלים בחירת Fighting Style:
- Fighter — רמה 1 (בחירה 1, ו-Champion רמה 10 עוד אחד).
- Ranger — רמה 2.
- Paladin — רמה 2.
- כל תת-קלאס שנותן FS נוסף (Champion, Cavalier, Samurai, College of Swords, Bladesinger משתמש ב-defense אוטומטית).

UI: ב-`builder.tsx` נוסיף שלב/כרטיס "סגנון קרב" שמופיע רק לקלאסים המתאימים לפי רמה, עם multi-select. ב-`character.$id.tsx` נציג את ה-styles הפעילים ואת הבונוסים הנגזרים.

### 4. Regression: TS2304 + spellbook populated
נוסיף סקריפט `scripts/validate-data.ts` שרץ ב-`bun run` וגם ב-vitest:
- מוודא ש-`tsgo --noEmit` יוצא 0 (אין TS2304 או שגיאה אחרת).
- טוען את `CLASSES` ו-`SPELLS`, ולכל `grantedSpells[].spellIds` בודק שקיים spellId ב-`SPELLS`. אם חסר — throw.
- לכל `subclass.grantedSpells` — מוודא שהרשימה לא ריקה עבור subclasses של הקלאסים המרכזיים.
- נוסיף `bun run validate` ל-package.json.

### 5. קבצים שיושפעו
- `src/data/classes.ts` — grantedSpells מורחב לכל תת-קלאס.
- `src/data/spells.ts` — הוספת spells חסרים שנצטרך.
- `src/data/feats.ts` — רשימה מלאה.
- `src/data/fighting-styles.ts` — קובץ חדש.
- `src/lib/dnd-types.ts` — `FightingStyle`, `fightingStyleIds` על Character, `autoFeats` helper type.
- `src/lib/calculations.ts` — הפעלת bonusים מ-fighting styles ומפייטים אוטומטיים.
- `src/routes/builder.tsx` — כרטיס Fighting Style + עדכון סקירת פייטים אוטומטיים.
- `src/routes/character.$id.tsx` — הצגת fighting styles ופייטים אוטומטיים.
- `src/lib/export-pdf.ts` — הוספת סעיפים ב-PDF.
- `scripts/validate-data.ts` + `package.json` — regression.

## מה לא נעשה בסבב הזה
- לא נבנה עורך UI לכל trait של גזע (כבר קיים).
- לא נגע במערכת הפריטים/ציוד — לא בבקשה.
