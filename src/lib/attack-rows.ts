import type { Character, Spell } from "./dnd-types";
import { formatMod } from "./dnd-types";
import { getSpellAttackMeta } from "../data/spell-attacks";

export interface SpellAttackRow {
  id: string;
  name: string;
  kind: string;            // "Save" / "מגע" / "טווח" / "אפקט"
  range: string;
  area: string;
  bonusOrDc: string;
  damageDice: string;
  damageType: string;
  saveEffect: string;
  higherLevel: string;
  resource: string;
  notes: string;
  overridden: boolean;
}

// Default resource cost for casting a spell, before manual overrides.
export function defaultSpellResource(c: Character, spell: Spell): string {
  if (spell.level === 0) return "ללא (קנטריפ)";
  const pact = c.classId === "warlock" || (c.multiclass ?? []).some(m => m.classId === "warlock");
  if (pact) return `Pact Slot רמה ${spell.level}+`;
  return `Spell Slot רמה ${spell.level}+`;
}

/**
 * Merge spell data + attack metadata + the player's manual quick-edit overrides
 * into one row used by both the character sheet and the PDF.
 */
export function resolveSpellAttackRow(
  c: Character,
  spell: Spell,
  opts: { spellAttackBonus?: number; spellSaveDc?: number },
): SpellAttackRow {
  const meta = getSpellAttackMeta(spell);
  const ov = c.spellAttackOverrides?.[spell.id] ?? {};
  const kind = !meta ? "אפקט" : meta.attackType === "save" ? "Save" : meta.attackType === "melee_spell" ? "מגע" : "טווח";
  const defaultBonus = !meta
    ? "—"
    : meta.attackType === "save"
      ? `DC ${opts.spellSaveDc ?? "-"}${meta.saveAbility ? ` (${String(meta.saveAbility).toUpperCase()})` : ""}`
      : formatMod(opts.spellAttackBonus ?? 0);

  return {
    id: spell.id,
    name: spell.name,
    kind,
    range: ov.range || spell.range,
    area: ov.area || meta?.area || "יעד יחיד",
    bonusOrDc: ov.bonus || defaultBonus,
    damageDice: ov.damageDice || meta?.damageDice || "—",
    damageType: ov.damageType || meta?.damageType || "—",
    saveEffect: ov.saveEffect || (meta?.attackType === "save" ? (meta.saveEffect ?? "—") : "—"),
    higherLevel: ov.higherLevel || meta?.higherLevel || "—",
    resource: ov.resource || defaultSpellResource(c, spell),
    notes: ov.notes ?? "",
    overridden: Object.values(ov).some(v => v !== undefined && v !== ""),
  };
}
