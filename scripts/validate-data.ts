// Validate D&D data integrity: every grantedSpells id must exist in SPELLS.
// Run: bun scripts/validate-data.ts
import { CLASSES } from "../src/data/classes";
import { SPELLS } from "../src/data/spells";

const spellIds = new Set(SPELLS.map(s => s.id));
const errors: string[] = [];

for (const cls of CLASSES) {
  for (const sub of cls.subclasses) {
    for (const g of sub.grantedSpells ?? []) {
      for (const id of g.spellIds) {
        if (!spellIds.has(id)) {
          errors.push(`[${cls.id}/${sub.id} lvl ${g.level}] missing spell: ${id}`);
        }
      }
    }
  }
}

if (errors.length) {
  console.error("Data validation FAILED:");
  errors.forEach(e => console.error(" - " + e));
  process.exit(1);
} else {
  console.log(`OK — ${SPELLS.length} spells, ${CLASSES.length} classes; all grantedSpells references resolve.`);
}
