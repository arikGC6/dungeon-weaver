import type { Character } from "./dnd-types";
import { ABILITY_SHORT, ABILITY_LABELS, SKILL_LIST, formatMod } from "./dnd-types";
import { calculateCharacter, getRace, getClass, getFeat, getItem, getSpell, getBackground } from "./calculations";
import { SCHOOL_LABELS_HE } from "../data/spells";

// Render an HTML-based character sheet in a new window and trigger print → user saves as PDF.
// Perfect Hebrew + RTL support, fancy fantasy styling, and matches the on-screen sheet.
export function exportCharacterPdf(c: Character) {
  const d = calculateCharacter(c);
  const race = getRace(c.raceId);
  const subrace = race?.subraces?.find(s => s.id === c.subraceId);
  const cls = getClass(c.classId);
  const sub = cls?.subclasses.find(s => s.id === c.subclassId);
  const bg = getBackground(c.backgroundId);

  const knownSpells = Array.from(new Set([...c.spellIds, ...d.alwaysPreparedSpellIds]))
    .map(id => getSpell(id)).filter(Boolean) as ReturnType<typeof getSpell>[];
  knownSpells.sort((a, b) => (a!.level - b!.level) || a!.name.localeCompare(b!.name));

  const items = c.itemIds.map(({ id, equipped }) => ({ item: getItem(id), equipped })).filter(x => x.item);
  const feats = c.featIds.map(id => getFeat(id)).filter(Boolean);

  const slotsHtml = d.spellSlots.type === "none" ? "" :
    `<div class="slots">${d.spellSlots.slots.map(s => `<div class="slot"><div class="slot-lvl">${d.spellSlots.type === "pact" ? `כל הסלוטים ברמה ${s.level}` : `רמה ${s.level}`}</div><div class="slot-count">${"●".repeat(s.count)}</div></div>`).join("")}${d.spellSlots.notes ? `<div class="slot-note">${d.spellSlots.notes}</div>` : ""}</div>`;

  const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<title>${c.name || "דמות"} — גיליון דמות</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Frank+Ruhl+Libre:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Frank Ruhl Libre", serif;
    color: #2a1d10;
    background: #f6ecd5;
    margin: 0; padding: 24px;
    direction: rtl;
  }
  h1, h2, h3 { font-family: "Cinzel", serif; margin: 0; }
  h1 { font-size: 32px; color: #5b2a13; letter-spacing: 0.04em; }
  h2 { font-size: 18px; color: #5b2a13; border-bottom: 2px solid #b88a3a; padding-bottom: 4px; margin-bottom: 8px; margin-top: 18px; }
  .sheet {
    max-width: 900px; margin: 0 auto;
    background: linear-gradient(180deg, #fbf2dc, #ecdcb4);
    border: 2px solid #8a5a2b; border-radius: 8px;
    padding: 24px;
    box-shadow: 0 4px 24px rgba(0,0,0,.2);
  }
  .head { display: flex; gap: 16px; align-items: flex-start; }
  .portrait { width: 110px; height: 110px; border-radius: 8px; object-fit: cover; border: 2px solid #8a5a2b; background:#ddc89a; }
  .meta { flex: 1; }
  .meta-row { display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: 13px; color: #4a2f17; margin-top: 4px; }
  .meta-row b { color: #2a1d10; }
  .grid { display: grid; gap: 12px; }
  .abilities { grid-template-columns: repeat(6, 1fr); }
  .ab {
    background: #fbf2dc; border: 1.5px solid #8a5a2b; border-radius: 6px;
    text-align: center; padding: 8px 4px;
  }
  .ab .label { font-family: "Cinzel", serif; font-size: 11px; color: #5b2a13; }
  .ab .mod { font-size: 22px; font-weight: 700; }
  .ab .val { font-size: 12px; color: #5b3010; }
  .stats { grid-template-columns: repeat(4, 1fr); }
  .stat { background: #fbf2dc; border: 1.5px solid #8a5a2b; border-radius: 6px; padding: 8px; text-align:center; }
  .stat .label { font-family: "Cinzel", serif; font-size: 11px; color: #5b2a13; }
  .stat .v { font-size: 22px; font-weight: 700; }
  .saves, .skills { grid-template-columns: 1fr 1fr; gap: 4px 16px; }
  .skill-row, .save-row { display: flex; justify-content: space-between; padding: 2px 6px; border-bottom: 1px dashed #b88a3a; font-size: 13px; }
  .skill-row .b, .save-row .b { font-family: "Cinzel", serif; font-size: 12px; }
  .prof { width: 10px; height: 10px; display:inline-block; border:1.5px solid #5b2a13; border-radius: 50%; vertical-align: middle; margin-left: 6px; }
  .prof.on { background: #5b2a13; }
  .prof.exp { background: #5b2a13; box-shadow: 0 0 0 2px #fbf2dc, 0 0 0 4px #5b2a13; }
  .features { font-size: 13px; line-height: 1.5; }
  .features li { margin-bottom: 4px; }
  .spells { font-size: 12px; }
  .spell { padding: 6px 0; border-bottom: 1px dashed #b88a3a; }
  .spell .name { font-weight: 700; font-family:"Cinzel", serif; }
  .spell .meta { color: #5b3010; font-size: 11px; }
  .spell .desc { margin-top: 2px; }
  .slots { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .slot { background:#fbf2dc; border:1.5px solid #8a5a2b; border-radius:6px; padding:4px 10px; font-size: 12px; }
  .slot-lvl { font-family:"Cinzel",serif; font-size:10px; color:#5b2a13; }
  .slot-count { font-size:16px; letter-spacing: 2px; color:#7b2e0e; }
  .slot-note { font-size: 11px; font-style: italic; color: #5b3010; width: 100%; }
  .pill { display:inline-block; background:#5b2a13; color:#fbf2dc; padding: 2px 8px; border-radius: 99px; font-size:11px; margin: 0 2px 4px 0; }
  .item-row { display:flex; justify-content: space-between; font-size:13px; padding:3px 6px; border-bottom:1px dashed #b88a3a; }
  .walk { background: #fbf2dc; border: 1.5px solid #8a5a2b; padding: 8px 12px; border-radius:6px; font-size: 13px; }
  .controls { text-align: center; margin-top: 20px; }
  .controls button { font-family: "Cinzel", serif; padding: 8px 24px; background:#5b2a13; color:#fbf2dc; border:none; border-radius:6px; cursor:pointer; font-size:14px; }
  @media print { .controls { display: none; } body { background: white; padding: 0; } .sheet { box-shadow: none; border: none; } }
</style>
</head>
<body>
<div class="sheet">
  <div class="head">
    ${c.portrait ? `<img class="portrait" src="${c.portrait}" alt="portrait"/>` : `<div class="portrait"></div>`}
    <div class="meta">
      <h1>${c.name || "ללא שם"}</h1>
      <div class="meta-row">
        <span><b>קלאס:</b> ${cls?.nameHe ?? "—"}${sub ? ` (${sub.nameHe})` : ""}</span>
        <span><b>רמה:</b> ${c.level}</span>
        <span><b>גזע:</b> ${race?.nameHe ?? "—"}${subrace ? ` (${subrace.nameHe})` : ""}</span>
        <span><b>רקע:</b> ${bg?.nameHe ?? "—"}</span>
        <span><b>מערך:</b> ${c.alignment ?? "—"}</span>
        <span><b>שחקן:</b> ${c.player ?? "—"}</span>
      </div>
    </div>
  </div>

  <h2>יכולות</h2>
  <div class="grid abilities">
    ${(["str","dex","con","int","wis","cha"] as const).map(a => `
      <div class="ab">
        <div class="label">${ABILITY_SHORT[a]}</div>
        <div class="mod">${formatMod(d.abilityMods[a])}</div>
        <div class="val">${d.abilities[a]}</div>
      </div>
    `).join("")}
  </div>

  <h2>סטטיסטיקות עיקריות</h2>
  <div class="grid stats">
    <div class="stat"><div class="label">AC</div><div class="v">${d.ac}</div></div>
    <div class="stat"><div class="label">HP מקס'</div><div class="v">${d.hpMax}</div></div>
    <div class="stat"><div class="label">יוזמה</div><div class="v">${formatMod(d.initiative)}</div></div>
    <div class="stat"><div class="label">בונוס בקיאות</div><div class="v">${formatMod(d.proficiencyBonus)}</div></div>
    <div class="stat"><div class="label">תפיסה פסיבית</div><div class="v">${d.passivePerception}</div></div>
    <div class="stat"><div class="label">חקירה פסיבית</div><div class="v">${d.passiveInvestigation}</div></div>
    <div class="stat"><div class="label">תובנה פסיבית</div><div class="v">${d.passiveInsight}</div></div>
    <div class="stat"><div class="label">מהירות</div><div class="v">${d.speed}'</div></div>
  </div>

  <h2>הליכה ותנועה</h2>
  <div class="walk">
    בכל תור: <b>${d.walking.ftPerTurn} ft</b> · בדקה: <b>${d.walking.ftPerMin} ft</b> · משוער שעת הליכה: <b>${d.walking.kmPerHour} ק״מ/שעה</b>
  </div>

  <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <div>
      <h2>זריקות הצלה</h2>
      <div class="grid saves">
        ${(["str","dex","con","int","wis","cha"] as const).map(a => `
          <div class="save-row"><span class="b">${ABILITY_LABELS[a]} <span class="prof ${d.saveProfs[a] ? "on" : ""}"></span></span><span>${formatMod(d.saves[a])}</span></div>
        `).join("")}
      </div>
    </div>
    <div>
      <h2>מיומנויות</h2>
      <div class="grid skills">
        ${SKILL_LIST.map(s => `
          <div class="skill-row">
            <span class="b">${s.label} <span class="prof ${d.skillProfs[s.id] === "exp" ? "exp" : d.skillProfs[s.id] === "prof" ? "on" : ""}"></span><span style="color:#7b5a3a;font-size:10px"> (${ABILITY_SHORT[s.ability]})</span></span>
            <span>${formatMod(d.skills[s.id])}</span>
          </div>
        `).join("")}
      </div>
    </div>
  </div>

  ${d.spellSaveDc !== undefined ? `
    <h2>קסם</h2>
    <div class="grid stats" style="grid-template-columns: repeat(3, 1fr)">
      <div class="stat"><div class="label">יכולת לקסם</div><div class="v">${ABILITY_SHORT[d.spellcastingAbility!]}</div></div>
      <div class="stat"><div class="label">DC להצלה</div><div class="v">${d.spellSaveDc}</div></div>
      <div class="stat"><div class="label">בונוס התקפה</div><div class="v">${formatMod(d.spellAttackBonus!)}</div></div>
    </div>
    ${slotsHtml}
  ` : ""}

  ${feats.length ? `<h2>Feats / Fates</h2><ul class="features">${feats.map(f => `<li><b>${f!.nameHe} (${f!.name}):</b> ${f!.description}</li>`).join("")}</ul>` : ""}

  ${race ? `<h2>תכונות גזע</h2><ul class="features">${race.traits.concat(subrace?.traits ?? []).map(t => `<li><b>${t.name}:</b> ${t.desc}</li>`).join("")}</ul>` : ""}

  ${cls ? `<h2>תכונות קלאס</h2><ul class="features">${cls.features.filter(f => f.level <= c.level).map(f => `<li><b>רמה ${f.level} — ${f.name}:</b> ${f.desc}</li>`).join("")}${sub ? sub.features.filter(f => f.level <= c.level).map(f => `<li><b>תת-קלאס (${sub.nameHe}) — ${f.name}:</b> ${f.desc}</li>`).join("") : ""}</ul>` : ""}

  ${items.length ? `<h2>פריטים</h2>${items.map(({ item, equipped }) => {
    const ci = c.itemIds.find(x => x.id === item!.id);
    const qty = ci?.quantity && ci.quantity > 1 ? ` ×${ci.quantity}` : "";
    return `<div class="item-row"><span><b>${item!.nameHe ?? item!.name}${qty}</b> <span style="color:#7b5a3a;font-size:11px">${item!.name}</span> ${equipped ? '<span class="pill">חמוש</span>' : ''}</span><span style="color:#5b3010;font-size:11px">${item!.description}</span></div>`;
  }).join("")}` : ""}

  ${c.equipment && c.equipment.length ? `<h2>📦 ציוד נוסף</h2>${c.equipment.map(eq => `<div class="item-row"><span><b>${eq.name}</b>${eq.quantity > 1 ? ` <span style="color:#7b5a3a">×${eq.quantity}</span>` : ""}</span><span style="color:#5b3010;font-size:11px">${eq.notes ?? ""}</span></div>`).join("")}` : ""}

  ${c.attacks && c.attacks.length ? `<h2>⚔️ מתקפות נשק</h2><table style="width:100%;font-size:13px;border-collapse:collapse">
    <thead><tr style="background:#e9d5a5"><th style="text-align:right;padding:4px 8px">שם</th><th style="padding:4px 8px">תיוג</th><th style="padding:4px 8px">בונוס</th><th style="padding:4px 8px">נזק</th><th style="text-align:right;padding:4px 8px">הערות</th></tr></thead>
    <tbody>${c.attacks.map(a => `<tr style="border-bottom:1px dashed #b88a3a"><td style="padding:4px 8px"><b>${a.name}</b></td><td style="text-align:center;font-size:11px">🗡 נשק · ${pdfReach(a)}</td><td style="text-align:center">${a.bonus}</td><td style="text-align:center">${a.damage}</td><td style="color:#5b3010">${a.notes ?? ""}</td></tr>`).join("")}</tbody>
  </table>` : ""}

  ${spellAttacks.length ? `<h2>✨ כישופים כמתקפות</h2><table style="width:100%;font-size:12px;border-collapse:collapse">
    <thead><tr style="background:#e9d5a5">
      <th style="text-align:right;padding:4px 6px">כישוף</th><th style="padding:4px 6px">תיוג</th><th style="padding:4px 6px">טווח</th><th style="padding:4px 6px">אזור</th><th style="padding:4px 6px">בונוס/DC</th><th style="padding:4px 6px">נזק</th><th style="padding:4px 6px">סוג נזק</th><th style="padding:4px 6px">Save</th><th style="padding:4px 6px">שדרוג</th>
    </tr></thead>
    <tbody>${spellAttacks.map(s => {
      const meta = getSpellAttackMeta(s!);
      const kind = !meta ? "אפקט" : meta.attackType === "save" ? "Save" : meta.attackType === "melee_spell" ? "מגע" : "טווח";
      const bonusOrDc = meta?.attackType === "save"
        ? `DC ${d.spellSaveDc ?? "-"}${meta.saveAbility ? ` (${String(meta.saveAbility).toUpperCase()})` : ""}`
        : (meta ? formatMod(d.spellAttackBonus ?? 0) : "—");
      return `<tr style="border-bottom:1px dashed #b88a3a">
        <td style="padding:4px 6px"><b>${s!.name}</b><div style="font-size:10px;color:#5b3010">${s!.castingTime} · ${s!.duration} · ${s!.components}</div><div style="font-size:11px">${getSpellFlavor(s!.id) ?? s!.description}</div></td>
        <td style="text-align:center;font-size:11px">✨ כישוף · ${kind}</td>
        <td style="text-align:center">${s!.range}</td>
        <td style="text-align:center">${meta?.area ?? "יעד יחיד"}</td>
        <td style="text-align:center">${bonusOrDc}</td>
        <td style="text-align:center">${meta?.damageDice ?? "—"}</td>
        <td style="text-align:center">${meta?.damageType ?? "—"}</td>
        <td style="text-align:center;font-size:11px">${meta?.attackType === "save" ? (meta.saveEffect ?? "—") : "—"}</td>
        <td style="text-align:center;font-size:11px">${meta?.higherLevel ?? "—"}</td>
      </tr>`;
    }).join("")}</tbody>
  </table>` : ""}

  ${knownSpells.length ? `<h2>כישופים</h2>${knownSpells.map(s => {
    const isPrep = c.preparedSpellIds.includes(s!.id) || d.alwaysPreparedSpellIds.includes(s!.id);
    const flavor = getSpellFlavor(s!.id);
    return `<div class="spell">
      <div class="name">${isPrep ? "✦ " : "○ "}${s!.name} <span class="meta">— רמה ${s!.level === 0 ? "קנטריפ" : s!.level} · ${SCHOOL_LABELS_HE[s!.school]} · ${s!.castingTime} · ${s!.range} · ${s!.components} · ${s!.duration}${s!.concentration ? " · ריכוז" : ""}${s!.ritual ? " · טקס" : ""}${isPrep ? " · <b>מוכן</b>" : ""}</span></div>
      ${flavor ? `<div class="desc" style="font-style:italic;color:#5b2a13">🪄 ${flavor}</div>` : ""}
      <div class="desc">${s!.description}</div>
    </div>`;
  }).join("")}` : ""}


  ${c.notes ? `<h2>הערות</h2><div style="white-space: pre-wrap; font-size:13px;">${c.notes}</div>` : ""}
</div>
<div class="controls"><button onclick="window.print()">💾 שמור כ-PDF / הדפס</button></div>
<script>setTimeout(() => window.print(), 600);</script>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) {
    alert("נחסם — אנא אפשר חלונות קופצים והפעל שוב.");
    return;
  }
  w.document.write(html);
  w.document.close();
}

export function exportCharacterJson(c: Character) {
  const blob = new Blob([JSON.stringify(c, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(c.name || "character").replace(/\s+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importCharacterJson(file: File): Promise<Character> {
  const txt = await file.text();
  const data = JSON.parse(txt);
  if (!data || typeof data !== "object" || !data.baseAbilities) throw new Error("קובץ לא תקין");
  // Regenerate id to avoid overwrites
  data.id = data.id || crypto.randomUUID();
  data.updatedAt = Date.now();
  return data as Character;
}
