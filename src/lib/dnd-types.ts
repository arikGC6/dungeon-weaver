// Core D&D 5e character types
export type Ability = "str" | "dex" | "con" | "int" | "wis" | "cha";
export const ABILITIES: Ability[] = ["str", "dex", "con", "int", "wis", "cha"];
export const ABILITY_LABELS: Record<Ability, string> = {
  str: "כוח (STR)", dex: "זריזות (DEX)", con: "חוסן (CON)",
  int: "תבונה (INT)", wis: "חוכמה (WIS)", cha: "כריזמה (CHA)",
};
export const ABILITY_SHORT: Record<Ability, string> = {
  str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA",
};

export type Skill =
  | "acrobatics" | "animal_handling" | "arcana" | "athletics" | "deception"
  | "history" | "insight" | "intimidation" | "investigation" | "medicine"
  | "nature" | "perception" | "performance" | "persuasion" | "religion"
  | "sleight_of_hand" | "stealth" | "survival";

export const SKILL_LIST: { id: Skill; label: string; ability: Ability }[] = [
  { id: "acrobatics", label: "אקרובטיקה", ability: "dex" },
  { id: "animal_handling", label: "טיפול בבע״ח", ability: "wis" },
  { id: "arcana", label: "תורת הנסתר", ability: "int" },
  { id: "athletics", label: "אתלטיקה", ability: "str" },
  { id: "deception", label: "הטעיה", ability: "cha" },
  { id: "history", label: "היסטוריה", ability: "int" },
  { id: "insight", label: "תובנה", ability: "wis" },
  { id: "intimidation", label: "הפחדה", ability: "cha" },
  { id: "investigation", label: "חקירה", ability: "int" },
  { id: "medicine", label: "רפואה", ability: "wis" },
  { id: "nature", label: "טבע", ability: "int" },
  { id: "perception", label: "תפיסה", ability: "wis" },
  { id: "performance", label: "מופע", ability: "cha" },
  { id: "persuasion", label: "שכנוע", ability: "cha" },
  { id: "religion", label: "דת", ability: "int" },
  { id: "sleight_of_hand", label: "יד קלה", ability: "dex" },
  { id: "stealth", label: "התגנבות", ability: "dex" },
  { id: "survival", label: "הישרדות", ability: "wis" },
];

export interface AbilityBonus { ability: Ability; amount: number }

export interface RaceTrait { name: string; desc: string }

export interface Race {
  id: string;
  name: string;
  nameHe: string;
  source: string;
  speed: number; // base walking speed in ft
  size: "Small" | "Medium" | "Large";
  abilityBonuses: AbilityBonus[];
  darkvision?: number;
  languages: string[];
  traits: RaceTrait[];
  subraces?: { id: string; name: string; nameHe: string; abilityBonuses: AbilityBonus[]; traits: RaceTrait[] }[];
}

export interface ClassFeature { level: number; name: string; desc: string }

export interface DnDClass {
  id: string;
  name: string;
  nameHe: string;
  hitDie: number; // 6,8,10,12
  primaryAbility: Ability[];
  savingThrows: Ability[];
  skillChoices: { count: number; from: Skill[] };
  casterType: "none" | "full" | "half" | "third" | "pact" | "warlock";
  spellAbility?: Ability;
  subclassLevel: number;
  subclasses: Subclass[];
  features: ClassFeature[];
}

export interface Subclass {
  id: string;
  name: string;
  nameHe: string;
  features: ClassFeature[];
  grantedSpells?: { level: number; spellIds: string[] }[]; // spells granted at class level
}

export type SpellSchool = "abjuration" | "conjuration" | "divination" | "enchantment" | "evocation" | "illusion" | "necromancy" | "transmutation";

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 = cantrip
  school: SpellSchool;
  classes: string[]; // class ids
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  concentration?: boolean;
  ritual?: boolean;
}

export interface Feat {
  id: string;
  name: string;
  nameHe: string;
  prerequisite?: string;
  description: string;
  bonuses?: {
    ability?: AbilityBonus[];
    hpPerLevel?: number;
    hpFlat?: number;
    speed?: number;
    acBonus?: number;
    initiative?: number;
  };
}

