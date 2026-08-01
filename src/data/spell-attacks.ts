import type { Spell, Ability } from "../lib/dnd-types";

// Attack/save metadata for the most common damaging spells. Keyed by spell id.
// Used by the "spells as attacks" section on the character sheet.
export interface SpellAttackMeta {
  attackType: "melee_spell" | "ranged_spell" | "save";
  damageDice: string;
  damageType: string;
  saveAbility?: Ability;
  higherLevel?: string;
  area?: string;        // "כדור 20ft" / "קו 100×5ft" / "יעד יחיד"
  saveEffect?: string;  // "חצי נזק" / "אין נזק" / "מוגבל"
}

// Area of effect + save outcome, merged into the metadata above.
const AREA_INFO: Record<string, { area?: string; saveEffect?: string }> = {
  fireball: { area: "כדור רדיוס 20ft", saveEffect: "חצי נזק בהצלחה" },
  lightning_bolt: { area: "קו 100ft × 5ft", saveEffect: "חצי נזק בהצלחה" },
  burning_hands: { area: "חרוט 15ft", saveEffect: "חצי נזק בהצלחה" },
  thunderwave: { area: "קובייה 15ft", saveEffect: "חצי נזק, בלי הדיפה" },
  shatter: { area: "כדור רדיוס 10ft", saveEffect: "חצי נזק בהצלחה" },
  cone_of_cold: { area: "חרוט 60ft", saveEffect: "חצי נזק בהצלחה" },
  ice_storm: { area: "גליל רדיוס 20ft, גובה 40ft", saveEffect: "חצי נזק בהצלחה" },
  flame_strike: { area: "גליל רדיוס 10ft, גובה 40ft", saveEffect: "חצי נזק בהצלחה" },
  wall_of_fire: { area: "קיר 60ft × 20ft", saveEffect: "חצי נזק בהצלחה" },
  moonbeam: { area: "גליר רדיוס 5ft", saveEffect: "חצי נזק בהצלחה" },
  call_lightning: { area: "עמוד 5ft ברדיוס 60ft", saveEffect: "חצי נזק בהצלחה" },
  cloud_of_daggers: { area: "קובייה 5ft", saveEffect: "אין save — נזק אוטומטי" },
  word_of_radiance: { area: "רדיוס 5ft סביבך", saveEffect: "אין נזק בהצלחה" },
  acid_splash: { area: "עד 2 יעדים בטווח 5ft זה מזה", saveEffect: "אין נזק בהצלחה" },
  poison_spray: { area: "יעד יחיד ב-10ft", saveEffect: "אין נזק בהצלחה" },
  sacred_flame: { area: "יעד יחיד", saveEffect: "אין נזק בהצלחה" },
  toll_the_dead: { area: "יעד יחיד", saveEffect: "אין נזק בהצלחה" },
  vicious_mockery: { area: "יעד יחיד", saveEffect: "אין נזק/חיסרון בהצלחה" },
  hellish_rebuke: { area: "יעד יחיד (reaction)", saveEffect: "חצי נזק בהצלחה" },
  arms_of_hadar: { area: "רדיוס 10ft סביבך", saveEffect: "חצי נזק בהצלחה" },
  dissonant_whispers: { area: "יעד יחיד", saveEffect: "חצי נזק, בלי בריחה" },
  disintegrate: { area: "יעד יחיד", saveEffect: "אין נזק בהצלחה" },
  finger_of_death: { area: "יעד יחיד", saveEffect: "חצי נזק בהצלחה" },
  flaming_sphere: { area: "רדיוס 5ft סביב הכדור", saveEffect: "חצי נזק בהצלחה" },
  magic_missile: { area: "יעדים לבחירתך", saveEffect: "פגיעה אוטומטית" },
  scorching_ray: { area: "3 קרניים — התקפה לכל קרן", saveEffect: "—" },
};


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
  const base = inline ?? SPELL_ATTACK_META[s.id];
  if (!base) return undefined;
  return { ...AREA_INFO[s.id], ...base, area: base.area ?? AREA_INFO[s.id]?.area, saveEffect: base.saveEffect ?? AREA_INFO[s.id]?.saveEffect };
}

