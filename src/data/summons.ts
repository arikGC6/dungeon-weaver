// Summon / conjure spell reference statblocks — quick reference for the character sheet.
// Aggregated from Tasha's / MM / Volo's, paraphrased.

export interface SummonStat {
  id: string;
  name: string;
  nameHe: string;
  type: string; // Beast / Fey / Undead / Elemental / etc
  ac: string;
  hp: string;
  speed: string;
  attack: string;
  special?: string;
  spellId?: string; // spell that summons it
}

export const SUMMONS: SummonStat[] = [
  // Bestial Spirits (Summon Beast — Tasha's)
  { spellId: "summon_beast", id: "bestial_air", name: "Bestial Spirit (Air)", nameHe: "רוח חיה — אוויר",
    type: "Beast", ac: "11 + spell level", hp: "20 + 5×(SL-2)", speed: "30 (fly 60)",
    attack: "Multiattack ×2 · +spell attack · 1d4+4+SL slashing", special: "Flyby (no OA)" },
  { spellId: "summon_beast", id: "bestial_land", name: "Bestial Spirit (Land)", nameHe: "רוח חיה — יבשה",
    type: "Beast", ac: "11 + SL", hp: "30 + 5×(SL-2)", speed: "40",
    attack: "Multiattack ×2 · +spell attack · 1d8+4+SL piercing", special: "Charge — +1d6 damage after 20ft" },
  { spellId: "summon_beast", id: "bestial_water", name: "Bestial Spirit (Water)", nameHe: "רוח חיה — מים",
    type: "Beast", ac: "11 + SL", hp: "30 + 5×(SL-2)", speed: "5 (swim 60)",
    attack: "Multiattack ×2 · +spell attack · 1d6+4+SL piercing" },

  // Undead Spirits (Summon Undead)
  { spellId: "summon_undead", id: "undead_ghostly", name: "Undead Spirit (Ghostly)", nameHe: "רוח מת — רפאים",
    type: "Undead", ac: "11 + SL", hp: "30 + 10×(SL-3)", speed: "30 (fly 40, hover)",
    attack: "Grave Bolt +spell · 2d6+3+SL necrotic (60ft)", special: "Incorporeal Movement" },
  { spellId: "summon_undead", id: "undead_putrid", name: "Undead Spirit (Putrid)", nameHe: "רוח מת — נרקב",
    type: "Undead", ac: "11 + SL", hp: "40 + 10×(SL-3)", speed: "30",
    attack: "Rotting Claws · 1d6+3+SL necrotic (poison save)", special: "Frightful" },
  { spellId: "summon_undead", id: "undead_skeletal", name: "Undead Spirit (Skeletal)", nameHe: "רוח מת — שלד",
    type: "Undead", ac: "11 + SL", hp: "30 + 10×(SL-3)", speed: "30",
    attack: "Grave Bow +spell · 1d6+4+SL piercing (150/600)" },

  // Fey Spirits (Summon Fey)
  { spellId: "summon_fey", id: "fey_fuming", name: "Fey Spirit (Fuming)", nameHe: "רוח פייה — זועם",
    type: "Fey", ac: "12 + SL", hp: "30 + 10×(SL-3)", speed: "40",
    attack: "Wrathful Blow +spell · 1d10+4+SL psychic" },
  { spellId: "summon_fey", id: "fey_mirthful", name: "Fey Spirit (Mirthful)", nameHe: "רוח פייה — עליז",
    type: "Fey", ac: "12 + SL", hp: "30 + 10×(SL-3)", speed: "40",
    attack: "Mirthful Blow · 1d10+4+SL psychic", special: "Charming: WIS save or Charmed" },
  { spellId: "summon_fey", id: "fey_tricksy", name: "Fey Spirit (Tricksy)", nameHe: "רוח פייה — תעלולן",
    type: "Fey", ac: "12 + SL", hp: "30 + 10×(SL-3)", speed: "40",
    attack: "Tricksy Blow · 1d6+4+SL psychic", special: "Cast Confusion in a 15ft cube" },

  // Elemental Spirits (Summon Elemental)
  { spellId: "summon_elemental", id: "elem_air", name: "Elemental Spirit (Air)", nameHe: "רוח יסוד — אוויר",
    type: "Elemental", ac: "11 + SL", hp: "50 + 10×(SL-4)", speed: "40 (fly 40, hover)",
    attack: "Multiattack · Slam 1d10+3+SL bludgeoning" },
  { spellId: "summon_elemental", id: "elem_earth", name: "Elemental Spirit (Earth)", nameHe: "רוח יסוד — אדמה",
    type: "Elemental", ac: "14 + SL", hp: "60 + 10×(SL-4)", speed: "40 (burrow 40)",
    attack: "Multiattack · Slam 1d8+4+SL bludgeoning" },
  { spellId: "summon_elemental", id: "elem_fire", name: "Elemental Spirit (Fire)", nameHe: "רוח יסוד — אש",
    type: "Elemental", ac: "12 + SL", hp: "50 + 10×(SL-4)", speed: "40",
    attack: "Multiattack · Fiery 1d8+3+SL fire", special: "Fire Aura 5ft — 1d6 fire" },
  { spellId: "summon_elemental", id: "elem_water", name: "Elemental Spirit (Water)", nameHe: "רוח יסוד — מים",
    type: "Elemental", ac: "13 + SL", hp: "60 + 10×(SL-4)", speed: "30 (swim 40)",
    attack: "Multiattack · Slam 1d8+3+SL cold" },

  // Celestial (Summon Celestial)
  { spellId: "summon_celestial", id: "cel_avenger", name: "Celestial Spirit (Avenger)", nameHe: "רוח שמימית — נוקם",
    type: "Celestial", ac: "11 + SL", hp: "40 + 15×(SL-5)", speed: "30 (fly 40)",
    attack: "Radiant Bow +spell · 2d6+3+SL radiant (150/600)" },
  { spellId: "summon_celestial", id: "cel_defender", name: "Celestial Spirit (Defender)", nameHe: "רוח שמימית — מגן",
    type: "Celestial", ac: "11 + SL", hp: "40 + 15×(SL-5)", speed: "30 (fly 40)",
    attack: "Radiant Mace · 1d10+4+SL radiant", special: "Healing Touch (SL uses/day)" },

  // Fiend (Summon Fiend)
  { spellId: "summon_fiend", id: "fiend_demon", name: "Fiendish Spirit (Demon)", nameHe: "רוח שדית — דמון",
    type: "Fiend", ac: "12 + SL", hp: "60 + 15×(SL-6)", speed: "40",
    attack: "Bite +spell · 1d6+3+SL piercing", special: "Chaotic Rampage" },
  { spellId: "summon_fiend", id: "fiend_devil", name: "Fiendish Spirit (Devil)", nameHe: "רוח שדית — דוויל",
    type: "Fiend", ac: "12 + SL", hp: "50 + 15×(SL-6)", speed: "40 (fly 40)",
    attack: "Hurl Flame +spell · 2d6+3+SL fire" },
  { spellId: "summon_fiend", id: "fiend_yugoloth", name: "Fiendish Spirit (Yugoloth)", nameHe: "רוח שדית — יוגולות'",
    type: "Fiend", ac: "12 + SL", hp: "70 + 15×(SL-6)", speed: "40",
    attack: "Life Drain · 1d10+3+SL necrotic", special: "Heals equal to damage dealt" },

  // Draconic (Summon Draconic Spirit)
  { spellId: "summon_draconic_spirit", id: "drac_chromatic", name: "Draconic Spirit (Chromatic)", nameHe: "רוח דרקון — כרומטי",
    type: "Dragon", ac: "14 + SL", hp: "50 + 10×(SL-5)", speed: "30 (fly 60)",
    attack: "Multi Rend +spell · 1d6+4+SL slashing", special: "Breath Weapon 30ft cone" },

  // Aberration (Summon Aberration)
  { spellId: "summon_aberration", id: "aberr_beholderkin", name: "Aberrant Spirit (Beholderkin)", nameHe: "רוח מוזרה — ביהולדרקין",
    type: "Aberration", ac: "11 + SL", hp: "40 + 10×(SL-4)", speed: "30 (fly 30, hover)",
    attack: "Eye Ray +spell · 1d8+3+SL force (60ft)" },
  { spellId: "summon_aberration", id: "aberr_slaad", name: "Aberrant Spirit (Slaadi)", nameHe: "רוח מוזרה — סלאאד",
    type: "Aberration", ac: "11 + SL", hp: "50 + 10×(SL-4)", speed: "30",
    attack: "Claws · 1d6+3+SL slashing", special: "Regeneration 5 (round)" },
  { spellId: "summon_aberration", id: "aberr_star", name: "Aberrant Spirit (Star Spawn)", nameHe: "רוח מוזרה — סטאר-ספון",
    type: "Aberration", ac: "11 + SL", hp: "40 + 10×(SL-4)", speed: "30",
    attack: "Psychic Slam +spell · 1d10+3+SL psychic" },

  // Construct (Summon Construct)
  { spellId: "summon_construct", id: "const_clay", name: "Construct Spirit (Clay)", nameHe: "רוח יציר — חימר",
    type: "Construct", ac: "13 + SL", hp: "40 + 15×(SL-4)", speed: "30",
    attack: "Slam · 1d6+3+SL bludgeoning" },
  { spellId: "summon_construct", id: "const_metal", name: "Construct Spirit (Metal)", nameHe: "רוח יציר — מתכת",
    type: "Construct", ac: "14 + SL", hp: "40 + 15×(SL-4)", speed: "30",
    attack: "Slam · 2d6+3+SL bludgeoning" },
  { spellId: "summon_construct", id: "const_stone", name: "Construct Spirit (Stone)", nameHe: "רוח יציר — אבן",
    type: "Construct", ac: "15 + SL", hp: "40 + 15×(SL-4)", speed: "20",
    attack: "Slam · 1d10+3+SL bludgeoning", special: "Sentinel — reduces enemy speed" },

  // Shadowspawn (Summon Shadowspawn)
  { spellId: "summon_shadowspawn", id: "shadow_fury", name: "Shadow Spirit (Fury)", nameHe: "רוח צל — זעם",
    type: "Monstrosity", ac: "11 + SL", hp: "40 + 10×(SL-3)", speed: "40",
    attack: "Vicious Claws · 1d6+3+SL slashing (×2)" },
  { spellId: "summon_shadowspawn", id: "shadow_despair", name: "Shadow Spirit (Despair)", nameHe: "רוח צל — יאוש",
    type: "Monstrosity", ac: "11 + SL", hp: "40 + 10×(SL-3)", speed: "40",
    attack: "Withering Claws · 1d6+3+SL necrotic" },
  { spellId: "summon_shadowspawn", id: "shadow_fear", name: "Shadow Spirit (Fear)", nameHe: "רוח צל — פחד",
    type: "Monstrosity", ac: "11 + SL", hp: "40 + 10×(SL-3)", speed: "40",
    attack: "Frightful Claws · 1d6+3+SL psychic", special: "Terrifying Visage" },

  // Conjure Animals typical picks
  { spellId: "conjure_animals", id: "wolf", name: "Wolf (CR 1/4)", nameHe: "זאב",
    type: "Beast", ac: "13", hp: "11", speed: "40",
    attack: "Bite +4 · 2d4+2 piercing (DC 11 STR or prone)", special: "Pack Tactics · Keen Hearing/Smell" },
  { spellId: "conjure_animals", id: "brown_bear", name: "Brown Bear (CR 1)", nameHe: "דוב חום",
    type: "Beast", ac: "11", hp: "34", speed: "40 (climb 30)",
    attack: "Bite +5 · 1d8+4 · Claws +5 · 2d6+4 slashing", special: "Keen Smell" },
  { spellId: "conjure_animals", id: "giant_eagle", name: "Giant Eagle (CR 1)", nameHe: "נשר ענק",
    type: "Beast", ac: "13", hp: "26", speed: "10 (fly 80)",
    attack: "Beak +5 · 1d6+3 piercing · Talons +5 · 2d6+3 slashing" },
  { spellId: "conjure_animals", id: "dire_wolf", name: "Dire Wolf (CR 1)", nameHe: "זאב-פרא ענק",
    type: "Beast", ac: "14", hp: "37", speed: "50",
    attack: "Bite +5 · 2d6+3 piercing (DC 13 STR or prone)", special: "Pack Tactics" },

  // Conjure Woodland Beings
  { spellId: "conjure_woodland_beings", id: "sprite", name: "Sprite (CR 1/4)", nameHe: "ספרייט",
    type: "Fey", ac: "15", hp: "2", speed: "10 (fly 40)",
    attack: "Shortsword +2 · 1 slashing · Shortbow (poison) +6 · 1 piercing + poison save", special: "Invisibility · Heart Sight" },
  { spellId: "conjure_woodland_beings", id: "pixie", name: "Pixie (CR 1/4)", nameHe: "פיקסי",
    type: "Fey", ac: "15", hp: "1", speed: "10 (fly 30)",
    attack: "—", special: "Innate spells: Confusion, Dispel Magic, Polymorph, Sleep, etc." },

  // Conjure Minor Elementals
  { spellId: "conjure_minor_elementals", id: "mud_mephit", name: "Mud Mephit (CR 1/4)", nameHe: "מפיט בוץ",
    type: "Elemental", ac: "11", hp: "27", speed: "20 (fly 20, swim 20)",
    attack: "Fists · 1d6 bludgeoning", special: "Death Burst · Mud Breath" },
  { spellId: "conjure_minor_elementals", id: "magma_mephit", name: "Magma Mephit (CR 1/2)", nameHe: "מפיט מגמה",
    type: "Elemental", ac: "11", hp: "22", speed: "30 (fly 30)",
    attack: "Claws · 1d4+2 slashing + 1d4 fire", special: "Death Burst · Fire Breath" },

  // Conjure Elemental (CR 5)
  { spellId: "conjure_elemental", id: "air_elem", name: "Air Elemental (CR 5)", nameHe: "אלמנטאל אוויר",
    type: "Elemental", ac: "15", hp: "90", speed: "0 (fly 90, hover)",
    attack: "Multiattack · Slam +8 · 2d8+5 bludgeoning", special: "Whirlwind Form" },
  { spellId: "conjure_elemental", id: "earth_elem", name: "Earth Elemental (CR 5)", nameHe: "אלמנטאל אדמה",
    type: "Elemental", ac: "17", hp: "126", speed: "30 (burrow 30)",
    attack: "Multiattack · Slam +8 · 2d8+5 bludgeoning", special: "Earth Glide · Siege Monster" },
  { spellId: "conjure_elemental", id: "fire_elem", name: "Fire Elemental (CR 5)", nameHe: "אלמנטאל אש",
    type: "Elemental", ac: "13", hp: "102", speed: "50",
    attack: "Multiattack · Touch +6 · 2d6+3 fire", special: "Fire Form · Illumination" },
  { spellId: "conjure_elemental", id: "water_elem", name: "Water Elemental (CR 5)", nameHe: "אלמנטאל מים",
    type: "Elemental", ac: "14", hp: "114", speed: "30 (swim 90)",
    attack: "Multiattack · Slam +7 · 2d8+4 bludgeoning", special: "Whelm — engulf" },

  // Animate Dead
  { spellId: "animate_dead", id: "skeleton", name: "Skeleton (CR 1/4)", nameHe: "שלד",
    type: "Undead", ac: "13", hp: "13", speed: "30",
    attack: "Shortsword +4 · 1d6+2 piercing · Shortbow +4 · 1d6+2 piercing" },
  { spellId: "animate_dead", id: "zombie", name: "Zombie (CR 1/4)", nameHe: "זומבי",
    type: "Undead", ac: "8", hp: "22", speed: "20",
    attack: "Slam +3 · 1d6+1 bludgeoning", special: "Undead Fortitude — CON save vs death" },

  // Find Familiar options
  { spellId: "find_familiar", id: "owl_fam", name: "Owl (familiar)", nameHe: "ינשוף (familiar)",
    type: "Beast", ac: "11", hp: "1", speed: "5 (fly 60)",
    attack: "Talons +3 · 1 slashing", special: "Flyby · Keen Hearing and Sight" },
  { spellId: "find_familiar", id: "cat_fam", name: "Cat (familiar)", nameHe: "חתול (familiar)",
    type: "Beast", ac: "12", hp: "2", speed: "40 (climb 30)",
    attack: "Claws +0 · 1 slashing", special: "Keen Smell" },
  { spellId: "find_familiar", id: "bat_fam", name: "Bat (familiar)", nameHe: "עטלף (familiar)",
    type: "Beast", ac: "12", hp: "1", speed: "5 (fly 30)",
    attack: "Bite +0 · 1 piercing", special: "Echolocation · Keen Hearing" },
];

export function getSummonsForSpell(spellId: string) {
  return SUMMONS.filter(s => s.spellId === spellId);
}
