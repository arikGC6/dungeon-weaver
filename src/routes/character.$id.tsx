import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCharacters, useHydrateCharacters } from "@/lib/character-store";
import { calculateCharacter, getRace, getClass, getFeat, getItem, getSpell, getBackground } from "@/lib/calculations";
import { ABILITIES, ABILITY_LABELS, ABILITY_SHORT, SKILL_LIST, formatMod, type Ability } from "@/lib/dnd-types";
import { exportCharacterJson, exportCharacterPdf } from "@/lib/export-pdf";
import { SCHOOL_LABELS_HE, SPELL_SCHOOLS, SPELLS } from "@/data/spells";
import { getSummonsForSpell } from "@/data/summons";
import { getSpellAttackMeta } from "@/data/spell-attacks";
import { getSpellFlavor } from "@/data/spell-flavor";
import { getPactBoon, INVOCATIONS } from "@/data/warlock";
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
          {c.multiclass && c.multiclass.length > 0 && (
            <p className="text-xs text-accent">
              + {c.multiclass.map(mc => {
                const mcCls = getClass(mc.classId);
                const mcSub = mcCls?.subclasses.find(s => s.id === mc.subclassId);
                return `${mcCls?.nameHe ?? mc.classId}${mcSub ? ` (${mcSub.nameHe})` : ""} ${mc.level}`;
              }).join(" · ")}
            </p>
          )}
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

        {/* Class Resources */}
        {d.classResources.length > 0 && (
          <div className="tavern-card p-4 md:col-span-3">
            <h3 className="display text-lg text-primary mb-2">⚡ משאבי קלאס</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {d.classResources.map((r, i) => (
                <div key={i} className="p-3 rounded bg-background/40 border border-border">
                  <div className="flex justify-between items-baseline">
                    <b className="text-primary">{r.name}</b>
                    <span className="text-lg font-mono text-accent">{r.value}</span>
                  </div>
                  {r.className && <div className="text-[10px] text-muted-foreground">{r.className}</div>}
                  <div className="text-[11px] text-muted-foreground">מתחדש: {r.recharge}</div>
                  {r.desc && <div className="text-xs mt-1">{r.desc}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action economy */}
        <div className="tavern-card p-4 md:col-span-2">
          <h3 className="display text-lg text-primary mb-2">🎬 כלכלת פעולות</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-sm mb-2">
            <div className="p-2 rounded bg-background/40 border border-border"><div className="display text-xs text-primary">Action</div><div className="text-2xl font-bold">{d.actionEconomy.actions}</div></div>
            <div className="p-2 rounded bg-background/40 border border-border"><div className="display text-xs text-primary">Bonus</div><div className="text-2xl font-bold">{d.actionEconomy.bonusActions}</div></div>
            <div className="p-2 rounded bg-background/40 border border-border"><div className="display text-xs text-primary">Reaction</div><div className="text-2xl font-bold">{d.actionEconomy.reactions}</div></div>
          </div>
          {d.actionEconomy.extras.length > 0 && (
            <ul className="text-xs space-y-0.5">
              {d.actionEconomy.extras.map((x, i) => <li key={i}>• {x}</li>)}
            </ul>
          )}
        </div>

        {/* ASI availability */}
        <div className="tavern-card p-4 md:col-span-1">
          <h3 className="display text-lg text-primary mb-2">🎯 חיזוקי יכולת (ASI)</h3>
          <div className="text-sm">
            <div>סה״כ שהושגו: <b className="text-accent">{d.asi.total}</b></div>
            <div>בשימוש (Feats): <b>{d.asi.used}</b></div>
            <div>נותרו לחלוקה: <b className="text-accent">{d.asi.remaining}</b></div>
            {d.asi.nextAt && <div className="text-xs text-muted-foreground mt-1">הבא ברמה {d.asi.nextAt}</div>}
            <div className="text-[11px] text-muted-foreground mt-1">רמות ASI לקלאס: {d.asi.levels.join(", ")}</div>
          </div>
        </div>


        {/* Auto feats (granted by class/subclass) */}
        {d.autoFeats.length > 0 && (
          <div className="tavern-card p-4 md:col-span-3">
            <h3 className="display text-lg text-primary mb-2">🎁 יכולות אוטומטיות (מקלאס/תת-קלאס)</h3>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {d.autoFeats.map(f => (
                <li key={f.id} className="p-2 rounded bg-background/40 border border-border">
                  <div className="flex justify-between">
                    <b className="text-primary">{f.nameHe}</b>
                    <span className="text-[10px] text-accent">{f.source}</span>
                  </div>
                  <div className="text-xs mt-1">{f.description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

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
            {(c.pactBoonId || (c.invocationIds ?? []).length > 0) && (
              <div>
                <div className="display text-accent mb-1">🕯️ ברית וורלוק</div>
                <ul className="space-y-1">
                  {getPactBoon(c.pactBoonId) && (
                    <li><b>{getPactBoon(c.pactBoonId)!.nameHe} ({getPactBoon(c.pactBoonId)!.name}):</b> {getPactBoon(c.pactBoonId)!.desc}</li>
                  )}
                  {(c.invocationIds ?? []).map(id => {
                    const inv = INVOCATIONS.find(x => x.id === id);
                    return inv ? <li key={id}><b>{inv.nameHe} ({inv.name}):</b> {inv.desc}</li> : null;
                  })}
                </ul>
              </div>
            )}
            {bg && (
              <div>
                <div className="display text-accent mb-1">רקע — {bg.nameHe}</div>
                <ul className="space-y-1">
                  {bg.feature && <li><b>{bg.feature}</b></li>}
                  {bg.tools && bg.tools.length > 0 && <li><b>כלי בקיאות:</b> {bg.tools.join(", ")}</li>}

                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Weapon / physical attacks */}
        {c.attacks && c.attacks.length > 0 && (
          <WeaponAttacks attacks={c.attacks} />
        )}


        {/* Spells as Attacks */}
        <SpellAttacks
          c={c}
          onSave={saveCharacter}
          spellAttackBonus={d.spellAttackBonus}
          spellSaveDc={d.spellSaveDc}
        />

        {/* Manual ability quick-edit */}
        <ManualAbilityEditor c={c} onSave={saveCharacter} computed={d.abilities} />

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
          <SpellBook
            spells={spells as any}
            preparedIds={c.preparedSpellIds}
            grantedIds={d.alwaysPreparedSpellIds}
          />
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

function rangeCategory(range: string): "self" | "touch" | "short" | "medium" | "long" {
  const r = (range ?? "").toLowerCase();
  if (r.includes("self") || r.includes("עצמי")) return "self";
  if (r.includes("touch") || r.includes("מגע")) return "touch";
  const ft = parseInt(r.replace(/[^0-9]/g, ""), 10);
  if (!isNaN(ft)) {
    if (ft <= 30) return "short";
    if (ft <= 120) return "medium";
    return "long";
  }
  return "medium";
}
const RANGE_LABELS: Record<string, string> = {
  self: "עצמי", touch: "מגע", short: "קרוב (≤30ft)", medium: "בינוני (≤120ft)", long: "רחוק (120ft+)",
};

function castCategory(ct: string): "action" | "bonus" | "reaction" | "long" {
  const t = (ct ?? "").toLowerCase();
  if (t.includes("bonus") || t.includes("בונוס")) return "bonus";
  if (t.includes("reaction") || t.includes("תגובה")) return "reaction";
  if (t.includes("minute") || t.includes("hour") || t.includes("דקה") || t.includes("שעה")) return "long";
  return "action";
}
const CAST_LABELS: Record<string, string> = {
  action: "אקשן", bonus: "בונוס אקשן", reaction: "תגובה", long: "הטלה ארוכה",
};

function SpellBook({ spells, preparedIds, grantedIds }: {
  spells: any[]; preparedIds: string[]; grantedIds: string[];
}) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<string>("all");
  const [school, setSchool] = useState<string>("all");
  const [dmgType, setDmgType] = useState<string>("all");
  const [rangeF, setRangeF] = useState<string>("all");
  const [castF, setCastF] = useState<string>("all");
  const [conc, setConc] = useState<string>("all");
  const [saveF, setSaveF] = useState<string>("all");

  const damageTypes = useMemo(() => {
    const set = new Set<string>();
    spells.forEach(s => { const m = s && getSpellAttackMeta(s); if (m?.damageType) set.add(m.damageType); });
    return Array.from(set).sort();
  }, [spells]);

  const filtered = spells.filter(s => {
    if (!s) return false;
    const meta = getSpellAttackMeta(s);
    if (level !== "all" && String(s.level) !== level) return false;
    if (school !== "all" && s.school !== school) return false;
    if (dmgType !== "all" && meta?.damageType !== dmgType) return false;
    if (rangeF !== "all" && rangeCategory(s.range) !== rangeF) return false;
    if (castF !== "all" && castCategory(s.castingTime) !== castF) return false;
    if (conc === "yes" && !s.concentration) return false;
    if (conc === "no" && s.concentration) return false;
    if (saveF === "save" && meta?.attackType !== "save") return false;
    if (saveF === "attack" && !(meta && meta.attackType !== "save")) return false;
    if (saveF === "none" && meta) return false;
    if (q && !(`${s.name} ${s.description} ${getSpellFlavor(s.id) ?? ""}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const granted = filtered.filter(s => grantedIds.includes(s.id));
  const known = filtered.filter(s => !grantedIds.includes(s.id));
  const renderSpell = (s: any) => (
    <div key={s.id} className="p-2 rounded bg-background/30 border border-border">
      <div className="flex justify-between flex-wrap gap-2">
        <b className="text-primary">
          {preparedIds.includes(s.id) || grantedIds.includes(s.id) ? "✦ " : "○ "}
          {s.name}
        </b>
        <span className="text-xs text-muted-foreground">
          {s.level === 0 ? "קנטריפ" : `רמה ${s.level}`} · {SCHOOL_LABELS_HE[s.school]}
          {s.concentration && " · ריכוז"}{s.ritual && " · טקס"}
          {grantedIds.includes(s.id) && " · 🎁 מוענק מתת-קלאס"}
          {preparedIds.includes(s.id) && " · מוכן"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mt-1 text-[11px]">
        <div className="p-1 rounded bg-background/50 border border-border/60"><span className="text-accent">זמן הטלה:</span> {s.castingTime}</div>
        <div className="p-1 rounded bg-background/50 border border-border/60"><span className="text-accent">טווח:</span> {s.range}</div>
        <div className="p-1 rounded bg-background/50 border border-border/60"><span className="text-accent">רכיבים:</span> {s.components}</div>
        <div className="p-1 rounded bg-background/50 border border-border/60"><span className="text-accent">משך:</span> {s.duration}</div>
      </div>
      {(() => {
        const meta = getSpellAttackMeta(s);
        if (!meta) return null;
        return (
          <div className="mt-1 text-[11px] flex flex-wrap gap-1">
            <span className="px-1.5 py-0.5 rounded bg-primary/15 border border-primary/40">
              {meta.attackType === "save" ? `Save ${meta.saveAbility ? meta.saveAbility.toUpperCase() : ""}` : meta.attackType === "melee_spell" ? "התקפת מגע" : "התקפה מרחוק"}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-primary/15 border border-primary/40">נזק: {meta.damageDice} {meta.damageType}</span>
            {meta.area && <span className="px-1.5 py-0.5 rounded bg-primary/15 border border-primary/40">אזור: {meta.area}</span>}
            {meta.saveEffect && <span className="px-1.5 py-0.5 rounded bg-primary/15 border border-primary/40">{meta.saveEffect}</span>}
            {meta.higherLevel && <span className="px-1.5 py-0.5 rounded bg-primary/15 border border-primary/40">שדרוג: {meta.higherLevel}</span>}
          </div>
        );
      })()}
      <div className="display text-xs text-accent mt-2">מה הכישוף עושה</div>
      {getSpellFlavor(s.id) && (
        <div className="text-sm mt-1 p-1.5 rounded bg-accent/10 border border-accent/30">🪄 {getSpellFlavor(s.id)}</div>
      )}
      <div className="text-sm mt-1">{s.description}</div>
      {(() => {
        const sums = getSummonsForSpell(s.id);
        if (!sums.length) return null;
        return (
          <div className="mt-2 border-t border-border/50 pt-2">
            <div className="display text-xs text-accent mb-1">👥 יצורי זימון אפשריים</div>
            <div className="grid sm:grid-cols-2 gap-1 text-xs">
              {sums.map(m => (
                <div key={m.id} className="p-1.5 rounded bg-background/50 border border-border/70">
                  <div className="font-semibold text-primary">{m.nameHe} <span className="text-muted-foreground">({m.type})</span></div>
                  <div className="text-[11px]">AC {m.ac} · HP {m.hp} · מהירות {m.speed}</div>
                  <div className="text-[11px]">🗡 {m.attack}</div>
                  {m.special && <div className="text-[11px] text-accent">✧ {m.special}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
  return (
    <div className="tavern-card p-4 md:col-span-3">
      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
        <h3 className="display text-lg text-primary">ספר הכישופים ({filtered.length}/{spells.length})</h3>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 mb-3">
        <input className="input" placeholder="🔍 חיפוש..." value={q} onChange={e => setQ(e.target.value)} />
        <select className="input" value={level} onChange={e => setLevel(e.target.value)}>
          <option value="all">כל הרמות</option>
          <option value="0">קנטריפ</option>
          {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={String(l)}>רמה {l}</option>)}
        </select>
        <select className="input" value={school} onChange={e => setSchool(e.target.value)}>
          <option value="all">כל האסכולות</option>
          {SPELL_SCHOOLS.map(s => <option key={s} value={s}>{SCHOOL_LABELS_HE[s]}</option>)}
        </select>
        <select className="input" value={dmgType} onChange={e => setDmgType(e.target.value)}>
          <option value="all">כל סוגי הנזק</option>
          {damageTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="input" value={rangeF} onChange={e => setRangeF(e.target.value)}>
          <option value="all">כל הטווחים</option>
          {Object.entries(RANGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="input" value={castF} onChange={e => setCastF(e.target.value)}>
          <option value="all">כל זמני ההטלה</option>
          {Object.entries(CAST_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="input" value={conc} onChange={e => setConc(e.target.value)}>
          <option value="all">ריכוז: הכול</option>
          <option value="yes">דורש ריכוז</option>
          <option value="no">בלי ריכוז</option>
        </select>
        <select className="input" value={saveF} onChange={e => setSaveF(e.target.value)}>
          <option value="all">Save/התקפה: הכול</option>
          <option value="save">דורש Save</option>
          <option value="attack">גלגול התקפה</option>
          <option value="none">בלי נזק (אפקט)</option>
        </select>
      </div>
      {(dmgType !== "all" || rangeF !== "all" || castF !== "all" || conc !== "all" || saveF !== "all" || level !== "all" || school !== "all" || q) && (
        <button
          onClick={() => { setQ(""); setLevel("all"); setSchool("all"); setDmgType("all"); setRangeF("all"); setCastF("all"); setConc("all"); setSaveF("all"); }}
          className="mb-3 text-xs px-2 py-1 rounded border border-border text-muted-foreground">נקה סינון</button>
      )}

      {granted.length > 0 && (
        <div className="mb-3">
          <div className="display text-sm text-accent mb-1">✨ כישופי תת-קלאס (תמיד מוכנים)</div>
          <div className="space-y-2">{granted.map(renderSpell)}</div>
        </div>
      )}
      {known.length > 0 && (
        <div>
          <div className="display text-sm text-accent mb-1">📖 הספר שלי</div>
          <div className="space-y-2">{known.map(renderSpell)}</div>
        </div>
      )}
    </div>
  );
}

function SpellAttacks({ c, onSave, spellAttackBonus, spellSaveDc }: {
  c: any; onSave: (c: any) => void; spellAttackBonus?: number; spellSaveDc?: number;
}) {
  const [picking, setPicking] = useState(false);
  const selectedIds = c.spellAttacks ?? [];
  const known = Array.from(new Set([...(c.spellIds ?? []), ...(c.preparedSpellIds ?? [])]));
  const knownSpells = (known.map(id => SPELLS.find(s => s.id === id)).filter(Boolean) as any[])
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  const [pickQ, setPickQ] = useState("");
  // All known spells are selectable as attacks (not only ones with damage metadata).
  const pickable = knownSpells.filter(s =>
    !pickQ || `${s.name} ${s.description}`.toLowerCase().includes(pickQ.toLowerCase()));

  const add = (id: string) => {
    if (selectedIds.includes(id)) return;
    onSave({ ...c, spellAttacks: [...selectedIds, id], updatedAt: Date.now() });
  };
  const remove = (id: string) => onSave({ ...c, spellAttacks: selectedIds.filter((x: string) => x !== id), updatedAt: Date.now() });
  const addAll = () => onSave({
    ...c,
    spellAttacks: Array.from(new Set([...selectedIds, ...knownSpells.map(s => s.id)])),
    updatedAt: Date.now(),
  });

  const [sort, setSort] = useState<"level" | "name" | "type" | "damageType" | "range">("level");
  const sortedSelected = useMemo(() => {
    const rows = (selectedIds as string[])
      .map(id => SPELLS.find(x => x.id === id))
      .filter(Boolean) as any[];
    const kindOf = (s: any) => {
      const m = getSpellAttackMeta(s);
      if (!m) return "אפקט";
      return m.attackType === "save" ? "Save" : m.attackType === "melee_spell" ? "מגע" : "טווח";
    };
    const dt = (s: any) => getSpellAttackMeta(s)?.damageType ?? "—";
    const out = [...rows];
    if (sort === "level") out.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    if (sort === "name") out.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "type") out.sort((a, b) => kindOf(a).localeCompare(kindOf(b)) || a.name.localeCompare(b.name));
    if (sort === "damageType") out.sort((a, b) => dt(a).localeCompare(dt(b)) || a.name.localeCompare(b.name));
    if (sort === "range") out.sort((a, b) => rangeCategory(a.range).localeCompare(rangeCategory(b.range)) || a.name.localeCompare(b.name));
    return out;
  }, [selectedIds, sort]);

  return (
    <div className="tavern-card p-4 md:col-span-3">
      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
        <h3 className="display text-lg text-primary">✨ כישופים כמתקפות</h3>
        <div className="flex flex-wrap gap-2">
          <select className="input text-xs" value={sort} onChange={e => setSort(e.target.value as any)}>
            <option value="level">מיון: רמה</option>
            <option value="name">מיון: שם</option>
            <option value="type">מיון: מגע/טווח/Save</option>
            <option value="damageType">מיון: סוג נזק</option>
            <option value="range">מיון: טווח הטלה</option>
          </select>
          <button onClick={addAll} className="text-xs px-2 py-1 rounded border border-primary text-primary">הוסף את כל הכישופים</button>
          <button onClick={() => setPicking(p => !p)} className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">
            {picking ? "סגור" : "+ הוסף כישוף כמתקפה"}
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2">מתקפות כישוף בלבד (מתקפות נשק בטבלה שמעל). יוצג תיוג, טווח, אזור פגיעה, קוביית נזק, סוג נזק, בונוס/DC והסבר מה הכישוף עושה.</p>


      {picking && (
        <div className="mb-3 p-2 rounded border border-border bg-background/40 max-h-[280px] overflow-y-auto space-y-1">
          <input className="input w-full mb-1" placeholder="🔍 חפש כישוף..." value={pickQ} onChange={e => setPickQ(e.target.value)} />
          {pickable.length === 0 && <p className="text-xs text-muted-foreground">לא נמצאו כישופים.</p>}
          {pickable.map(s => (
            <button key={s.id} onClick={() => add(s.id)} disabled={selectedIds.includes(s.id)}
              className="w-full text-right p-2 rounded border border-border hover:bg-secondary/40 disabled:opacity-40 text-sm">
              <div className="flex justify-between gap-2">
                <b>{s.name}{getSpellAttackMeta(s) ? " ⚔️" : ""}</b>
                <span className="text-xs text-muted-foreground">{s.level === 0 ? "קנטריפ" : `רמה ${s.level}`} · {s.range}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">{s.description}</div>
            </button>
          ))}
        </div>
      )}



      {selectedIds.length === 0 ? (
        <p className="text-xs text-muted-foreground">לא נבחרו כישופי התקפה.</p>
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th className="text-right">כישוף</th>
              <th>סוג</th>
              <th>טווח הטלה</th>
              <th>אזור פגיעה</th>
              <th>בונוס / DC</th>
              <th>קוביות נזק</th>
              <th>סוג נזק</th>
              <th>בהצלחה ב-Save</th>
              <th>Slot</th>
              <th>שדרוג</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {selectedIds.map((id: string) => {
              const s = SPELLS.find(x => x.id === id);
              if (!s) return null;
              const meta = getSpellAttackMeta(s);
              const bonusOrDc = meta?.attackType === "save"
                ? `DC ${spellSaveDc ?? "-"}${meta.saveAbility ? ` (${meta.saveAbility.toUpperCase()})` : ""}`
                : `${formatMod(spellAttackBonus ?? 0)}`;
              return (
                <tr key={id} className="border-t border-border/40 align-top">
                  <td className="py-1 font-semibold">{s.name}
                    <div className="text-[10px] text-muted-foreground">{s.castingTime} · {s.duration} · {s.components}</div>
                    {!meta && <div className="text-[11px] text-muted-foreground max-w-[240px] whitespace-normal">{s.description}</div>}
                  </td>
                  <td className="text-center text-xs">{!meta ? "אפקט" : meta.attackType === "save" ? "Save" : meta.attackType === "melee_spell" ? "Melee" : "Ranged"}</td>
                  <td className="text-center text-xs">{s.range}</td>
                  <td className="text-center text-xs">{meta?.area ?? "יעד יחיד"}</td>
                  <td className="text-center">{meta ? bonusOrDc : "—"}</td>
                  <td className="text-center font-mono">{meta?.damageDice ?? "—"}</td>
                  <td className="text-center text-xs">{meta?.damageType ?? "—"}</td>
                  <td className="text-center text-[11px] text-muted-foreground">{meta?.attackType === "save" ? (meta?.saveEffect ?? "—") : "—"}</td>
                  <td className="text-center text-xs">{s.level === 0 ? "קנטריפ" : `רמה ${s.level}+`}</td>
                  <td className="text-center text-[11px] text-muted-foreground">{meta?.higherLevel ?? "—"}</td>
                  <td className="text-center"><button onClick={() => remove(id)} className="text-destructive">✕</button></td>
                </tr>
              );

            })}
          </tbody>
        </table>
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="mt-2 text-[11px] text-muted-foreground">
          💡 עלייה בסלוט: ראה את השדה "Scaling" של כל כישוף. לקאנטריפ הנזק עולה אוטומטית לפי רמת דמות (5/11/17).
        </div>
      )}
    </div>
  );
}

function ManualAbilityEditor({ c, onSave, computed }: { c: any; onSave: (c: any) => void; computed: Record<Ability, number> }) {
  const [open, setOpen] = useState(false);
  const setOverride = (a: Ability, v: number | undefined) => {
    onSave({
      ...c,
      manualOverrides: {
        ...(c.manualOverrides ?? {}),
        abilities: { ...(c.manualOverrides?.abilities ?? {}), [a]: v },
      },
      updatedAt: Date.now(),
    });
  };
  return (
    <div className="tavern-card p-4 md:col-span-3">
      <button onClick={() => setOpen(o => !o)} className="text-sm text-primary hover:underline">
        {open ? "▲ סגור עריכה ידנית של מאפיינים" : "▼ עריכה ידנית של מאפיינים (STR/DEX/…)"}
      </button>
      {open && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ABILITIES.map(a => (
            <div key={a} className="p-2 rounded bg-background/40 border border-border text-center">
              <div className="display text-xs text-primary">{ABILITY_LABELS[a]}</div>
              <div className="text-[10px] text-muted-foreground">מחושב: {computed[a]}</div>
              <input type="number" className="input w-full text-center mt-1 text-sm"
                placeholder={String(computed[a])}
                value={c.manualOverrides?.abilities?.[a] ?? ""}
                onChange={e => setOverride(a, e.target.value === "" ? undefined : +e.target.value)}
              />
              {c.manualOverrides?.abilities?.[a] !== undefined && (
                <button onClick={() => setOverride(a, undefined)} className="text-[10px] text-destructive mt-1">אפס דריסה</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ---- Weapon / physical attacks: tagging + sorting ----
const DAMAGE_WORDS: Record<string, string> = {
  slashing: "חיתוך", piercing: "דקירה", bludgeoning: "מוחץ", fire: "אש", cold: "קור",
  lightning: "ברק", thunder: "רעם", acid: "חומצה", poison: "רעל", necrotic: "נקרוטי",
  radiant: "קדוש", psychic: "נפשי", force: "כוח",
  "חיתוך": "חיתוך", "דקירה": "דקירה", "מוחץ": "מוחץ", "אש": "אש", "קור": "קור",
  "ברק": "ברק", "רעם": "רעם", "חומצה": "חומצה", "רעל": "רעל",
};

function attackDamageType(a: { damage?: string; notes?: string }): string {
  const text = `${a.damage ?? ""} ${a.notes ?? ""}`.toLowerCase();
  for (const key of Object.keys(DAMAGE_WORDS)) {
    if (text.includes(key.toLowerCase())) return DAMAGE_WORDS[key];
  }
  return "—";
}

function attackReach(a: { name?: string; notes?: string }): "melee" | "ranged" | "unknown" {
  const text = `${a.name ?? ""} ${a.notes ?? ""}`.toLowerCase();
  if (/ranged|thrown|ammunition|range|טווח|מרחוק|קשת|קלע|זריקה|ft\.?\s*\//.test(text)) return "ranged";
  if (/melee|reach|מגע|קרב פנים|5ft|5 ft/.test(text)) return "melee";
  return "unknown";
}
const REACH_LABELS: Record<string, string> = { melee: "מגע", ranged: "טווח", unknown: "לא מסומן" };

function WeaponAttacks({ attacks }: { attacks: any[] }) {
  const [sort, setSort] = useState<"name" | "bonus" | "reach" | "damageType">("name");
  const rows = useMemo(() => {
    const enriched = attacks.map((a, i) => ({
      ...a, _i: i, reach: attackReach(a), dmgType: attackDamageType(a),
      bonusNum: parseInt(String(a.bonus ?? "").replace(/[^\-0-9]/g, ""), 10) || 0,
    }));
    const sorted = [...enriched];
    if (sort === "name") sorted.sort((x, y) => String(x.name).localeCompare(String(y.name)));
    if (sort === "bonus") sorted.sort((x, y) => y.bonusNum - x.bonusNum);
    if (sort === "reach") sorted.sort((x, y) => x.reach.localeCompare(y.reach) || String(x.name).localeCompare(String(y.name)));
    if (sort === "damageType") sorted.sort((x, y) => x.dmgType.localeCompare(y.dmgType) || String(x.name).localeCompare(String(y.name)));
    return sorted;
  }, [attacks, sort]);

  return (
    <div className="tavern-card p-4 md:col-span-3">
      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
        <h3 className="display text-lg text-primary">⚔️ מתקפות נשק (פיזיות)</h3>
        <select className="input text-xs" value={sort} onChange={e => setSort(e.target.value as any)}>
          <option value="name">מיון: שם</option>
          <option value="bonus">מיון: בונוס פגיעה</option>
          <option value="reach">מיון: מגע / טווח</option>
          <option value="damageType">מיון: סוג נזק</option>
        </select>
      </div>
      <p className="text-xs text-muted-foreground mb-2">כאן רק מתקפות נשק וגוף. מתקפות כישוף מופיעות בטבלה הנפרדת "✨ כישופים כמתקפות".</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="text-xs text-muted-foreground">
            <tr><th className="text-right">שם</th><th>תיוג</th><th>סוג נזק</th><th>בונוס</th><th>נזק</th><th className="text-right">הערות</th></tr>
          </thead>
          <tbody>
            {rows.map(a => (
              <tr key={a._i} className="border-t border-border/40 align-top">
                <td className="py-1 font-semibold">{a.name}</td>
                <td className="text-center">
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-primary/15 border border-primary/40">
                    🗡 נשק · {REACH_LABELS[a.reach]}
                  </span>
                </td>
                <td className="text-center text-xs">{a.dmgType}</td>
                <td className="text-center">{a.bonus}</td>
                <td className="text-center font-mono">{a.damage}</td>
                <td className="text-muted-foreground text-xs">{a.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
