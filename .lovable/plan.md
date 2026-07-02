בקשה גדולה — לפני שאני מתחיל, הנה תוכנית עבודה. אשמח לאישור או סדר עדיפויות.

## 1. כישופי סאב-קלאס אוטומטיים (Domain / School / Oath spells)
- הוספת שדה `grantedSpells` לכל תת-קלאס רלוונטי ב-`src/data/classes.ts`:
  - Cleric Domains (Life, Light, War, Trickery, Nature, Knowledge, Tempest, Death)
  - Wizard Schools — במיוחד **Necromancy** (Animate Dead / Create Undead תמידיים)
  - Paladin Oaths (Devotion, Vengeance, Ancients, Conquest)
  - Warlock Patrons (Fiend, Great Old One, Archfey, Hexblade, Celestial)
  - Ranger Conclaves (Beast Master, Gloom Stalker, Horizon Walker, Monster Slayer)
  - Sorcerer Origins (Divine Soul, Aberrant Mind, Clockwork Soul, Shadow)
  - Druid Circles (Land, Moon, Shepherd, Spores)
  - Rogue (Arcane Trickster) + Fighter (Eldritch Knight) — already caster subclasses
- ב-`src/routes/character.$id.tsx` להציג פאנל חדש: **"✨ כישופי תת-קלאס"** — always-known, מסומן ✦ ב-PDF.
- ב-`src/routes/builder.tsx` שלב הכישופים — להוסיף אותם אוטומטית כ-known (לא ניתן לביטול).

## 2. רקע (Background) שמשפיע על הסטטים אוטומטית
- כשבוחרים background בשלב 3 של האשף, להריץ auto-apply:
  - להוסיף את `background.skills` ל-`skillProficiencies` (אם עדיין לא שם).
  - להוסיף languages count למונה שפות.
- להציג ב-`character.$id.tsx` תג "מהרקע" ליד skill proficiencies שמקורן ברקע.

## 3. עורך תכונות גזע (Race Trait Effects)
כרגע יש עריכה של בונוסי יכולות בלבד. אוסיף:
- ל-`RaceTrait` — שדות אפקט אופציונליים: `speedBonus`, `acBonus`, `hpPerLevel`, `resistances: string[]`, `advantages: string[]`, `extraAttack: {name, damage, bonus}`.
- למלא את השדות האלה לתכונות ה"כבדות" (Tortle Natural Armor 17, Warforged Integrated Protection +1 AC, Hill Dwarf Toughness +1 HP/level, Aarakocra/Fairy Flight 30, Lizardfolk Natural Armor וכו').
- ב-`calculations.ts` — לצרף את האפקטים ל-AC / HP / speed.
- ב-Builder שלב הגזע — checkbox לכל trait ("פעיל?") + עריכת הערכים הנומריים, ותקציר "מה משתנה בסטטים".
- ב-character sheet — להציג כרטיס "🧬 תכונות גזע פעילות" עם הבונוסים המחושבים.

## 4. עוד כישופים (דגש על זימונים)
להוסיף ל-`src/data/spells.ts`:
- **Summon** (Tasha's): Summon Beast, Summon Fey, Summon Undead, Summon Elemental, Summon Aberration, Summon Celestial, Summon Construct, Summon Fiend, Summon Draconic Spirit, Summon Shadowspawn.
- **Conjure** classics: Conjure Animals, Conjure Woodland Beings, Conjure Minor Elementals, Conjure Elemental, Conjure Celestial, Conjure Fey.
- **Necromancy**: Animate Dead, Create Undead, Danse Macabre, Negative Energy Flood, Finger of Death.
- עוד utility חסרים לפי דרישה.

## 5. פריטים & התקפות (כבר קיים ברובו)
מבחינה טכנית זה כבר עובד — יש UI לבחירת weapons/armor/consumables עם quantity, ויש טאב Attacks. אוודא ש-Javelin of Returning / Holy Water / Dagger of Returning נמצאים ומחוברים לבונוסים.

---

**האם להתחיל בכל הארבע במקביל, או להתמקד קודם ב-#1 (subclass spells) ו-#4 (עוד כישופים) שזה החלק החסר ביותר?**