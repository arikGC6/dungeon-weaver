import type { DnDClass } from "../lib/dnd-types";

// Subclass spells (granted, always prepared) referenced by spell id (matches src/data/spells.ts ids).
// Class features summarized.

export const CLASSES: DnDClass[] = [
  {
    id: "barbarian", name: "Barbarian", nameHe: "ברברי", hitDie: 12,
    primaryAbility: ["str"], savingThrows: ["str", "con"],
    skillChoices: { count: 2, from: ["animal_handling", "athletics", "intimidation", "nature", "perception", "survival"] },
    casterType: "none",
    subclassLevel: 3,
    subclasses: [
      { id: "berserker", name: "Path of the Berserker", nameHe: "מסלול הברסרקר", features: [{ level: 3, name: "Frenzy", desc: "Bonus attack כל תור בזמן rage." }] },
      { id: "totem", name: "Path of the Totem Warrior", nameHe: "לוחם טוטם", features: [{ level: 3, name: "Spirit Seeker", desc: "Beast Sense, Speak with Animals." }] },
      { id: "zealot", name: "Path of the Zealot", nameHe: "זילוט", features: [{ level: 3, name: "Divine Fury", desc: "+1d6+½ level נזק קדוש בתור." }] },
      { id: "ancestral", name: "Path of the Ancestral Guardian", nameHe: "שומר אבות", features: [{ level: 3, name: "Ancestral Protectors", desc: "" }] },
    ],
    features: [
      { level: 1, name: "Rage", desc: "Bonus action — +נזק, resistance to bludgeoning/piercing/slashing." },
      { level: 1, name: "Unarmored Defense", desc: "AC = 10 + DEX mod + CON mod ללא armor." },
      { level: 2, name: "Reckless Attack", desc: "Advantage על STR-based melee, אבל אויבים advantage עליך." },
      { level: 5, name: "Extra Attack", desc: "" },
      { level: 5, name: "Fast Movement", desc: "+10 ft speed ללא armor כבד." },
    ],
  },
  {
    id: "bard", name: "Bard", nameHe: "בארד", hitDie: 8,
    primaryAbility: ["cha"], savingThrows: ["dex", "cha"],
    skillChoices: { count: 3, from: ["acrobatics", "animal_handling", "arcana", "athletics", "deception", "history", "insight", "intimidation", "investigation", "medicine", "nature", "perception", "performance", "persuasion", "religion", "sleight_of_hand", "stealth", "survival"] },
    casterType: "full", spellAbility: "cha",
    subclassLevel: 3,
    subclasses: [
      { id: "lore", name: "College of Lore", nameHe: "מכללת הידע", features: [{ level: 3, name: "Cutting Words", desc: "Reaction — מפחית נזק/הצלחה של אויב." }] },
      { id: "valor", name: "College of Valor", nameHe: "מכללת האומץ", features: [{ level: 3, name: "Combat Inspiration", desc: "" }] },
      { id: "swords", name: "College of Swords", nameHe: "מכללת החרבות", features: [{ level: 3, name: "Blade Flourish", desc: "" }] },
      { id: "whispers", name: "College of Whispers", nameHe: "מכללת הלחישות", features: [{ level: 3, name: "Psychic Blades", desc: "" }] },
    ],
    features: [
      { level: 1, name: "Bardic Inspiration", desc: "Bonus action — d6 לבן ברית." },
      { level: 1, name: "Spellcasting", desc: "" },
      { level: 2, name: "Jack of All Trades", desc: "½ proficiency לכל בדיקה שלא בקיא בה." },
      { level: 3, name: "Expertise", desc: "" },
    ],
  },
  {
    id: "cleric", name: "Cleric", nameHe: "כומר", hitDie: 8,
    primaryAbility: ["wis"], savingThrows: ["wis", "cha"],
    skillChoices: { count: 2, from: ["history", "insight", "medicine", "persuasion", "religion"] },
    casterType: "full", spellAbility: "wis",
    subclassLevel: 1,
    subclasses: [
      { id: "life", name: "Life Domain", nameHe: "תחום החיים", grantedSpells: [{ level: 1, spellIds: ["bless", "cure_wounds"] }, { level: 3, spellIds: ["lesser_restoration", "spiritual_weapon"] }, { level: 5, spellIds: ["revivify", "aura_of_vitality"] }, { level: 7, spellIds: ["guardian_of_faith", "freedom_of_movement"] }, { level: 9, spellIds: ["mass_cure_wounds", "raise_dead"] }], features: [{ level: 1, name: "Disciple of Life", desc: "+2+level לריפוי." }] },
      { id: "light", name: "Light Domain", nameHe: "תחום האור", grantedSpells: [{ level: 1, spellIds: ["burning_hands", "faerie_fire"] }, { level: 3, spellIds: ["flaming_sphere", "scorching_ray"] }, { level: 5, spellIds: ["daylight", "fireball"] }, { level: 7, spellIds: ["guardian_of_faith", "wall_of_fire"] }, { level: 9, spellIds: ["flame_strike", "scrying"] }], features: [{ level: 1, name: "Warding Flare", desc: "Disadvantage להתקפה." }] },
      { id: "war", name: "War Domain", nameHe: "תחום המלחמה", grantedSpells: [{ level: 1, spellIds: ["divine_favor", "shield_of_faith"] }, { level: 3, spellIds: ["magic_weapon", "spiritual_weapon"] }, { level: 5, spellIds: ["crusaders_mantle", "spirit_guardians"] }, { level: 7, spellIds: ["freedom_of_movement", "stoneskin"] }, { level: 9, spellIds: ["flame_strike", "hold_monster"] }], features: [{ level: 1, name: "War Priest", desc: "Bonus attack." }] },
      { id: "knowledge", name: "Knowledge Domain", nameHe: "תחום הידע", grantedSpells: [{ level: 1, spellIds: ["command", "identify"] }, { level: 3, spellIds: ["augury", "suggestion"] }, { level: 5, spellIds: ["speak_with_dead", "tongues"] }, { level: 7, spellIds: ["arcane_eye", "confusion"] }, { level: 9, spellIds: ["scrying", "geas"] }], features: [{ level: 1, name: "Blessings of Knowledge", desc: "2 שפות + 2 מיומנויות." }] },
      { id: "nature", name: "Nature Domain", nameHe: "תחום הטבע", grantedSpells: [{ level: 1, spellIds: ["animal_friendship", "speak_with_animals"] }, { level: 3, spellIds: ["barkskin", "spike_growth"] }, { level: 5, spellIds: ["plant_growth", "call_lightning"] }, { level: 7, spellIds: ["freedom_of_movement", "ice_storm"] }, { level: 9, spellIds: ["wall_of_stone", "cone_of_cold"] }], features: [{ level: 1, name: "Acolyte of Nature", desc: "Druid cantrip + skill." }] },
      { id: "tempest", name: "Tempest Domain", nameHe: "תחום הסערה", grantedSpells: [{ level: 1, spellIds: ["fog_cloud", "thunderwave"] }, { level: 3, spellIds: ["gust_of_wind", "shatter"] }, { level: 5, spellIds: ["call_lightning", "sleet_storm"] }, { level: 7, spellIds: ["control_water", "ice_storm"] }, { level: 9, spellIds: ["destructive_wave", "insect_plague"] }], features: [{ level: 1, name: "Wrath of the Storm", desc: "Reaction — 2d8 lightning/thunder." }] },
      { id: "trickery", name: "Trickery Domain", nameHe: "תחום התעלול", grantedSpells: [{ level: 1, spellIds: ["charm_person", "disguise_self"] }, { level: 3, spellIds: ["mirror_image", "pass_without_trace"] }, { level: 5, spellIds: ["blink", "dispel_magic"] }, { level: 7, spellIds: ["dimension_door", "polymorph"] }, { level: 9, spellIds: ["dominate_person", "modify_memory"] }], features: [{ level: 1, name: "Blessing of the Trickster", desc: "Advantage on Stealth." }] },
      { id: "death", name: "Death Domain", nameHe: "תחום המוות", grantedSpells: [{ level: 1, spellIds: ["false_life", "ray_of_sickness"] }, { level: 3, spellIds: ["blindness_deafness", "ray_of_enfeeblement"] }, { level: 5, spellIds: ["animate_dead", "vampiric_touch"] }, { level: 7, spellIds: ["blight", "death_ward"] }, { level: 9, spellIds: ["antilife_shell", "cloudkill"] }], features: [{ level: 1, name: "Reaper", desc: "Cantrip necromancy + מכה 2 יעדים." }] },
      { id: "grave", name: "Grave Domain", nameHe: "תחום הקבר", grantedSpells: [{ level: 1, spellIds: ["bane", "false_life"] }, { level: 3, spellIds: ["gentle_repose", "ray_of_enfeeblement"] }, { level: 5, spellIds: ["revivify", "vampiric_touch"] }, { level: 7, spellIds: ["blight", "death_ward"] }, { level: 9, spellIds: ["antilife_shell", "raise_dead"] }], features: [{ level: 1, name: "Circle of Mortality", desc: "ריפוי מקסימלי על 0 HP; Spare the Dying מרחוק." }, { level: 1, name: "Eyes of the Grave", desc: "מזהה undead בטווח." }] },

    ],
    features: [
      { level: 1, name: "Spellcasting", desc: "" },
      { level: 1, name: "Divine Domain", desc: "" },
      { level: 2, name: "Channel Divinity", desc: "Turn Undead ועוד לפי domain." },
    ],
  },
  {
    id: "druid", name: "Druid", nameHe: "דרואיד", hitDie: 8,
    primaryAbility: ["wis"], savingThrows: ["int", "wis"],
    skillChoices: { count: 2, from: ["arcana", "animal_handling", "insight", "medicine", "nature", "perception", "religion", "survival"] },
    casterType: "full", spellAbility: "wis",
    subclassLevel: 2,
    subclasses: [
      { id: "moon", name: "Circle of the Moon", nameHe: "מעגל הירח", features: [{ level: 2, name: "Combat Wild Shape", desc: "" }, { level: 2, name: "Circle Forms", desc: "" }] },
      { id: "land", name: "Circle of the Land", nameHe: "מעגל היבשה", features: [{ level: 2, name: "Bonus Cantrip + Natural Recovery", desc: "" }] },
      { id: "shepherd", name: "Circle of the Shepherd", nameHe: "מעגל הרועה", features: [{ level: 2, name: "Speech of the Woods", desc: "" }] },
      { id: "spores", name: "Circle of Spores", nameHe: "מעגל הנבגים", features: [{ level: 2, name: "Halo of Spores", desc: "" }] },
      { id: "stars", name: "Circle of Stars", nameHe: "מעגל הכוכבים", grantedSpells: [{ level: 2, spellIds: ["guiding_bolt"] }, { level: 3, spellIds: ["augury"] }, { level: 5, spellIds: ["clairvoyance"] }, { level: 7, spellIds: ["arcane_eye"] }, { level: 9, spellIds: ["scrying"] }], features: [{ level: 2, name: "Star Map", desc: "מפה שמייצגת את המזלות." }, { level: 2, name: "Starry Form", desc: "Bonus action — צורת כוכב (Archer/Chalice/Dragon)." }] },
      { id: "wildfire", name: "Circle of Wildfire", nameHe: "מעגל האש הפראית", grantedSpells: [{ level: 3, spellIds: ["burning_hands", "cure_wounds"] }, { level: 5, spellIds: ["flaming_sphere", "scorching_ray"] }, { level: 7, spellIds: ["plant_growth", "revivify"] }, { level: 9, spellIds: ["aura_of_vitality", "fire_shield"] }, { level: 11, spellIds: ["flame_strike", "mass_cure_wounds"] }], features: [{ level: 2, name: "Summon Wildfire Spirit", desc: "מזמן רוח אש קטנה — 5+5×level HP." }] },
      { id: "dreams", name: "Circle of Dreams", nameHe: "מעגל החלומות", features: [{ level: 2, name: "Balm of the Summer Court", desc: "d6 healing pool = level." }, { level: 2, name: "Hearth of Moonlight and Shadow", desc: "מקדש מוגן ל-rest." }] },
    ],
    features: [
      { level: 1, name: "Druidic", desc: "שפת הדרואידים." },
      { level: 1, name: "Spellcasting", desc: "" },
      { level: 2, name: "Wild Shape", desc: "" },
    ],
  },
  {
    id: "fighter", name: "Fighter", nameHe: "לוחם", hitDie: 10,
    primaryAbility: ["str", "dex"], savingThrows: ["str", "con"],
    skillChoices: { count: 2, from: ["acrobatics", "animal_handling", "athletics", "history", "insight", "intimidation", "perception", "survival"] },
    casterType: "none",
    subclassLevel: 3,
    subclasses: [
      { id: "champion", name: "Champion", nameHe: "אלוף", features: [{ level: 3, name: "Improved Critical", desc: "קריט על 19-20." }] },
      { id: "battlemaster", name: "Battle Master", nameHe: "אומן קרב", features: [{ level: 3, name: "Combat Superiority", desc: "Superiority dice + maneuvers." }] },
      { id: "eldritch_knight", name: "Eldritch Knight", nameHe: "אביר נסתר", features: [{ level: 3, name: "Spellcasting (1/3)", desc: "" }] },
      { id: "samurai", name: "Samurai", nameHe: "סמוראי", features: [{ level: 3, name: "Fighting Spirit", desc: "" }] },
      { id: "rune_knight", name: "Rune Knight", nameHe: "אביר רונות", features: [{ level: 3, name: "Rune Carver", desc: "" }] },
      { id: "echo_knight", name: "Echo Knight", nameHe: "אביר-הד", features: [{ level: 3, name: "Manifest Echo", desc: "מוציא הד ממדים 15ft — יכול לתקוף דרכו." }, { level: 3, name: "Unleash Incarnation", desc: "התקפה נוספת דרך ההד." }] },
      { id: "psi_warrior", name: "Psi Warrior", nameHe: "לוחם-פסי", features: [{ level: 3, name: "Psionic Power", desc: "Psionic Energy dice — Protective Field, Psionic Strike, Telekinetic Movement." }] },
      { id: "cavalier", name: "Cavalier", nameHe: "קאבלייר", features: [{ level: 3, name: "Born to the Saddle", desc: "יתרון בפעולות רכיבה." }, { level: 3, name: "Unwavering Mark", desc: "אויב שתקוף — disadvantage לתקוף אחרים." }] },
      { id: "arcane_archer", name: "Arcane Archer", nameHe: "קשת-נסתר", features: [{ level: 3, name: "Arcane Shot", desc: "2 Arcane Shots — Banishing Arrow, Piercing Arrow, Seeking Arrow ועוד." }, { level: 3, name: "Magic Arrow", desc: "כל חץ נחשב קסום." }] },
    ],
    features: [
      { level: 1, name: "Fighting Style", desc: "" },
      { level: 1, name: "Second Wind", desc: "Bonus action — d10 + level הילינג." },
      { level: 2, name: "Action Surge", desc: "" },
      { level: 5, name: "Extra Attack", desc: "" },
    ],
  },
  {
    id: "monk", name: "Monk", nameHe: "נזיר", hitDie: 8,
    primaryAbility: ["dex", "wis"], savingThrows: ["str", "dex"],
    skillChoices: { count: 2, from: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"] },
    casterType: "none",
    subclassLevel: 3,
    subclasses: [
      { id: "open_hand", name: "Way of the Open Hand", nameHe: "דרך היד הפתוחה", features: [{ level: 3, name: "Open Hand Technique", desc: "" }] },
      { id: "shadow", name: "Way of Shadow", nameHe: "דרך הצל", features: [{ level: 3, name: "Shadow Arts", desc: "" }] },
      { level: 3 as any, id: "elements" as any, name: "Way of the Four Elements", nameHe: "דרך ארבעת היסודות", features: [{ level: 3, name: "Elemental Attunement", desc: "" }] },
      { id: "mercy", name: "Way of Mercy", nameHe: "דרך החסד", features: [{ level: 3, name: "Hand of Healing/Harm", desc: "" }] },
    ] as any,
    features: [
      { level: 1, name: "Unarmored Defense", desc: "AC = 10 + DEX + WIS." },
      { level: 1, name: "Martial Arts", desc: "d4 unarmed, bonus unarmed strike." },
      { level: 2, name: "Ki", desc: "" },
      { level: 2, name: "Unarmored Movement", desc: "+10 ft speed (ועד +30 ברמות גבוהות)." },
      { level: 5, name: "Extra Attack", desc: "" },
    ],
  },
  {
    id: "paladin", name: "Paladin", nameHe: "פלדין", hitDie: 10,
    primaryAbility: ["str", "cha"], savingThrows: ["wis", "cha"],
    skillChoices: { count: 2, from: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"] },
    casterType: "half", spellAbility: "cha",
    subclassLevel: 3,
    subclasses: [
      { id: "devotion", name: "Oath of Devotion", nameHe: "שבועת המסירות", grantedSpells: [{ level: 3, spellIds: ["protection_from_evil_and_good", "sanctuary"] }, { level: 5, spellIds: ["lesser_restoration", "zone_of_truth"] }, { level: 9, spellIds: ["beacon_of_hope", "dispel_magic"] }, { level: 13, spellIds: ["freedom_of_movement", "guardian_of_faith"] }, { level: 17, spellIds: ["commune", "flame_strike"] }], features: [{ level: 3, name: "Sacred Weapon", desc: "" }] },
      { id: "ancients", name: "Oath of the Ancients", nameHe: "שבועת הקדמונים", grantedSpells: [{ level: 3, spellIds: ["ensnaring_strike", "speak_with_animals"] }, { level: 5, spellIds: ["moonbeam", "misty_step"] }, { level: 9, spellIds: ["plant_growth", "protection_from_energy"] }, { level: 13, spellIds: ["ice_storm", "stoneskin"] }, { level: 17, spellIds: ["commune_with_nature", "tree_stride"] }], features: [{ level: 3, name: "Nature's Wrath", desc: "" }] },
      { id: "vengeance", name: "Oath of Vengeance", nameHe: "שבועת הנקמה", grantedSpells: [{ level: 3, spellIds: ["bane", "hunters_mark"] }, { level: 5, spellIds: ["hold_person", "misty_step"] }, { level: 9, spellIds: ["haste", "protection_from_energy"] }, { level: 13, spellIds: ["banishment", "dimension_door"] }, { level: 17, spellIds: ["hold_monster", "scrying"] }], features: [{ level: 3, name: "Vow of Enmity", desc: "" }] },
      { id: "conquest", name: "Oath of Conquest", nameHe: "שבועת הכיבוש", grantedSpells: [{ level: 3, spellIds: ["armor_of_agathys", "command"] }, { level: 5, spellIds: ["hold_person", "spiritual_weapon"] }, { level: 9, spellIds: ["bestow_curse", "fear"] }, { level: 13, spellIds: ["dominate_beast", "stoneskin"] }, { level: 17, spellIds: ["cloudkill", "dominate_person"] }], features: [{ level: 3, name: "Conquering Presence", desc: "" }] },
      { id: "watchers", name: "Oath of the Watchers", nameHe: "שבועת הצופים", grantedSpells: [{ level: 3, spellIds: ["alarm", "detect_magic"] }, { level: 5, spellIds: ["moonbeam", "see_invisibility"] }, { level: 9, spellIds: ["counterspell", "nondetection"] }, { level: 13, spellIds: ["aura_of_purity", "banishment"] }, { level: 17, spellIds: ["hold_monster", "scrying"] }], features: [{ level: 3, name: "Watcher's Will", desc: "Channel Divinity — advantage על INT/WIS/CHA saves." }] },

    ],
    features: [
      { level: 1, name: "Divine Sense", desc: "" },
      { level: 1, name: "Lay on Hands", desc: "Pool of healing = 5 × level." },
      { level: 2, name: "Fighting Style", desc: "" },
      { level: 2, name: "Divine Smite", desc: "" },
      { level: 5, name: "Extra Attack", desc: "" },
    ],
  },
  {
    id: "ranger", name: "Ranger", nameHe: "סייר", hitDie: 10,
    primaryAbility: ["dex", "wis"], savingThrows: ["str", "dex"],
    skillChoices: { count: 3, from: ["animal_handling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"] },
    casterType: "half", spellAbility: "wis",
    subclassLevel: 3,
    subclasses: [
      { id: "hunter", name: "Hunter", nameHe: "צייד", features: [{ level: 3, name: "Hunter's Prey", desc: "" }] },
      { id: "beastmaster", name: "Beast Master", nameHe: "מאלף", features: [{ level: 3, name: "Ranger's Companion", desc: "" }] },
      { id: "gloomstalker", name: "Gloom Stalker", nameHe: "צייד אופל", grantedSpells: [{ level: 3, spellIds: ["disguise_self"] }, { level: 5, spellIds: ["rope_trick"] }, { level: 9, spellIds: ["fear"] }, { level: 13, spellIds: ["greater_invisibility"] }, { level: 17, spellIds: ["seeming"] }], features: [{ level: 3, name: "Dread Ambusher", desc: "" }] },
      { id: "fey_wanderer", name: "Fey Wanderer", nameHe: "נווד פיות", grantedSpells: [{ level: 3, spellIds: ["charm_person"] }, { level: 5, spellIds: ["misty_step"] }, { level: 9, spellIds: ["dispel_magic"] }, { level: 13, spellIds: ["dimension_door"] }, { level: 17, spellIds: ["mislead"] }], features: [{ level: 3, name: "Dreadful Strikes", desc: "" }] },
      { id: "horizon_walker", name: "Horizon Walker", nameHe: "צועד-אופק", grantedSpells: [{ level: 3, spellIds: ["protection_from_evil_and_good"] }, { level: 5, spellIds: ["misty_step"] }, { level: 9, spellIds: ["haste"] }, { level: 13, spellIds: ["banishment"] }, { level: 17, spellIds: ["teleportation_circle"] }], features: [{ level: 3, name: "Detect Portal", desc: "" }, { level: 3, name: "Planar Warrior", desc: "+1d8 force לפגיעה בנשק." }] },
      { id: "monster_slayer", name: "Monster Slayer", nameHe: "צייד מפלצות", grantedSpells: [{ level: 3, spellIds: ["protection_from_evil_and_good"] }, { level: 5, spellIds: ["zone_of_truth"] }, { level: 9, spellIds: ["magic_circle"] }, { level: 13, spellIds: ["banishment"] }, { level: 17, spellIds: ["hold_monster"] }], features: [{ level: 3, name: "Hunter's Sense", desc: "" }, { level: 3, name: "Slayer's Prey", desc: "+1d6 לפגיעה ראשונה בתור." }] },

    ],
    features: [
      { level: 1, name: "Favored Enemy", desc: "" },
      { level: 1, name: "Natural Explorer", desc: "" },
      { level: 2, name: "Spellcasting", desc: "" },
      { level: 2, name: "Fighting Style", desc: "" },
      { level: 5, name: "Extra Attack", desc: "" },
    ],
  },
  {
    id: "rogue", name: "Rogue", nameHe: "נוכל", hitDie: 8,
    primaryAbility: ["dex"], savingThrows: ["dex", "int"],
    skillChoices: { count: 4, from: ["acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "performance", "persuasion", "sleight_of_hand", "stealth"] },
    casterType: "none",
    subclassLevel: 3,
    subclasses: [
      { id: "thief", name: "Thief", nameHe: "גנב", features: [{ level: 3, name: "Fast Hands", desc: "" }, { level: 3, name: "Second-Story Work", desc: "" }] },
      { id: "assassin", name: "Assassin", nameHe: "מתנקש", features: [{ level: 3, name: "Assassinate", desc: "" }] },
      { id: "arcane_trickster", name: "Arcane Trickster", nameHe: "תעלולן נסתר", features: [{ level: 3, name: "Spellcasting (1/3)", desc: "" }, { level: 3, name: "Mage Hand Legerdemain", desc: "" }] },
      { id: "swashbuckler", name: "Swashbuckler", nameHe: "פיראט", features: [{ level: 3, name: "Fancy Footwork", desc: "" }] },
      { id: "soulknife", name: "Soulknife", nameHe: "סכין-הנפש", features: [
        { level: 3, name: "Psionic Power", desc: "Psionic Energy dice — מוסיף לבדיקות, ריפוי קל." },
        { level: 3, name: "Psychic Blades", desc: "מטיל להבים פסיכיים — d6 psychic + Sneak Attack, טווח 60ft." },
        { level: 9, name: "Soul Blades", desc: "Homing Strikes — re-roll התקפה; Psychic Teleportation עד 30ft." },
      ] },
      { id: "phantom", name: "Phantom", nameHe: "רוח-רפאים", features: [
        { level: 3, name: "Whispers of the Dead", desc: "Proficiency במיומנות לבחירה בכל short rest." },
        { level: 3, name: "Wails from the Grave", desc: "התקפת Sneak Attack — נזק necrotic נוסף ליצור סמוך." },
      ] },
    ],
    features: [
      { level: 1, name: "Expertise", desc: "" },
      { level: 1, name: "Sneak Attack", desc: "1d6 ברמה 1, עולה." },
      { level: 1, name: "Thieves' Cant", desc: "" },
      { level: 2, name: "Cunning Action", desc: "Bonus Dash/Disengage/Hide." },
    ],
  },
  {
    id: "sorcerer", name: "Sorcerer", nameHe: "סורסרר", hitDie: 6,
    primaryAbility: ["cha"], savingThrows: ["con", "cha"],
    skillChoices: { count: 2, from: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"] },
    casterType: "full", spellAbility: "cha",
    subclassLevel: 1,
    subclasses: [
      { id: "draconic", name: "Draconic Bloodline", nameHe: "שושלת דרקונית", features: [{ level: 1, name: "Draconic Resilience", desc: "+1 HP/level, AC 13 + DEX." }] },
      { id: "wild_magic", name: "Wild Magic", nameHe: "קסם פראי", features: [{ level: 1, name: "Wild Magic Surge", desc: "" }] },
      { id: "divine_soul", name: "Divine Soul", nameHe: "נשמה אלוהית", grantedSpells: [{ level: 1, spellIds: ["cure_wounds"] }], features: [{ level: 1, name: "Divine Magic", desc: "בחר קלרי alignment: Good/Evil/Law/Chaos/Neutral — מוסיף spell מ-Cleric list." }] },
      { id: "shadow", name: "Shadow Magic", nameHe: "קסם הצל", features: [{ level: 1, name: "Eyes of the Dark", desc: "Darkvision 120ft; ברמה 3 יכול להטיל Darkness ללא slot." }, { level: 1, name: "Strength of the Grave", desc: "reaction בירידה ל-0 HP." }] },
      { id: "aberrant_mind", name: "Aberrant Mind", nameHe: "מוח מוזר", grantedSpells: [{ level: 1, spellIds: ["arms_of_hadar", "dissonant_whispers"] }, { level: 3, spellIds: ["calm_emotions", "detect_thoughts"] }, { level: 5, spellIds: ["hunger_of_hadar", "sending"] }, { level: 7, spellIds: ["evards_black_tentacles", "summon_aberration"] }, { level: 9, spellIds: ["rary_telepathic_bond", "telekinesis"] }], features: [{ level: 1, name: "Psionic Spells", desc: "כישופים תמידיים." }, { level: 1, name: "Telepathic Speech", desc: "טלפתיה עד CHA mod × 10 דקות." }] },
      { id: "clockwork_soul", name: "Clockwork Soul", nameHe: "נשמת שעון", grantedSpells: [{ level: 1, spellIds: ["alarm", "protection_from_evil_and_good"] }, { level: 3, spellIds: ["aid", "lesser_restoration"] }, { level: 5, spellIds: ["dispel_magic", "protection_from_energy"] }, { level: 7, spellIds: ["freedom_of_movement", "summon_construct"] }, { level: 9, spellIds: ["greater_restoration", "wall_of_force"] }], features: [{ level: 1, name: "Restore Balance", desc: "reaction — מבטל advantage/disadvantage." }] },
      { id: "storm", name: "Storm Sorcery", nameHe: "קסם סערה", features: [{ level: 1, name: "Wind Speaker", desc: "מדבר Primordial." }, { level: 1, name: "Tempestuous Magic", desc: "לאחר הטלת spell ≥1 — לעוף 10ft ללא AoO." }] },
    ],

    features: [
      { level: 1, name: "Spellcasting", desc: "" },
      { level: 2, name: "Font of Magic", desc: "Sorcery Points = level." },
      { level: 3, name: "Metamagic", desc: "" },
    ],
  },
  {
    id: "warlock", name: "Warlock", nameHe: "וורלוק", hitDie: 8,
    primaryAbility: ["cha"], savingThrows: ["wis", "cha"],
    skillChoices: { count: 2, from: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"] },
    casterType: "warlock", spellAbility: "cha",
    subclassLevel: 1,
    subclasses: [
      { id: "fiend", name: "The Fiend", nameHe: "השד", grantedSpells: [{ level: 1, spellIds: ["burning_hands", "command"] }, { level: 3, spellIds: ["blindness_deafness", "scorching_ray"] }, { level: 5, spellIds: ["fireball", "stinking_cloud"] }, { level: 7, spellIds: ["fire_shield", "wall_of_fire"] }, { level: 9, spellIds: ["flame_strike", "hallow"] }], features: [{ level: 1, name: "Dark One's Blessing", desc: "Temp HP בהריגה." }] },
      { id: "archfey", name: "The Archfey", nameHe: "מלך הפיות", grantedSpells: [{ level: 1, spellIds: ["faerie_fire", "sleep"] }, { level: 3, spellIds: ["calm_emotions", "phantasmal_force"] }, { level: 5, spellIds: ["blink", "plant_growth"] }, { level: 7, spellIds: ["dominate_beast", "greater_invisibility"] }, { level: 9, spellIds: ["dominate_person", "seeming"] }], features: [{ level: 1, name: "Fey Presence", desc: "" }] },
      { id: "great_old_one", name: "The Great Old One", nameHe: "הזקן הגדול", grantedSpells: [{ level: 1, spellIds: ["dissonant_whispers", "hideous_laughter"] }, { level: 3, spellIds: ["detect_thoughts", "phantasmal_force"] }, { level: 5, spellIds: ["clairvoyance", "sending"] }, { level: 7, spellIds: ["dominate_beast", "evards_black_tentacles"] }, { level: 9, spellIds: ["dominate_person", "telekinesis"] }], features: [{ level: 1, name: "Awakened Mind", desc: "" }] },
      { id: "hexblade", name: "The Hexblade", nameHe: "החרב המוקסמת", grantedSpells: [{ level: 1, spellIds: ["shield", "wrathful_smite"] }, { level: 3, spellIds: ["blur", "branding_smite"] }, { level: 5, spellIds: ["blink", "elemental_weapon"] }, { level: 7, spellIds: ["phantasmal_killer", "staggering_smite"] }, { level: 9, spellIds: ["banishing_smite", "cone_of_cold"] }], features: [{ level: 1, name: "Hexblade's Curse", desc: "Bonus action — קללה על מטרה." }, { level: 1, name: "Hex Warrior", desc: "CHA לנשק קסום." }] },
      { id: "celestial", name: "The Celestial", nameHe: "השמיימי", grantedSpells: [{ level: 1, spellIds: ["cure_wounds", "guiding_bolt"] }, { level: 3, spellIds: ["flaming_sphere", "lesser_restoration"] }, { level: 5, spellIds: ["daylight", "revivify"] }, { level: 7, spellIds: ["guardian_of_faith", "wall_of_fire"] }, { level: 9, spellIds: ["flame_strike", "greater_restoration"] }], features: [{ level: 1, name: "Healing Light", desc: "" }] },
      { id: "fathomless", name: "The Fathomless", nameHe: "מעמקי-האוקיינוס", grantedSpells: [{ level: 1, spellIds: ["create_or_destroy_water", "thunderwave"] }, { level: 3, spellIds: ["gust_of_wind", "silence"] }, { level: 5, spellIds: ["lightning_bolt", "sleet_storm"] }, { level: 7, spellIds: ["control_water", "summon_elemental"] }, { level: 9, spellIds: ["bigbys_hand", "cone_of_cold"] }], features: [{ level: 1, name: "Tentacle of the Deeps", desc: "Bonus action — זרוע מים 10ft שמכה 1d8." }] },
      { id: "genie", name: "The Genie", nameHe: "הג'יני", grantedSpells: [{ level: 1, spellIds: ["detect_evil_and_good", "sleep"] }, { level: 3, spellIds: ["phantasmal_force", "see_invisibility"] }, { level: 5, spellIds: ["create_food_and_water", "tongues"] }, { level: 7, spellIds: ["arcane_eye", "phantasmal_killer"] }, { level: 9, spellIds: ["creation", "legend_lore"] }], features: [{ level: 1, name: "Genie's Vessel", desc: "כלי מטבעות/פחית/מנורה — נכנס אליו כ-action." }] },

    ],
    features: [
      { level: 1, name: "Pact Magic", desc: "Spell slots מוגבלים אך מתחדשים ב-short rest." },
      { level: 2, name: "Eldritch Invocations", desc: "" },
      { level: 3, name: "Pact Boon", desc: "Chain/Blade/Tome/Talisman." },
    ],
  },
  {
    id: "wizard", name: "Wizard", nameHe: "קוסם", hitDie: 6,
    primaryAbility: ["int"], savingThrows: ["int", "wis"],
    skillChoices: { count: 2, from: ["arcana", "history", "insight", "investigation", "medicine", "religion"] },
    casterType: "full", spellAbility: "int",
    subclassLevel: 2,
    subclasses: [
      { id: "evocation", name: "School of Evocation", nameHe: "בית-ספר לאבוקציה", features: [{ level: 2, name: "Sculpt Spells", desc: "הגנה על בעלי ברית מפיצוץ." }] },
      { id: "abjuration", name: "School of Abjuration", nameHe: "אבחרציה", features: [{ level: 2, name: "Arcane Ward", desc: "" }] },
      { id: "divination", name: "School of Divination", nameHe: "דיווינציה", features: [{ level: 2, name: "Portent", desc: "" }] },
      { id: "necromancy", name: "School of Necromancy", nameHe: "נקרומנציה", grantedSpells: [{ level: 2, spellIds: ["chill_touch", "false_life", "ray_of_sickness"] }, { level: 3, spellIds: ["blindness_deafness", "ray_of_enfeeblement"] }, { level: 5, spellIds: ["animate_dead", "vampiric_touch"] }, { level: 7, spellIds: ["blight", "summon_undead"] }, { level: 9, spellIds: ["danse_macabre", "negative_energy_flood"] }, { level: 11, spellIds: ["circle_of_death", "create_undead", "eyebite"] }, { level: 13, spellIds: ["finger_of_death"] }], features: [{ level: 2, name: "Grim Harvest", desc: "כשאתה הורג יצור עם spell — מחזיר HP = 2×spell level (3× לנקרומנציה)." }, { level: 6, name: "Undead Thralls", desc: "Animate Dead: יעד נוסף; +proficiency HP; +proficiency לנזק שלהם." }, { level: 10, name: "Inured to Undeath", desc: "Resistance ל-necrotic; מקסימום HP לא יכול לרדת." }, { level: 14, name: "Command Undead", desc: "Action — לוקח שליטה על undead (CHA save)." }] },
      { id: "conjuration", name: "School of Conjuration", nameHe: "קונג'ורציה", grantedSpells: [{ level: 2, spellIds: ["find_familiar", "grease", "fog_cloud"] }, { level: 3, spellIds: ["misty_step", "web"] }, { level: 5, spellIds: ["stinking_cloud", "summon_fey", "summon_shadowspawn"] }, { level: 7, spellIds: ["dimension_door", "summon_aberration", "summon_construct", "summon_elemental"] }, { level: 9, spellIds: ["conjure_elemental", "summon_draconic_spirit"] }, { level: 11, spellIds: ["conjure_fey", "summon_fiend"] }], features: [{ level: 2, name: "Minor Conjuration", desc: "יוצר חפץ פשוט עד 3ft/10lb לשעה." }, { level: 2, name: "Benign Transposition", desc: "טלפורט 30ft (LR / לאחר הטלת conjuration ≥1)." }, { level: 6, name: "Focused Conjuration", desc: "ריכוז על conjuration לא נשבר מנזק." }, { level: 10, name: "Durable Summons", desc: "יצורים מוזמנים מקבלים 30 temp HP." }] },
      { id: "enchantment", name: "School of Enchantment", nameHe: "אנצ'נטמנט", grantedSpells: [{ level: 2, spellIds: ["charm_person", "sleep", "hideous_laughter"] }, { level: 3, spellIds: ["hold_person", "suggestion"] }, { level: 5, spellIds: ["hypnotic_pattern"] }, { level: 7, spellIds: ["confusion"] }, { level: 9, spellIds: ["hold_monster", "geas"] }], features: [{ level: 2, name: "Hypnotic Gaze", desc: "action — יצור סמוך: WIS save או Charmed + Incapacitated." }, { level: 6, name: "Instinctive Charm", desc: "reaction — מפנה התקפה ליצור אחר." }] },
      { id: "illusion", name: "School of Illusion", nameHe: "אשליה", grantedSpells: [{ level: 2, spellIds: ["disguise_self", "silent_image", "color_spray"] }, { level: 3, spellIds: ["invisibility", "mirror_image", "phantasmal_force"] }, { level: 5, spellIds: ["hypnotic_pattern", "major_image"] }, { level: 7, spellIds: ["greater_invisibility", "phantasmal_killer"] }, { level: 9, spellIds: ["seeming", "mislead"] }], features: [{ level: 2, name: "Improved Minor Illusion", desc: "Minor Illusion משלב צליל+תמונה." }, { level: 6, name: "Malleable Illusions", desc: "שינוי צורת האשליה כ-action." }] },
      { id: "transmutation", name: "School of Transmutation", nameHe: "טרנסמוטציה", grantedSpells: [{ level: 2, spellIds: ["feather_fall", "longstrider"] }, { level: 3, spellIds: ["darkvision", "enlarge_reduce", "spider_climb"] }, { level: 5, spellIds: ["fly", "haste"] }, { level: 7, spellIds: ["polymorph", "stoneskin"] }, { level: 9, spellIds: ["animate_objects", "telekinesis"] }], features: [{ level: 2, name: "Minor Alchemy", desc: "10 דק' — מסב חומר של חפץ." }, { level: 6, name: "Transmuter's Stone", desc: "אבן נותנת darkvision/speed/proficiency." }] },

      { id: "bladesinging", name: "Bladesinging", nameHe: "שירת להב", features: [{ level: 2, name: "Bladesong", desc: "+CHA AC, +10 speed, advantage על acrobatics." }] },
      { id: "war_magic", name: "War Magic", nameHe: "קסם מלחמה", features: [{ level: 2, name: "Arcane Deflection", desc: "" }] },
      { id: "chronurgy", name: "Chronurgy Magic", nameHe: "כרונורגיה", grantedSpells: [{ level: 2, spellIds: ["longstrider"] }, { level: 3, spellIds: ["gift_of_alacrity"] }], features: [{ level: 2, name: "Chronal Shift", desc: "2×/rest — reroll d20 של יצור בטווח 30ft." }, { level: 2, name: "Temporal Awareness", desc: "+INT ליוזמה." }] },
      { id: "graviturgy", name: "Graviturgy Magic", nameHe: "גרוויטורגיה", features: [{ level: 2, name: "Adjust Density", desc: "פי-2 או חצי המשקל של יצור." }, { level: 2, name: "Gravity Well", desc: "כל spell — יעד זז 5ft." }] },
      { id: "order_of_scribes", name: "Order of Scribes", nameHe: "מסדר הסופרים", features: [{ level: 2, name: "Wizardly Quill", desc: "עט קסום לחתימת ספרי כישופים." }, { level: 2, name: "Awakened Spellbook", desc: "הספר מחליף school ל-spells + טקסים מוזרים." }] },
    ],
    features: [
      { level: 1, name: "Spellcasting", desc: "" },
      { level: 1, name: "Arcane Recovery", desc: "" },
      { level: 18, name: "Spell Mastery", desc: "" },
    ],
  },
  {
    id: "artificer", name: "Artificer", nameHe: "ארטיפיסר", hitDie: 8,
    primaryAbility: ["int"], savingThrows: ["con", "int"],
    skillChoices: { count: 2, from: ["arcana", "history", "investigation", "medicine", "nature", "perception", "sleight_of_hand"] },
    casterType: "half", spellAbility: "int",
    subclassLevel: 3,
    subclasses: [
      { id: "alchemist", name: "Alchemist", nameHe: "אלכימאי", features: [{ level: 3, name: "Experimental Elixir", desc: "" }] },
      { id: "artillerist", name: "Artillerist", nameHe: "ארטילריסט", features: [{ level: 3, name: "Eldritch Cannon", desc: "" }] },
      { id: "battle_smith", name: "Battle Smith", nameHe: "נפח קרבי", features: [{ level: 3, name: "Steel Defender", desc: "" }] },
      { id: "armorer", name: "Armorer", nameHe: "אורמורר", features: [{ level: 3, name: "Arcane Armor", desc: "" }] },
    ],
    features: [
      { level: 1, name: "Magical Tinkering", desc: "" },
      { level: 1, name: "Spellcasting", desc: "" },
      { level: 2, name: "Infuse Item", desc: "" },
    ],
  },
];

export function getClass(id?: string) { return CLASSES.find((c) => c.id === id); }

// === Spell Slot tables ===
// Full caster (Bard, Cleric, Druid, Sorcerer, Wizard)
const FULL_CASTER_SLOTS: number[][] = [
  [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1],
  [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

// Half caster (Paladin, Ranger, Artificer rounded up)
const HALF_CASTER_SLOTS: number[][] = [
  [], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2],
  [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2],
  [4, 3, 3, 3, 1], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2],
];

// Third caster (Eldritch Knight, Arcane Trickster)
const THIRD_CASTER_SLOTS: number[][] = [
  [], [], [2], [3], [3], [3], [4, 2], [4, 2], [4, 2], [4, 3],
  [4, 3], [4, 3], [4, 3, 2], [4, 3, 2], [4, 3, 2], [4, 3, 3],
  [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1],
];

// Warlock Pact Magic — slots all at same level, recover on short rest
const WARLOCK_SLOTS: { count: number; level: number }[] = [
  { count: 1, level: 1 }, { count: 2, level: 1 }, { count: 2, level: 2 }, { count: 2, level: 2 },
  { count: 2, level: 3 }, { count: 2, level: 3 }, { count: 2, level: 4 }, { count: 2, level: 4 },
  { count: 2, level: 5 }, { count: 2, level: 5 }, { count: 3, level: 5 }, { count: 3, level: 5 },
  { count: 3, level: 5 }, { count: 3, level: 5 }, { count: 3, level: 5 }, { count: 3, level: 5 },
  { count: 4, level: 5 }, { count: 4, level: 5 }, { count: 4, level: 5 }, { count: 4, level: 5 },
];

export interface SpellSlotsInfo {
  type: "standard" | "pact" | "none";
  slots: { level: number; count: number }[];
  cantripsKnown?: number;
  notes?: string;
}

const CANTRIPS_BY_CLASS: Record<string, number[]> = {
  bard: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  cleric: [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
  druid: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  sorcerer: [4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6],
  warlock: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  wizard: [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
  artificer: [2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3],
};

export function getSpellSlots(classId: string, level: number, subclassId?: string): SpellSlotsInfo {
  const cls = getClass(classId);
  if (!cls || cls.casterType === "none") {
    // Eldritch Knight / Arcane Trickster — third casters via subclass
    if ((classId === "fighter" && subclassId === "eldritch_knight") ||
        (classId === "rogue" && subclassId === "arcane_trickster")) {
      const arr = THIRD_CASTER_SLOTS[Math.max(0, Math.min(19, level - 1))];
      return { type: "standard", slots: arr.map((c, i) => ({ level: i + 1, count: c })) };
    }
    return { type: "none", slots: [] };
  }
  const lvl = Math.max(1, Math.min(20, level));
  if (cls.casterType === "warlock") {
    const w = WARLOCK_SLOTS[lvl - 1];
    return { type: "pact", slots: [{ level: w.level, count: w.count }], cantripsKnown: CANTRIPS_BY_CLASS.warlock[lvl - 1], notes: "Pact Magic — מתחדש ב-short rest" };
  }
  const table = cls.casterType === "full" ? FULL_CASTER_SLOTS : HALF_CASTER_SLOTS;
  const arr = table[lvl - 1] ?? [];
  return {
    type: "standard",
    slots: arr.map((c, i) => ({ level: i + 1, count: c })),
    cantripsKnown: CANTRIPS_BY_CLASS[classId]?.[lvl - 1],
  };
}
