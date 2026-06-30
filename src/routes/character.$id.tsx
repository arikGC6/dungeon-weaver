import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCharacters, useHydrateCharacters } from "@/lib/character-store";
import { calculateCharacter, getRace, getClass, getFeat, getItem, getSpell, getBackground } from "@/lib/calculations";
import { ABILITIES, ABILITY_SHORT, SKILL_LIST, formatMod } from "@/lib/dnd-types";
import { exportCharacterJson, exportCharacterPdf } from "@/lib/export-pdf";
import { SCHOOL_LABELS_HE } from "@/data/spells";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/character/$id")({
  component: CharacterPage,
});

function CharacterPage() {
  const { id } = Route.useParams();
  const hydrated = useHydrateCharacters();
  const { getCharacter, saveCharacter, deleteCharacter } = useCharacters();
  const c = getCharacter(id);
  const navigate = useNavigate();

  if (!hydrated) {
    return <div className="text-center py-20 text-muted-foreground"><div className="text-5xl mb-2 animate-pulse">🕯️</div>טוען דמות…</div>;
  }

  if (!c) {
    return (
      <div className="text-center py-20">
        <p>הדמות לא נמצאה.</p>
        <Link to="/" className="text-primary underline">חזרה לבר</Link>
      </div>
    );
  }

  const d = calculateCharacter(c);
  const race = getRace(c.raceId);
  const subrace = race?.subraces?.find(s => s.id === c.subraceId);
  const cls = getClass(c.classId);
  const sub = cls?.subclasses.find(s => s.id === c.subclassId);
  const bg = getBackground(c.backgroundId);

  const allSpellIds = Array.from(new Set([...c.spellIds, ...d.alwaysPreparedSpellIds]));
  const spells = allSpellIds.map(id => getSpell(id)).filter(Boolean) as ReturnType<typeof getSpell>[];
  spells.sort((a, b) => (a!.level - b!.level) || a!.name.localeCompare(b!.name));

  const [editing, setEditing] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← בר</Link>
        <h1 className="display text-3xl text-primary flex-1">{c.name || "ללא שם"}</h1>
        <button onClick={() => exportCharacterPdf(c)} className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm hover:opacity-90">📄 PDF</button>
        <button onClick={() => exportCharacterJson(c)} className="px-3 py-1.5 rounded bg-secondary text-sm hover:bg-accent">💾 JSON</button>
        <Link to="/builder" search={{ edit: c.id }} className="px-3 py-1.5 rounded bg-accent text-accent-foreground text-sm hover:opacity-90">🪄 ערוך באשף</Link>
        <button onClick={() => setEditing(e => !e)} className="px-3 py-1.5 rounded bg-secondary text-sm hover:bg-accent">{editing ? "סיים עריכה" : "✏️ עריכה מהירה"}</button>
        <button onClick={() => { if (confirm("למחוק?")) { deleteCharacter(c.id); navigate({ to: "/" }); } }} className="px-3 py-1.5 rounded bg-destructive/70 text-destructive-foreground text-sm hover:bg-destructive">מחק</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Identity */}
        <div className="tavern-card p-4 md:col-span-1 text-center">
          {c.portrait ? (
            <img src={c.portrait} alt={c.name} className="w-40 h-40 mx-auto rounded-md object-cover border-2 border-primary" />
          ) : (
            <div className="w-40 h-40 mx-auto rounded-md bg-secondary border-2 border-border flex items-center justify-center text-6xl">🧙</div>
          )}
          <h2 className="display text-2xl text-primary mt-3">{c.name}</h2>
          <p className="text-sm text-muted-foreground">{race?.nameHe}{subrace ? ` · ${subrace.nameHe}` : ""}</p>
          <p className="text-sm text-muted-foreground">{cls?.nameHe}{sub ? ` (${sub.nameHe})` : ""} · רמה {c.level}</p>
          {bg && <p className="text-xs text-muted-foreground mt-1">{bg.nameHe}</p>}
          {c.alignment && <p className="text-xs text-accent mt-1">{c.alignment}</p>}
        </div>

        {/* Core stats */}
        <div className="tavern-card p-4 md:col-span-2">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <Stat label="AC" v={d.ac} />
            <Stat label="HP" v={d.hpMax} />
            <Stat label="יוזמה" v={formatMod(d.initiative)} />
            <Stat label="מהירות" v={d.speed + "'"} />
            <Stat label="בקיאות" v={formatMod(d.proficiencyBonus)} />
            <Stat label="תפיסה פסיבית" v={d.passivePerception} />
            <Stat label="תובנה פסיבית" v={d.passiveInsight} />
            <Stat label="חקירה פסיבית" v={d.passiveInvestigation} />
          </div>
          <div className="mt-3 p-2 rounded bg-background/40 border border-border text-sm">
            🚶 <b>הליכה:</b> {d.walking.ftPerTurn}ft/תור · {d.walking.ftPerMin}ft/דקה · ~{d.walking.kmPerHour} ק״מ/שעה
          </div>
        </div>

        {/* Abilities */}
        <div className="tavern-card p-4 md:col-span-3">
          <h3 className="display text-lg text-primary mb-2">יכולות</h3>
          <div className="grid grid-cols-6 gap-2">
            {ABILITIES.map(a => (
              <div key={a} className="p-2 rounded bg-background/40 border border-border text-center">
                <div className="display text-xs text-primary">{ABILITY_SHORT[a]}</div>
                <div className="text-2xl font-bold">{formatMod(d.abilityMods[a])}</div>
                <div className="text-xs text-muted-foreground">{d.abilities[a]}</div>
                <div className="text-[10px] text-muted-foreground mt-1">save {formatMod(d.saves[a])}{d.saveProfs[a] && " ●"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="tavern-card p-4 md:col-span-2">
          <h3 className="display text-lg text-primary mb-2">מיומנויות</h3>
          <div className="grid sm:grid-cols-2 gap-x-6 text-sm">
            {SKILL_LIST.map(s => (
              <div key={s.id} className="flex justify-between border-b border-border/50 py-1">
                <span>
                  {d.skillProfs[s.id] === "exp" ? "◉" : d.skillProfs[s.id] === "prof" ? "●" : "○"} {s.label}
                  <span className="text-xs text-muted-foreground"> ({ABILITY_SHORT[s.ability]})</span>
                </span>
                <span className="font-mono">{formatMod(d.skills[s.id])}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spellcasting */}
        <div className="tavern-card p-4 md:col-span-1">
          <h3 className="display text-lg text-primary mb-2">קסם</h3>
          {d.spellSaveDc !== undefined ? (
            <>
              <div className="text-sm mb-2">
                <div><b>יכולת:</b> {ABILITY_SHORT[d.spellcastingAbility!]}</div>
                <div><b>DC:</b> {d.spellSaveDc}</div>
                <div><b>+התקפה:</b> {formatMod(d.spellAttackBonus!)}</div>
              </div>
              {d.spellSlots.type !== "none" && (
                <>
                  <div className="display text-sm text-accent mt-2">Spell Slots</div>
                  <div className="grid grid-cols-2 gap-1 text-xs mt-1">
                    {d.spellSlots.slots.map(s => (
                      <div key={s.level} className="p-1.5 rounded bg-background/40 border border-border text-center">
                        <div className="display text-[10px] text-primary">{d.spellSlots.type === "pact" ? `כולם רמה ${s.level}` : `רמה ${s.level}`}</div>
                        <div className="text-accent text-base">{"●".repeat(s.count)}</div>
                      </div>
                    ))}
                  </div>
                  {d.spellSlots.notes && <p className="text-[10px] text-muted-foreground mt-1">{d.spellSlots.notes}</p>}
                </>
              )}
            </>
          ) : <p className="text-sm text-muted-foreground">לא מטיל קסמים</p>}
        </div>

        {/* Feats */}
        {c.featIds.length > 0 && (
          <div className="tavern-card p-4 md:col-span-3">
            <h3 className="display text-lg text-primary mb-2">Feats / Fates</h3>
            <ul className="space-y-2 text-sm">
              {c.featIds.map(id => {
                const f = getFeat(id);
                return f && <li key={id}><b className="text-primary">{f.nameHe}:</b> {f.description}</li>;
              })}
            </ul>
          </div>
        )}

        {/* Race & class traits */}
        <div className="tavern-card p-4 md:col-span-3">
          <h3 className="display text-lg text-primary mb-2">תכונות</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {race && (
              <div>
                <div className="display text-accent mb-1">גזע — {race.nameHe}</div>
                <ul className="space-y-1">
                  {race.traits.concat(subrace?.traits ?? []).map(t => <li key={t.name}><b>{t.name}:</b> {t.desc}</li>)}
                </ul>
              </div>
            )}
            {cls && (
              <div>
                <div className="display text-accent mb-1">קלאס — {cls.nameHe}</div>
                <ul className="space-y-1">
                  {cls.features.filter(f => f.level <= c.level).map(f => <li key={f.name}><b>רמה {f.level} — {f.name}:</b> {f.desc}</li>)}
                  {sub?.features.filter(f => f.level <= c.level).map(f => <li key={f.name}><b>{sub.nameHe} — {f.name}:</b> {f.desc}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Custom Attacks */}
        {c.attacks && c.attacks.length > 0 && (
          <div className="tavern-card p-4 md:col-span-3">
            <h3 className="display text-lg text-primary mb-2">⚔️ התקפות</h3>
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr><th className="text-right">שם</th><th>בונוס</th><th>נזק</th><th className="text-right">הערות</th></tr>
              </thead>
              <tbody>
                {c.attacks.map((a, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td className="py-1 font-semibold">{a.name}</td>
                    <td className="text-center">{a.bonus}</td>
                    <td className="text-center">{a.damage}</td>
                    <td className="text-muted-foreground">{a.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Items */}
        {c.itemIds.length > 0 && (
          <div className="tavern-card p-4 md:col-span-3">
            <h3 className="display text-lg text-primary mb-2">פריטים</h3>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              {c.itemIds.map(({ id, equipped, quantity }) => {
                const item = getItem(id);
                if (!item) return null;
                return (
                  <div key={id} className={`p-2 rounded border ${equipped ? "bg-primary/10 border-primary" : "border-border"}`}>
                    <div className="flex justify-between">
                      <b>{item.nameHe ?? item.name}{quantity && quantity > 1 ? ` ×${quantity}` : ""}</b>
                      <span className="text-xs">{equipped ? "חמוש" : "בתיק"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Equipment (free) */}
        {c.equipment && c.equipment.length > 0 && (
          <div className="tavern-card p-4 md:col-span-3">
            <h3 className="display text-lg text-primary mb-2">📦 ציוד נוסף</h3>
            <ul className="grid sm:grid-cols-2 gap-x-6 text-sm">
              {c.equipment.map((eq, i) => (
                <li key={i} className="flex justify-between border-b border-border/40 py-1">
                  <span>{eq.name} {eq.quantity > 1 && <span className="text-muted-foreground">×{eq.quantity}</span>}</span>
                  {eq.notes && <span className="text-xs text-muted-foreground">{eq.notes}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Spells */}
        {spells.length > 0 && (
          <div className="tavern-card p-4 md:col-span-3">
            <h3 className="display text-lg text-primary mb-2">ספר הכישופים ({spells.length})</h3>
            <div className="space-y-2 text-sm">
              {spells.map(s => (
                <div key={s!.id} className="p-2 rounded bg-background/30 border border-border">
                  <div className="flex justify-between flex-wrap gap-2">
                    <b className="text-primary">
                      {c.preparedSpellIds.includes(s!.id) || d.alwaysPreparedSpellIds.includes(s!.id) ? "✦ " : "○ "}
                      {s!.name}
                    </b>
                    <span className="text-xs text-muted-foreground">
                      {s!.level === 0 ? "קנטריפ" : `רמה ${s!.level}`} · {SCHOOL_LABELS_HE[s!.school]}
                      {s!.concentration && " · ריכוז"}{s!.ritual && " · טקס"}
                      {d.alwaysPreparedSpellIds.includes(s!.id) && " · 🎁 מוענק מתת-קלאס"}
                      {c.preparedSpellIds.includes(s!.id) && " · מוכן"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{s!.castingTime} · {s!.range} · {s!.components} · {s!.duration}</div>
                  <div className="text-sm mt-1">{s!.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {c.notes && (
          <div className="tavern-card p-4 md:col-span-3">
            <h3 className="display text-lg text-primary mb-2">הערות</h3>
            <p className="text-sm whitespace-pre-wrap">{c.notes}</p>
          </div>
        )}

        {editing && (
          <div className="tavern-card p-4 md:col-span-3">
            <QuickEdit c={c} onSave={(patched) => saveCharacter(patched)} />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: string | number }) {
  return (
    <div className="p-2 rounded bg-background/40 border border-border text-center">
      <div className="display text-xs text-primary">{label}</div>
      <div className="text-2xl font-bold">{v}</div>
    </div>
  );
}

function QuickEdit({ c, onSave }: { c: any; onSave: (c: any) => void }) {
  const [local, setLocal] = useState(c);
  return (
    <div className="space-y-3">
      <h3 className="display text-lg text-primary">עריכה מהירה</h3>
      <p className="text-xs text-muted-foreground">לעריכה מלאה (כישופים/פריטים/feats) — שכפל ועבור באשף.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <label className="text-sm">שם<input className="input w-full" value={local.name} onChange={e => setLocal({ ...local, name: e.target.value })} /></label>
        <label className="text-sm">רמה<input type="number" className="input w-full" value={local.level} onChange={e => setLocal({ ...local, level: +e.target.value })} /></label>
        <label className="text-sm">HP מקס (דריסה)<input type="number" className="input w-full" value={local.hpMax ?? ""} onChange={e => setLocal({ ...local, hpMax: e.target.value === "" ? undefined : +e.target.value })} /></label>
        <label className="text-sm">AC (דריסה)<input type="number" className="input w-full" value={local.acOverride ?? ""} onChange={e => setLocal({ ...local, acOverride: e.target.value === "" ? undefined : +e.target.value })} /></label>
        <label className="text-sm">מהירות (דריסה)<input type="number" className="input w-full" value={local.speedOverride ?? ""} onChange={e => setLocal({ ...local, speedOverride: e.target.value === "" ? undefined : +e.target.value })} /></label>
      </div>
      <textarea className="input w-full min-h-[80px]" value={local.notes ?? ""} onChange={e => setLocal({ ...local, notes: e.target.value })} placeholder="הערות..." />
      <button onClick={() => onSave(local)} className="px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90">שמור</button>
    </div>
  );
}
