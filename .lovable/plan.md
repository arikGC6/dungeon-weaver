## תוכנית עבודה — הרחבה מקיפה למחולל הדמויות

### 1. חיפוש וסינון כישופים (Spell Search)
- קומפוננטת חיפוש חדשה בשלב הכישופים ב-`builder.tsx` ובדף הדמות `character.$id.tsx`:
  - שדה חיפוש טקסט חופשי (שם + תיאור)
  - סינון לפי: מקצוע, תת-קלאס, רמה (0-9), אסכולה
  - הצגת כישופי סאב-קלאס (grantedSpells) בסקציה נפרדת עם תג ✦
- שילוב ב-PDF (`export-pdf.ts`) — סקציה נפרדת "כישופי תת-קלאס" עם תג always-prepared

### 2. מסך פריטים מלא (Equipment Manager)
- טאב חדש/משופר "ציוד" בשלב הבנייה:
  - חיפוש + סינון לפי קטגוריה (weapon/armor/shield/potion/wondrous/ring/wand/staff/rod/gear)
  - כמויות עם +/- לכל פריט
  - סימון equipped/attuned
  - הצגה מיידית של הבונוסים המתקבלים (AC/HP/attack/damage/ability)
- אפליקציה של כל bonuses ב-`calculations.ts` — לוודא ש-holy_water, javelin_returning, dagger_returning, וכל הפריטים החדשים מחוברים

### 3. עורך Race Traits מלא
- הצגת כל ה-traits של הגזע/תת-גזע כרשימה בשלב הגזע
- לכל trait — checkbox פעיל + שדות עריכה (bonus values)
- הרחבת `RaceTrait` בטיפוסים: `speedBonus`, `acBonus`, `hpPerLevel`, `resistances[]`, `advantages[]`, `extraAttack`
- שילוב ב-`calculations.ts` לחישוב AC/HP/speed מותאמים
- כרטיס "🧬 תכונות גזע פעילות" ב-character sheet וב-PDF

### 4. הרחבת תוכן
- **סאב-קלאסים חסרים** ב-`classes.ts`:
  - Wizard: Bladesinging, War Magic, Chronurgy, Graviturgy, Order of Scribes
  - Druid: Circle of Stars, Circle of Wildfire, Circle of Dreams
  - Sorcerer: Storm, Shadow Magic, Aberrant Mind, Clockwork Soul
  - Warrior (Fighter): Rune Knight, Echo Knight, Psi Warrior, Cavalier, Samurai, Arcane Archer
  + `grantedSpells` לכל אחד
- **רקעים חדשים** ב-`backgrounds.ts`: Far Traveler, Haunted One, Inheritor, Knight, Pirate, City Watch, Clan Crafter, Cloistered Scholar, Courtier, Gladiator, Anthropologist
- **גזע Verdan** (חדש) + עוד גזעים: Kobold, Bugbear, Goblin, Hobgoblin, Tabaxi, Loxodon, Simic Hybrid, Owlin
- **Feats** נוספים: Piercer, Slasher, Crusher, Skill Expert, Chef, Gunner, Metamagic Adept, Fighting Initiate, Poisoner, Eldritch Adept (real), Artificer Initiate
- **כישופים** — עוד ~30 (True Polymorph, Wish, Simulacrum, Clone, Sunburst, Meteor Swarm, וכו')
- **מפלצות/בעלי ברית לזימונים** — קובץ חדש `src/data/summons.ts`:
  - Beast (CR by level), Fey, Undead, Elemental, Fiend, Celestial, Construct, Aberration, Draconic, Shadowspawn — כולם עם AC/HP/Attack/Damage/traits
  - הצגה בכישופי summon בדף הדמות
- **ציוד לבישה** ב-`items.ts`: 
  - נעליים: Boots of Elvenkind, Boots of Speed, Boots of Striding and Springing, Winged Boots, Boots of Levitation
  - כפפות: Gloves of Missile Snaring, Gauntlets of Ogre Power, Gloves of Thievery, Gloves of Swimming and Climbing
  - כובעים/קסדות: Helm of Comprehending Languages, Helm of Telepathy, Helm of Brilliance, Circlet of Blasting, Hat of Disguise, Headband of Intellect

### קבצים שיושפעו
- `src/data/spells.ts` — הרחבה
- `src/data/classes.ts` — סאב-קלאסים חדשים + grantedSpells
- `src/data/races.ts` — Verdan + גזעים + traits מלאים
- `src/data/backgrounds.ts` — רקעים חדשים
- `src/data/feats.ts` — feats חדשים
- `src/data/items.ts` — ציוד לבישה מגנטי
- `src/data/summons.ts` — **חדש**
- `src/lib/dnd-types.ts` — הרחבת RaceTrait + Summon type
- `src/lib/calculations.ts` — אפקטים מגזע/פריטים
- `src/routes/builder.tsx` — SpellSearch, EquipmentManager, RaceTraitEditor
- `src/routes/character.$id.tsx` — הצגת traits/summons/subclass spells
- `src/lib/export-pdf.ts` — סקציות חדשות

### סדר ביצוע (Big Bang — הכל בפעימה אחת)
1. הרחבת טיפוסים + data files (כישופים, סאב-קלאסים, גזעים, רקעים, feats, פריטים, summons)
2. קומפוננטת חיפוש כישופים
3. מסך פריטים
4. עורך race traits
5. חישובים + PDF

זה עבודה כבדה מאוד (10+ קבצים גדולים). אפשר להתחיל?
