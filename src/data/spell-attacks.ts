import type { Spell, Ability } from "../lib/dnd-types";

// Attack/save metadata for the most common damaging spells. Keyed by spell id.
// Used by the "spells as attacks" section on the character sheet.
export interface SpellAttackMeta {
  attackType: "melee_spell" | "ranged_spell" | "save";
  damageDice: string;
  damageType: string;
  saveAbility?: Ability;
  higherLevel?: string;
}

export const SPELL_ATTACK_META: Record<string, SpellAttackMeta> = {
  // Cantrips
  fire_bolt: { attackType: "ranged_spell", damageDice: "1d10", damageType: "אש", higherLevel: "5:2d10 · 11:3d10 · 17:4d10" },
  eldritch_blast: { attackType: "ranged_spell", damageDice: "1d10", damageType: "כוח (force)", higherLevel: "5:2 קרניים · 11:3 · 17:4" },
  ray_of_frost: { attackType: "ranged_spell", damageDice: "1d8", damageType: "קור", higherLevel: "5:2d8 · 11:3d8 · 17:4d8" },
  chill_touch: { attackType: "ranged_spell", damageDice: "1d8", damageType: "necrotic", higherLevel: "5:2d8 · 11:3d8 · 17:4d8" },
  poison_spray: { attackType: "save", damageDice: "1d12", damageType: "רעל", saveAbility: "con", higherLevel: "5:2d12 · 11:3d12 · 17:4d12" },
  acid_splash: { attackType: "save", damageDice: "1d6", damageType: "חומצה", saveAbility: "dex", higherLevel: "5:2d6 · 11:3d6 · 17:4d6" },
  sacred_flame: { attackType: "save", damageDice: "1d8", damageType: "radiant", saveAbility: "dex", higherLevel: "5:2d8 · 11:3d8 · 17:4d8" },
  toll_the_dead: { attackType: "save", damageDice: "1d8/1d12", damageType: "necrotic", saveAbility: "wis", higherLevel: "d12 אם פצוע" },
  vicious_mockery: { attackType: "save", damageDice: "1d4", damageType: "psychic", saveAbility: "wis", higherLevel: "5:2d4 · 11:3d4 · 17:4d4" },
  shocking_grasp: { attackType: "melee_spell", damageDice: "1d8", damageType: "lightning", higherLevel: "5:2d8 · 11:3d8 · 17:4d8" },
  produce_flame: { attackType: "ranged_spell", damageDice: "1d8", damageType: "אש", higherLevel: "5:2d8 · 11:3d8 · 17:4d8" },
  word_of_radiance: { attackType: "save", damageDice: "1d6", damageType: "radiant", saveAbility: "con" },

  // Level 1
  burning_hands: { attackType: "save", damageDice: "3d6", damageType: "אש", saveAbility: "dex", higherLevel: "+1d6 לכל רמה" },
  chromatic_orb: { attackType: "ranged_spell", damageDice: "3d8", damageType: "לפי בחירה", higherLevel: "+1d8 לכל רמה" },
  guiding_bolt: { attackType: "ranged_spell", damageDice: "4d6", damageType: "radiant", higherLevel: "+1d6 לכל רמה. יעד — advantage להתקפה הבאה." },
  inflict_wounds: { attackType: "melee_spell", damageDice: "3d10", damageType: "necrotic", higherLevel: "+1d10 לכל רמה" },
  magic_missile: { attackType: "ranged_spell", damageDice: "3× 1d4+1", damageType: "כוח (force)", higherLevel: "+1 חץ לכל רמה" },
  witch_bolt: { attackType: "ranged_spell", damageDice: "1d12", damageType: "lightning", higherLevel: "+1d12 slot; המשך פעולה — 1d12 נזק ריכוז" },
  thunderwave: { attackType: "save", damageDice: "2d8", damageType: "רעם", saveAbility: "con", higherLevel: "+1d8 לכל רמה" },
  cure_wounds: { attackType: "melee_spell", damageDice: "1d8+mod", damageType: "ריפוי", higherLevel: "+1d8 לכל רמה" },
  ray_of_sickness: { attackType: "ranged_spell", damageDice: "2d8", damageType: "רעל", higherLevel: "+1d8 לכל רמה" },
  hellish_rebuke: { attackType: "save", damageDice: "2d10", damageType: "אש", saveAbility: "dex", higherLevel: "+1d10 לכל רמה" },
  arms_of_hadar: { attackType: "save", damageDice: "2d6", damageType: "necrotic", saveAbility: "str", higherLevel: "+1d6 לכל רמה" },
  dissonant_whispers: { attackType: "save", damageDice: "3d6", damageType: "psychic", saveAbility: "wis", higherLevel: "+1d6 לכל רמה" },

  // Level 2
  scorching_ray: { attackType: "ranged_spell", damageDice: "3× 2d6", damageType: "אש", higherLevel: "+1 קרן לכל רמה" },
  shatter: { attackType: "save", damageDice: "3d8", damageType: "רעם", saveAbility: "con", higherLevel: "+1d8 לכל רמה" },
  moonbeam: { attackType: "save", damageDice: "2d10", damageType: "radiant", saveAbility: "con", higherLevel: "+1d10 לכל רמה" },
  flaming_sphere: { attackType: "save", damageDice: "2d6", damageType: "אש", saveAbility: "dex", higherLevel: "+1d6 לכל רמה" },
  melfs_acid_arrow: { attackType: "ranged_spell", damageDice: "4d4 + 2d4", damageType: "חומצה", higherLevel: "+1d4/+1d4 לכל רמה" },
  ray_of_enfeeblement: { attackType: "ranged_spell", damageDice: "—", damageType: "החלשה (חצי נזק STR)" },
  cloud_of_daggers: { attackType: "save", damageDice: "4d4", damageType: "slashing", saveAbility: "—" as any },

  // Level 3
  fireball: { attackType: "save", damageDice: "8d6", damageType: "אש", saveAbility: "dex", higherLevel: "+1d6 לכל רמה" },
  lightning_bolt: { attackType: "save", damageDice: "8d6", damageType: "lightning", saveAbility: "dex", higherLevel: "+1d6 לכל רמה" },
  call_lightning: { attackType: "save", damageDice: "3d10", damageType: "lightning", saveAbility: "dex", higherLevel: "+1d10 לכל רמה" },
  vampiric_touch: { attackType: "melee_spell", damageDice: "3d6", damageType: "necrotic", higherLevel: "+1d6 לכל רמה; ריפוי חצי" },

  // Level 4+
  ice_storm: { attackType: "save", damageDice: "2d8+4d6", damageType: "bludgeoning+קור", saveAbility: "dex", higherLevel: "+1d8 לכל רמה" },
  wall_of_fire: { attackType: "save", damageDice: "5d8", damageType: "אש", saveAbility: "dex", higherLevel: "+1d8 לכל רמה" },
  cone_of_cold: { attackType: "save", damageDice: "8d8", damageType: "קור", saveAbility: "con", higherLevel: "+1d8 לכל רמה" },
  flame_strike: { attackType: "save", damageDice: "4d6+4d6", damageType: "אש+radiant", saveAbility: "dex", higherLevel: "+1d6/+1d6 לכל רמה" },
  disintegrate: { attackType: "save", damageDice: "10d6+40", damageType: "כוח (force)", saveAbility: "dex", higherLevel: "+3d6 לכל רמה" },
  finger_of_death: { attackType: "save", damageDice: "7d8+30", damageType: "necrotic", saveAbility: "con" },
};

export function getSpellAttackMeta(s: Spell | { id: string } | undefined): SpellAttackMeta | undefined {
  if (!s) return undefined;
  // Prefer inline metadata on the Spell if provided; else fall back to the map.
  const inline = (s as Spell).damageDice ? {
    attackType: (s as Spell).attackType ?? "save",
    damageDice: (s as Spell).damageDice!,
    damageType: (s as Spell).damageType ?? "",
    saveAbility: (s as Spell).saveAbility,
    higherLevel: (s as Spell).higherLevel,
  } as SpellAttackMeta : undefined;
  return inline ?? SPELL_ATTACK_META[s.id];
}