export interface Item {
  id: string;
  name: string;
  nameHe?: string;
  category: "armor" | "shield" | "weapon" | "wondrous" | "ring" | "potion" | "rod" | "wand" | "staff" | "gear";
  rarity?: "common" | "uncommon" | "rare" | "very rare" | "legendary" | "artifact";
  attunement?: boolean;
  description: string;
  bonuses?: {
    ability?: AbilityBonus[];
    setAbility?: Partial<Record<Ability, number>>; // set to fixed value (e.g. Gauntlets of Ogre Power → STR 19)
    acBonus?: number;
    acFormula?: "leather" | "studded" | "hide" | "chainShirt" | "scaleMail" | "breastplate" | "halfPlate" | "ringMail" | "chainMail" | "splint" | "plate"; // base armor
    shield?: boolean;
    speed?: number;
    hpFlat?: number;
    attackBonus?: number;
    damageBonus?: number;
  };
}

export interface FightingStyle {
  id: string;
  name: string;
  nameHe: string;
  desc: string;
  bonuses?: {
    rangedAttack?: number;
    oneHandedDamage?: number;
    thrownDamage?: number;
    acWhenArmored?: number;
  };
}

export interface Background {
  id: string;
  name: string;
  nameHe: string;
  skills: Skill[];
  languages: number;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  player?: string;
  portrait?: string; // base64
  level: number;
  raceId: string;
  subraceId?: string;
  classId: string;
  subclassId?: string;
  // Optional multiclass entries. Each has its own level/subclass for resource computation.
  multiclass?: { classId: string; subclassId?: string; level: number }[];
  backgroundId?: string;
  alignment?: string;
  baseAbilities: Record<Ability, number>;
  skillProficiencies: Skill[];
  expertise: Skill[];
  languages: string[];
  featIds: string[];
  spellIds: string[];      // known/learned spells
  preparedSpellIds: string[];
  itemIds: { id: string; equipped: boolean; quantity?: number }[];
  // Free-text equipment the player wrote in (לפיד, אוהל, חבל...)
  equipment?: { name: string; quantity: number; notes?: string }[];
  // Custom attacks (נשק קסום, התקפת unarmed וכו')
  attacks?: { name: string; bonus: string; damage: string; notes?: string }[];
  hpMax?: number; // override
  hpCurrent?: number;
  acOverride?: number;
  speedOverride?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  // Manual overrides for review step (per ability final value)
  manualOverrides?: {
    abilities?: Partial<Record<Ability, number>>;
    saves?: Partial<Record<Ability, number>>;
    skills?: Partial<Record<Skill, number>>;
    spellSaveDc?: number;
    spellAttackBonus?: number;
    initiative?: number;
    proficiencyBonus?: number;
  };
  // Per-ability override of the racial bonus (replaces race+subrace bonus for that ability).
  raceAbilityBonusOverrides?: Partial<Record<Ability, number>>;
  // Extra action-economy slots the player wants tracked (e.g. Haste, Bloodlust).
  extraActionNotes?: string[];
}

export const PROFICIENCY_BY_LEVEL = [
  0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6,
];

export function mod(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatMod(v: number): string {
  return v >= 0 ? `+${v}` : `${v}`;
}

export const ALIGNMENTS: { id: string; label: string }[] = [
  { id: "LG", label: "Lawful Good — חוקי טוב" },
  { id: "NG", label: "Neutral Good — נייטרלי טוב" },
  { id: "CG", label: "Chaotic Good — כאוטי טוב" },
  { id: "LN", label: "Lawful Neutral — חוקי נייטרלי" },
  { id: "TN", label: "True Neutral — נייטרלי" },
  { id: "CN", label: "Chaotic Neutral — כאוטי נייטרלי" },
  { id: "LE", label: "Lawful Evil — חוקי רע" },
  { id: "NE", label: "Neutral Evil — נייטרלי רע" },
  { id: "CE", label: "Chaotic Evil — כאוטי רע" },
];

export const STANDARD_ARRAY_VALUES = [8, 10, 12, 13, 14, 15] as const;
