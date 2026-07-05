import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useCharacters, useHydrateCharacters } from "@/lib/character-store";
import { emptyCharacter } from "@/lib/calculations";
import { RACES } from "@/data/races";
import { CLASSES } from "@/data/classes";
import { BACKGROUNDS } from "@/data/backgrounds";
import { FEATS } from "@/data/feats";
import { FIGHTING_STYLES, fightingStyleSlots, fightingStylesFor } from "@/data/fighting-styles";
import { ITEMS } from "@/data/items";
import { SPELLS, SCHOOL_LABELS_HE } from "@/data/spells";
import { ABILITIES, ABILITY_LABELS, ABILITY_SHORT, SKILL_LIST, ALIGNMENTS, STANDARD_ARRAY_VALUES, formatMod, mod, type Ability, type Skill, type Character } from "@/lib/dnd-types";
import { calculateCharacter, getClass } from "@/lib/calculations";

export const Route = createFileRoute("/builder")({
  validateSearch: (s: Record<string, unknown>) => ({ edit: typeof s.edit === "string" ? s.edit : undefined }),
  head: () => ({
    meta: [
      { title: "בונה דמות חדשה — בר הקסמים" },
      { name: "description", content: "אשף יצירת דמות D&D 5e — גזע, קלאס, יכולות, כישופים, פריטים." },
    ],
  }),
  component: Builder,
});

const STEPS = [
  "פרטים", "גזע", "קלאס", "רקע", "יכולות", "מיומנויות", "Feats", "כישופים", "פריטים", "התקפות", "סקירה",
] as const;

function Builder() {
  const hydrated = useHydrateCharacters();
  const { saveCharacter, getCharacter } = useCharacters();
  const navigate = useNavigate();
  const { edit } = Route.useSearch();
  const [step, setStep] = useState(0);
  const [c, setC] = useState<Character>(() => emptyCharacter());
  const [loadedEdit, setLoadedEdit] = useState(false);

  // Load the character to edit AFTER persist hydration finishes,
  // otherwise getCharacter() returns undefined on the first render and
  // a brand-new empty character would silently replace the saved one.
  useEffect(() => {
    if (!hydrated || loadedEdit) return;
    if (edit) {
      const existing = getCharacter(edit);
      if (existing) setC(existing);
    }
    setLoadedEdit(true);
  }, [hydrated, edit, loadedEdit, getCharacter]);

  // Auto-save every change when editing existing character (only after the
  // existing one has been loaded, to avoid clobbering it with the empty seed).
  useEffect(() => {
    if (edit && loadedEdit && c.id) saveCharacter(c);
  }, [c, edit, loadedEdit, saveCharacter]);

  const update = (patch: Partial<Character>) => setC(prev => ({ ...prev, ...patch }));

  const next = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));

  const finish = () => {
    if (!c.name) { alert("נא לתת שם לדמות"); setStep(0); return; }
    saveCharacter(c);
    navigate({ to: "/character/$id", params: { id: c.id } });
  };

  if (edit && !loadedEdit) {
    return <div className="text-center py-20 text-muted-foreground"><div className="text-5xl mb-2 animate-pulse">🕯️</div>טוען דמות לעריכה…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate({ to: "/" })} className="text-sm text-muted-foreground hover:text-primary">← חזרה</button>
        <h1 className="display text-2xl text-primary">אשף יצירת דמות</h1>
      </header>

      <Stepper step={step} setStep={setStep} />

      <div className="tavern-card p-5 md:p-8 mt-4 min-h-[400px]">
        {step === 0 && <Step0Basics c={c} update={update} />}
        {step === 1 && <Step1Race c={c} update={update} />}
        {step === 2 && <Step2Class c={c} update={update} />}
        {step === 3 && <Step3Background c={c} update={update} />}
        {step === 4 && <Step4Abilities c={c} update={update} />}
        {step === 5 && <Step5Skills c={c} update={update} />}
        {step === 6 && <Step6Feats c={c} update={update} />}
        {step === 7 && <Step7Spells c={c} update={update} />}
        {step === 8 && <Step8Items c={c} update={update} />}
        {step === 9 && <Step9Attacks c={c} update={update} />}
        {step === 10 && <Step10Review c={c} update={update} />}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={prev} disabled={step === 0} className="px-5 py-2 rounded-md bg-secondary disabled:opacity-30 hover:bg-accent">→ הקודם</button>
        {step < STEPS.length - 1 ? (
          <button onClick={next} className="px-5 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">הבא ←</button>
        ) : (
          <button onClick={finish} className="px-6 py-2 rounded-md bg-accent text-accent-foreground font-semibold hover:opacity-90 ember-glow">{edit ? "שמור וצפה 🍷" : "סיים ושמור 🍷"}</button>
        )}
      </div>
    </div>
  );
}

function Stepper({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1 text-xs">
      {STEPS.map((label, i) => (
        <button key={i} onClick={() => setStep(i)}
          className={`px-2 py-1 rounded display ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-secondary text-foreground" : "bg-secondary/40 text-muted-foreground"}`}>
          {i + 1}. {label}
        </button>
      ))}
    </div>
  );
}

// ============ Step 0 — Basics + portrait ============
function Step0Basics({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const onPortrait = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_500_000) { alert("התמונה גדולה מדי (מקס 2.5MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => update({ portrait: reader.result as string });
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-4">
      <h2 className="display text-2xl text-primary">פרטים בסיסיים</h2>
      <div className="flex gap-4 items-start flex-wrap">
        <label className="cursor-pointer block">
          {c.portrait ? (
            <img src={c.portrait} alt="" className="w-32 h-32 object-cover rounded-md border-2 border-primary" />
          ) : (
            <div className="w-32 h-32 rounded-md bg-secondary border-2 border-dashed border-primary flex flex-col items-center justify-center text-xs text-muted-foreground">
              <div className="text-3xl">📷</div>
              העלה תמונה
            </div>
          )}
          <input type="file" accept="image/*" hidden onChange={onPortrait} />
        </label>
        <div className="flex-1 min-w-[260px] grid sm:grid-cols-2 gap-3">
          <Field label="שם הדמות"><input value={c.name} onChange={e => update({ name: e.target.value })} className="input" /></Field>
          <Field label="שם השחקן"><input value={c.player ?? ""} onChange={e => update({ player: e.target.value })} className="input" /></Field>
          <Field label="רמה"><input type="number" min={1} max={20} value={c.level} onChange={e => update({ level: Math.max(1, Math.min(20, +e.target.value || 1)) })} className="input" /></Field>
          <Field label="מערך (Alignment)">
            <select className="input" value={c.alignment ?? ""} onChange={e => update({ alignment: e.target.value })}>
              <option value="">— בחר —</option>
              {ALIGNMENTS.map(a => <option key={a.id} value={a.label}>{a.label}</option>)}
            </select>
          </Field>
        </div>
      </div>
    </div>
  );
}

// ============ Step 1 — Race ============
function Step1Race({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const race = RACES.find(r => r.id === c.raceId);
  const [filter, setFilter] = useState("");
  const filtered = RACES.filter(r => !filter || r.nameHe.includes(filter) || r.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div className="space-y-4">
      <h2 className="display text-2xl text-primary">בחר גזע</h2>
      <input className="input w-full" placeholder="חפש גזע..." value={filter} onChange={e => setFilter(e.target.value)} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[360px] overflow-y-auto">
        {filtered.map(r => (
          <button key={r.id} onClick={() => update({ raceId: r.id, subraceId: undefined })}
            className={`text-right p-3 rounded-md border transition ${c.raceId === r.id ? "bg-primary/20 border-primary ember-glow" : "border-border hover:bg-secondary/40"}`}>
            <div className="font-semibold">{r.nameHe} <span className="text-xs text-muted-foreground">({r.name})</span></div>
            <div className="text-xs text-muted-foreground">מהירות {r.speed}ft · {r.size} {r.darkvision ? `· darkvision ${r.darkvision}` : ""}</div>
            <div className="text-xs mt-1">{r.abilityBonuses.map(b => `${ABILITY_SHORT[b.ability]}${b.amount >= 0 ? "+" : ""}${b.amount}`).join(", ")}</div>
          </button>
        ))}
      </div>
      {race?.subraces && race.subraces.length > 0 && (
        <div>
          <h3 className="display text-lg text-primary mt-3 mb-2">תת-גזע</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {race.subraces.map(sr => (
              <button key={sr.id} onClick={() => update({ subraceId: sr.id })}
                className={`text-right p-3 rounded-md border ${c.subraceId === sr.id ? "bg-primary/20 border-primary" : "border-border hover:bg-secondary/40"}`}>
                <div className="font-semibold">{sr.nameHe} <span className="text-xs text-muted-foreground">({sr.name})</span></div>
                <div className="text-xs">{sr.abilityBonuses.map(b => `${ABILITY_SHORT[b.ability]}+${b.amount}`).join(", ")}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      {race && (
        <div className="mt-4 p-3 rounded-md bg-background/40 border border-border space-y-3">
          <h4 className="display text-primary mb-1">תכונות {race.nameHe}</h4>
          <ul className="text-sm space-y-1">
            {race.traits.concat(race.subraces?.find(s => s.id === c.subraceId)?.traits ?? []).map(t => (
              <li key={t.name}><b className="text-primary">{t.name}:</b> {t.desc}</li>
            ))}
          </ul>
          <div className="pt-2 border-t border-border">
            <div className="display text-sm text-accent mb-1">✏️ עריכת בונוסי גזע (STR/DEX/…)</div>
            <p className="text-xs text-muted-foreground mb-2">אם ה-DM שלך משתמש בכללי Tasha (בונוסים גמישים) — דרוס פה את הבונוס לכל יכולת.</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ABILITIES.map(a => {
                const defaultVal = (race.abilityBonuses.find(b => b.ability === a)?.amount ?? 0)
                  + ((race.subraces?.find(s => s.id === c.subraceId)?.abilityBonuses.find(b => b.ability === a)?.amount) ?? 0);
                const cur = c.raceAbilityBonusOverrides?.[a];
                return (
                  <div key={a} className="text-center">
                    <div className="display text-xs text-primary">{ABILITY_SHORT[a]}</div>
                    <div className="text-[10px] text-muted-foreground">ברירת מחדל {defaultVal >= 0 ? "+" : ""}{defaultVal}</div>
                    <input type="number" className="input w-full text-center mt-1"
                      placeholder={String(defaultVal)}
                      value={cur ?? ""}
                      onChange={e => update({ raceAbilityBonusOverrides: { ...(c.raceAbilityBonusOverrides ?? {}), [a]: e.target.value === "" ? undefined : +e.target.value } })}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Step 2 — Class + Subclass ============
function Step2Class({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const cls = CLASSES.find(x => x.id === c.classId);
  const subAvailable = cls && c.level >= cls.subclassLevel;
  return (
    <div className="space-y-4">
      <h2 className="display text-2xl text-primary">בחר קלאס</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[360px] overflow-y-auto">
        {CLASSES.map(cl => (
          <button key={cl.id} onClick={() => update({ classId: cl.id, subclassId: undefined, skillProficiencies: [] })}
            className={`text-right p-3 rounded-md border ${c.classId === cl.id ? "bg-primary/20 border-primary ember-glow" : "border-border hover:bg-secondary/40"}`}>
            <div className="font-semibold">{cl.nameHe} <span className="text-xs text-muted-foreground">({cl.name})</span></div>
            <div className="text-xs text-muted-foreground">Hit Die d{cl.hitDie} · Save: {cl.savingThrows.map(s => ABILITY_SHORT[s]).join("/")}</div>
          </button>
        ))}
      </div>
      {cls && (
        <>
          <div className="p-3 rounded-md bg-background/40 border border-border">
            <h4 className="display text-primary mb-1">תכונות {cls.nameHe} (עד רמה {c.level})</h4>
            <ul className="text-sm space-y-1">
              {cls.features.filter(f => f.level <= c.level).map(f => (
                <li key={f.name}><b className="text-primary">רמה {f.level} — {f.name}:</b> {f.desc}</li>
              ))}
            </ul>
          </div>
          {subAvailable && (
            <div>
              <h3 className="display text-lg text-primary">תת-קלאס</h3>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                {cls.subclasses.map(sub => (
                  <button key={sub.id} onClick={() => update({ subclassId: sub.id })}
                    className={`text-right p-3 rounded-md border ${c.subclassId === sub.id ? "bg-primary/20 border-primary" : "border-border hover:bg-secondary/40"}`}>
                    <div className="font-semibold">{sub.nameHe} <span className="text-xs text-muted-foreground">({sub.name})</span></div>
                    {sub.grantedSpells && <div className="text-xs text-accent-foreground mt-1">+ כישופים אוטומטיים</div>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Multiclass */}
      <div className="p-3 rounded-md bg-background/30 border border-border space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="display text-primary">⚔️ מולטיקלאס (אופציונלי)</h3>
          <button
            type="button"
            onClick={() => update({ multiclass: [...(c.multiclass ?? []), { classId: "", level: 1 }] })}
            className="text-xs px-2 py-1 rounded bg-secondary hover:bg-accent"
          >
            + הוסף קלאס
          </button>
        </div>
        <p className="text-xs text-muted-foreground">כל קלאס יחושב לו פול משאבים עצמאי (Rage / Ki / Sorcery Points / Psionic Dice וכו׳) לפי רמתו ותת-הקלאס שלו.</p>
        {(c.multiclass ?? []).map((mc, idx) => {
          const mcCls = CLASSES.find(x => x.id === mc.classId);
          const updateMc = (patch: Partial<typeof mc>) => {
            const next = [...(c.multiclass ?? [])];
            next[idx] = { ...next[idx], ...patch };
            update({ multiclass: next });
          };
          const removeMc = () => update({ multiclass: (c.multiclass ?? []).filter((_, i) => i !== idx) });
          return (
            <div key={idx} className="p-2 rounded border border-border bg-background/40 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="input flex-1 min-w-[140px]"
                  value={mc.classId}
                  onChange={e => updateMc({ classId: e.target.value, subclassId: undefined })}
                >
                  <option value="">בחר קלאס…</option>
                  {CLASSES.filter(cl => cl.id !== c.classId).map(cl => (
                    <option key={cl.id} value={cl.id}>{cl.nameHe} ({cl.name})</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={mc.level}
                  onChange={e => updateMc({ level: Math.max(1, Math.min(20, +e.target.value || 1)) })}
                  className="input w-20"
                  aria-label="רמה"
                />
                <button onClick={removeMc} className="text-xs px-2 py-1 rounded bg-destructive/70 text-destructive-foreground hover:bg-destructive">הסר</button>
              </div>
              {mcCls && mc.level >= mcCls.subclassLevel && (
                <select
                  className="input w-full"
                  value={mc.subclassId ?? ""}
                  onChange={e => updateMc({ subclassId: e.target.value || undefined })}
                >
                  <option value="">תת-קלאס…</option>
                  {mcCls.subclasses.map(s => (
                    <option key={s.id} value={s.id}>{s.nameHe} ({s.name})</option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Step 3 — Background ============
function Step3Background({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const pickBg = (b: typeof BACKGROUNDS[number]) => {
    // Auto-add background skill proficiencies (without duplicating existing ones).
    const merged = Array.from(new Set([...c.skillProficiencies, ...b.skills]));
    update({ backgroundId: b.id, skillProficiencies: merged });
  };
  return (
    <div className="space-y-3">
      <h2 className="display text-2xl text-primary">בחר רקע</h2>
      <p className="text-xs text-muted-foreground">בחירת רקע מוסיפה אוטומטית את מיומנויות הבקיאות שלו למיומנויות שלך.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {BACKGROUNDS.map(b => (
          <button key={b.id} onClick={() => pickBg(b)}
            className={`text-right p-3 rounded-md border ${c.backgroundId === b.id ? "bg-primary/20 border-primary" : "border-border hover:bg-secondary/40"}`}>
            <div className="font-semibold">{b.nameHe} <span className="text-xs text-muted-foreground">({b.name})</span></div>
            <div className="text-xs text-accent">✓ מיומנויות: {b.skills.map(s => SKILL_LIST.find(x => x.id === s)?.label).join(", ")}</div>
            <div className="text-xs mt-1">{b.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ Step 4 — Abilities ============
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
function Step4Abilities({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const [method, setMethod] = useState<"standard" | "manual" | "pointbuy">("manual");
  const set = (a: Ability, val: number) => update({ baseAbilities: { ...c.baseAbilities, [a]: val } });
  const totalPB = ABILITIES.reduce((sum, a) => {
    const v = c.baseAbilities[a];
    const cost = v <= 13 ? v - 8 : v === 14 ? 7 : v === 15 ? 9 : 0;
    return sum + Math.max(0, cost);
  }, 0);
  const d = calculateCharacter(c);
  return (
    <div className="space-y-4">
      <h2 className="display text-2xl text-primary">חלוקת יכולות</h2>
      <div className="flex gap-2 text-sm">
        <button onClick={() => setMethod("standard")} className={`px-3 py-1 rounded ${method === "standard" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Standard Array (15,14,13,12,10,8)</button>
        <button onClick={() => setMethod("pointbuy")} className={`px-3 py-1 rounded ${method === "pointbuy" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Point Buy (27)</button>
        <button onClick={() => setMethod("manual")} className={`px-3 py-1 rounded ${method === "manual" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>ידני</button>
      </div>
      <div className="p-2 rounded bg-accent/10 border border-accent/40 text-xs">
        ✨ <b>ASI/Feat זמינים:</b> {d.asi.total} · השתמשת ב-{d.asi.used} · נותרו <b className="text-accent">{d.asi.remaining}</b>
        {d.asi.nextAt && <> · הבא ברמה {d.asi.nextAt}</>}
        <span className="ms-2 text-muted-foreground">רמות ASI: {d.asi.levels.join(", ")}</span>
      </div>
      {method === "standard" && <p className="text-xs text-muted-foreground">הכנס {STANDARD_ARRAY.join(", ")} פעם אחת בכל יכולת.</p>}
      {method === "pointbuy" && (
        <p className="text-xs text-muted-foreground">סך נקודות: <b className={totalPB > 27 ? "text-destructive" : "text-primary"}>{totalPB}/27</b>. ערכים בין 8 ל-15.</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ABILITIES.map(a => {
          const base = c.baseAbilities[a];
          const raceBonus = d.raceBonuses[a] ?? 0;
          const canBoost = d.asi.remaining > 0 && d.abilities[a] < 20;
          return (
            <div key={a} className={`p-3 rounded-md border text-center ${canBoost ? "bg-accent/10 border-accent" : "bg-background/40 border-border"}`}>
              <div className="display text-primary text-sm">{ABILITY_LABELS[a]}</div>
              {canBoost && <div className="text-[10px] text-accent">🎯 ניתן לחיזוק (ASI)</div>}
              {method === "standard" ? (
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {STANDARD_ARRAY_VALUES.map(v => (
                    <button key={v} onClick={() => set(a, v)}
                      className={`px-2 py-1 rounded text-sm border ${base === v ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:bg-accent"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              ) : (
                <input type="number" min={1} max={20} value={base} onChange={e => set(a, +e.target.value || 0)} className="input text-center text-2xl w-full mt-1" />
              )}
              <div className="text-xs text-muted-foreground mt-1">בסיס {base} {raceBonus ? `+ גזע ${raceBonus >= 0 ? "+" : ""}${raceBonus}` : ""} = <b>{d.abilities[a]}</b></div>
              <div className="display text-accent text-lg mt-1">mod {formatMod(d.abilityMods[a])}</div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">* בסקירה הסופית תוכל לדרוס כל ערך בידנית. * לעריכת בונוסי גזע חזור לשלב "גזע".</p>
    </div>
  );
}

// ============ Step 5 — Skills ============
function Step5Skills({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const cls = getClass(c.classId);
  const toggle = (s: Skill) => {
    const has = c.skillProficiencies.includes(s);
    const next = has ? c.skillProficiencies.filter(x => x !== s) : [...c.skillProficiencies, s];
    update({ skillProficiencies: next });
  };
  const toggleExp = (s: Skill) => {
    const has = c.expertise.includes(s);
    update({ expertise: has ? c.expertise.filter(x => x !== s) : [...c.expertise, s] });
  };
  return (
    <div className="space-y-3">
      <h2 className="display text-2xl text-primary">מיומנויות ובקיאות</h2>
      <p className="text-xs text-muted-foreground">
        {cls ? `קלאס: ${cls.nameHe} — בחר ${cls.skillChoices.count} מיומנויות.` : "בחר קלאס תחילה."}
        {" "}סמן Expertise (כפול בקיאות) למיומנויות שהדמות שולטת בהן.
      </p>
      <div className="grid sm:grid-cols-2 gap-1 text-sm">
        {SKILL_LIST.map(s => (
          <div key={s.id} className="flex items-center justify-between gap-2 p-2 rounded hover:bg-secondary/30">
            <label className="flex items-center gap-2 flex-1 cursor-pointer">
              <input type="checkbox" checked={c.skillProficiencies.includes(s.id)} onChange={() => toggle(s.id)} />
              <span>{s.label} <span className="text-xs text-muted-foreground">({ABILITY_SHORT[s.ability]})</span></span>
            </label>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input type="checkbox" checked={c.expertise.includes(s.id)} onChange={() => toggleExp(s.id)} disabled={!c.skillProficiencies.includes(s.id)} />
              Exp
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Step 6 — Feats ============
function Step6Feats({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const [q, setQ] = useState("");
  const list = FEATS.filter(f => !q || f.name.toLowerCase().includes(q.toLowerCase()) || f.nameHe.includes(q));
  const toggle = (id: string) => {
    const has = c.featIds.includes(id);
    update({ featIds: has ? c.featIds.filter(x => x !== id) : [...c.featIds, id] });
  };
  return (
    <div className="space-y-3">
      <h2 className="display text-2xl text-primary">Feats / Fates</h2>
      <p className="text-xs text-muted-foreground">בחר feats — בונוסים אוטומטיים (יכולות, HP, מהירות, AC) ייושמו בסקירה ובדף הדמות.</p>
      <input className="input w-full" placeholder="חפש feat..." value={q} onChange={e => setQ(e.target.value)} />
      <div className="grid sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto">
        {list.map(f => (
          <button key={f.id} onClick={() => toggle(f.id)}
            className={`text-right p-3 rounded-md border text-sm ${c.featIds.includes(f.id) ? "bg-primary/20 border-primary" : "border-border hover:bg-secondary/40"}`}>
            <div className="font-semibold">{f.nameHe} <span className="text-xs text-muted-foreground">({f.name})</span></div>
            {f.prerequisite && <div className="text-[11px] text-accent">תנאי: {f.prerequisite}</div>}
            <div className="text-xs mt-1">{f.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ Step 7 — Spells ============
function Step7Spells({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const cls = getClass(c.classId);
  const sub = cls?.subclasses.find(s => s.id === c.subclassId);
  const grantedIds = useMemo(() => {
    const ids: string[] = [];
    sub?.grantedSpells?.forEach(g => { if (c.level >= g.level) ids.push(...g.spellIds); });
    return ids;
  }, [sub, c.level]);

  const [q, setQ] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | "all">("all");
  const [schoolFilter, setSchoolFilter] = useState<string | "all">("all");
  const [classOnly, setClassOnly] = useState(true);

  const filtered = useMemo(() => {
    return SPELLS.filter(s => {
      if (classOnly && cls && !s.classes.includes(cls.id)) return false;
      if (levelFilter !== "all" && s.level !== levelFilter) return false;
      if (schoolFilter !== "all" && s.school !== schoolFilter) return false;
      if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, levelFilter, schoolFilter, classOnly, cls]);

  const toggle = (id: string) => {
    const has = c.spellIds.includes(id);
    update({ spellIds: has ? c.spellIds.filter(x => x !== id) : [...c.spellIds, id] });
  };
  const togglePrep = (id: string) => {
    const has = c.preparedSpellIds.includes(id);
    update({ preparedSpellIds: has ? c.preparedSpellIds.filter(x => x !== id) : [...c.preparedSpellIds, id] });
  };

  return (
    <div className="space-y-3">
      <h2 className="display text-2xl text-primary">כישופים</h2>
      <p className="text-xs text-muted-foreground">סמן ✓ כדי <b>לדעת/ללמוד</b> כישוף. ✦ = מוכן ביום הזה (יודפס ב-PDF כ"מוכן").</p>
      {grantedIds.length > 0 && (
        <div className="p-2 rounded bg-accent/20 border border-accent/40 text-xs">
          <b>{sub?.nameHe}:</b> כישופים שמוענקים אוטומטית (תמיד מוכנים): {grantedIds.map(id => SPELLS.find(s => s.id === id)?.name).join(", ")}
        </div>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        <input className="input flex-1 min-w-[200px]" placeholder="חפש שם כישוף..." value={q} onChange={e => setQ(e.target.value)} />
        <select className="input" value={levelFilter as any} onChange={e => setLevelFilter(e.target.value === "all" ? "all" : +e.target.value)}>
          <option value="all">כל הרמות</option>
          <option value={0}>קנטריפ</option>
          {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>רמה {l}</option>)}
        </select>
        <select className="input" value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)}>
          <option value="all">כל הבתים</option>
          {Object.entries(SCHOOL_LABELS_HE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={classOnly} onChange={e => setClassOnly(e.target.checked)} /> רק לקלאס שלי</label>
      </div>
      <div className="text-xs text-muted-foreground">יודעים {c.spellIds.length} · מוכנים {c.preparedSpellIds.length} · מוצגים {filtered.length}</div>
      <div className="max-h-[420px] overflow-y-auto space-y-1">
        {filtered.map(s => {
          const known = c.spellIds.includes(s.id);
          const prep = c.preparedSpellIds.includes(s.id);
          return (
            <div key={s.id} className={`p-2 rounded border text-sm ${known ? "bg-primary/15 border-primary" : "border-border hover:bg-secondary/30"}`}>
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs flex items-center gap-1 cursor-pointer" title="יודע">
                    <input type="checkbox" checked={known} onChange={() => toggle(s.id)} /> יודע
                  </label>
                  <label className="text-xs flex items-center gap-1 cursor-pointer" title="מוכן ליום">
                    <input type="checkbox" checked={prep} disabled={!known} onChange={() => togglePrep(s.id)} /> ✦ מוכן
                  </label>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-xs text-muted-foreground">{s.level === 0 ? "קנטריפ" : `רמה ${s.level}`} · {SCHOOL_LABELS_HE[s.school]}{s.concentration ? " · C" : ""}{s.ritual ? " · R" : ""}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{s.castingTime} · {s.range} · {s.duration}</div>
                  <div className="text-xs mt-1">{s.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Step 8 — Items ============
function Step8Items({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const list = ITEMS.filter(i => (cat === "all" || i.category === cat) && (!q || i.name.toLowerCase().includes(q.toLowerCase()) || (i.nameHe && i.nameHe.includes(q))));
  const toggle = (id: string) => {
    const has = c.itemIds.find(x => x.id === id);
    if (has) update({ itemIds: c.itemIds.filter(x => x.id !== id) });
    else update({ itemIds: [...c.itemIds, { id, equipped: true, quantity: 1 }] });
  };
  const toggleEquip = (id: string) => {
    update({ itemIds: c.itemIds.map(x => x.id === id ? { ...x, equipped: !x.equipped } : x) });
  };
  const setQty = (id: string, n: number) => {
    update({ itemIds: c.itemIds.map(x => x.id === id ? { ...x, quantity: Math.max(1, n) } : x) });
  };

  const equipment = c.equipment ?? [];
  const setEq = (next: typeof equipment) => update({ equipment: next });
  const [newEqName, setNewEqName] = useState("");

  return (
    <div className="space-y-3">
      <h2 className="display text-2xl text-primary">פריטים, ציוד וקטלוג</h2>
      <p className="text-xs text-muted-foreground">בונוסי AC/יכולת/HP/מהירות מתווספים אוטומטית כשהפריט "חמוש". אפשר לקבוע <b>כמות</b> לכל פריט.</p>
      <div className="flex gap-2 flex-wrap">
        <input className="input flex-1 min-w-[180px]" placeholder="חפש פריט..." value={q} onChange={e => setQ(e.target.value)} />
        <select className="input" value={cat} onChange={e => setCat(e.target.value)}>
          <option value="all">כל הקטגוריות</option>
          <option value="armor">שריון</option>
          <option value="shield">מגן</option>
          <option value="weapon">נשק</option>
          <option value="wondrous">פלא</option>
          <option value="ring">טבעת</option>
          <option value="potion">שיקוי</option>
          <option value="wand">שרביט</option>
          <option value="staff">מטה</option>
          <option value="rod">מטה-מלוכה</option>
          <option value="gear">ציוד</option>
        </select>
      </div>
      <div className="max-h-[360px] overflow-y-auto space-y-1">
        {list.map(item => {
          const cur = c.itemIds.find(x => x.id === item.id);
          return (
            <div key={item.id} className={`p-2 rounded border text-sm ${cur ? "bg-primary/10 border-primary" : "border-border"}`}>
              <div className="flex items-center justify-between gap-2">
                <button onClick={() => toggle(item.id)} className="text-right flex-1">
                  <div className="font-semibold">{item.nameHe ?? item.name} <span className="text-xs text-muted-foreground">({item.name})</span>{item.rarity && <span className="text-[10px] text-accent ms-2">{item.rarity}</span>}</div>
                  <div className="text-xs">{item.description}</div>
                </button>
                {cur && (
                  <div className="flex items-center gap-2 text-xs">
                    <label className="flex items-center gap-1">כמות
                      <input type="number" min={1} value={cur.quantity ?? 1} onChange={e => setQty(item.id, +e.target.value || 1)} className="input w-14 h-7 px-1 text-center" />
                    </label>
                    {(item.category === "armor" || item.category === "shield" || item.category === "weapon" || item.category === "wondrous" || item.category === "ring") && (
                      <label className="flex items-center gap-1">
                        <input type="checkbox" checked={cur.equipped} onChange={() => toggleEquip(item.id)} /> חמוש
                      </label>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Free equipment list */}
      <div className="pt-3 border-t border-border">
        <h3 className="display text-lg text-primary mb-2">📝 ציוד נוסף בכתב יד</h3>
        <p className="text-xs text-muted-foreground mb-2">רשום פריטים חופשיים שלא נמצאו בקטלוג (כסף, חפצי משחק, מתנות וכו').</p>
        <div className="flex gap-2 mb-2">
          <input className="input flex-1" placeholder="שם הפריט (לדוגמה: 50 מטבעות זהב)" value={newEqName}
            onChange={e => setNewEqName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && newEqName.trim()) { setEq([...equipment, { name: newEqName.trim(), quantity: 1 }]); setNewEqName(""); }}} />
          <button onClick={() => { if (newEqName.trim()) { setEq([...equipment, { name: newEqName.trim(), quantity: 1 }]); setNewEqName(""); }}}
            className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm">+ הוסף</button>
        </div>
        <ul className="space-y-1">
          {equipment.map((eq, i) => (
            <li key={i} className="flex items-center gap-2 p-2 rounded border border-border bg-background/40 text-sm">
              <input className="input flex-1" value={eq.name} onChange={e => setEq(equipment.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              <input type="number" min={1} className="input w-16 text-center" value={eq.quantity}
                onChange={e => setEq(equipment.map((x, j) => j === i ? { ...x, quantity: Math.max(1, +e.target.value || 1) } : x))} />
              <input className="input flex-1" placeholder="הערות" value={eq.notes ?? ""}
                onChange={e => setEq(equipment.map((x, j) => j === i ? { ...x, notes: e.target.value } : x))} />
              <button onClick={() => setEq(equipment.filter((_, j) => j !== i))} className="text-destructive text-sm">✕</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============ Step 9 — Custom Attacks ============
function Step9Attacks({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const attacks = c.attacks ?? [];
  const set = (next: typeof attacks) => update({ attacks: next });
  const add = () => set([...attacks, { name: "", bonus: "+0", damage: "1d6", notes: "" }]);
  return (
    <div className="space-y-3">
      <h2 className="display text-2xl text-primary">⚔️ התקפות</h2>
      <p className="text-xs text-muted-foreground">רשום נשקים והתקפות (כולל unarmed, breath weapon, spell attack) — יופיע על הגיליון וב-PDF.</p>
      <button onClick={add} className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm">+ הוסף התקפה</button>
      <div className="space-y-2">
        {attacks.map((a, i) => (
          <div key={i} className="p-3 rounded border border-border bg-background/40 grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_2fr_auto] gap-2">
            <input className="input" placeholder="שם (Longsword)" value={a.name} onChange={e => set(attacks.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
            <input className="input" placeholder="+בונוס" value={a.bonus} onChange={e => set(attacks.map((x, j) => j === i ? { ...x, bonus: e.target.value } : x))} />
            <input className="input" placeholder="נזק (1d8+3 slashing)" value={a.damage} onChange={e => set(attacks.map((x, j) => j === i ? { ...x, damage: e.target.value } : x))} />
            <input className="input" placeholder="הערות (טווח, reach, finesse...)" value={a.notes ?? ""} onChange={e => set(attacks.map((x, j) => j === i ? { ...x, notes: e.target.value } : x))} />
            <button onClick={() => set(attacks.filter((_, j) => j !== i))} className="text-destructive">✕</button>
          </div>
        ))}
        {attacks.length === 0 && <p className="text-xs text-muted-foreground">עדיין אין התקפות. לחץ "+ הוסף התקפה".</p>}
      </div>
    </div>
  );
}

// ============ Step 10 — Review with manual overrides ============
function Step10Review({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const d = calculateCharacter(c);
  const setOverride = (key: keyof NonNullable<Character["manualOverrides"]>, value: any) => {
    update({ manualOverrides: { ...(c.manualOverrides ?? {}), [key]: value } });
  };
  return (
    <div className="space-y-4">
      <h2 className="display text-2xl text-primary">סקירה ועריכה ידנית</h2>
      <p className="text-xs text-muted-foreground">כל הערכים מחושבים אוטומטית. אפשר לדרוס כל ערך כדי להתאים לחוקי הבית.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ABILITIES.map(a => (
          <div key={a} className="p-3 rounded-md bg-background/40 border border-border">
            <div className="display text-sm text-primary">{ABILITY_LABELS[a]}</div>
            <div className="text-xs text-muted-foreground">מחושב: {d.abilities[a]} ({formatMod(d.abilityMods[a])})</div>
            <input type="number" placeholder="דריסה ידנית"
              value={c.manualOverrides?.abilities?.[a] ?? ""}
              onChange={e => update({ manualOverrides: { ...(c.manualOverrides ?? {}), abilities: { ...(c.manualOverrides?.abilities ?? {}), [a]: e.target.value === "" ? undefined : +e.target.value } } })}
              className="input w-full mt-1 text-sm" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <OverrideStat label="HP מקס" computed={d.hpMax} value={c.hpMax} onChange={v => update({ hpMax: v })} />
        <OverrideStat label="AC" computed={d.ac} value={c.acOverride} onChange={v => update({ acOverride: v })} />
        <OverrideStat label="מהירות (ft)" computed={d.speed} value={c.speedOverride} onChange={v => update({ speedOverride: v })} />
        <OverrideStat label="יוזמה" computed={d.initiative} value={c.manualOverrides?.initiative} onChange={v => setOverride("initiative", v)} />
        {d.spellSaveDc !== undefined && <OverrideStat label="Spell DC" computed={d.spellSaveDc} value={c.manualOverrides?.spellSaveDc} onChange={v => setOverride("spellSaveDc", v)} />}
        {d.spellAttackBonus !== undefined && <OverrideStat label="בונוס התקפת קסם" computed={d.spellAttackBonus} value={c.manualOverrides?.spellAttackBonus} onChange={v => setOverride("spellAttackBonus", v)} />}
        <OverrideStat label="בונוס בקיאות" computed={d.proficiencyBonus} value={c.manualOverrides?.proficiencyBonus} onChange={v => setOverride("proficiencyBonus", v)} />
      </div>
      <div className="p-3 rounded-md bg-background/40 border border-border text-sm">
        <b className="text-primary">תנועה:</b> {d.walking.ftPerTurn}ft/תור · {d.walking.ftPerMin}ft/דקה · {d.walking.kmPerHour} ק״מ/שעה
      </div>
      <textarea value={c.notes ?? ""} onChange={e => update({ notes: e.target.value })} placeholder="הערות והיסטוריה לדמות..." className="input w-full min-h-[100px]" />
    </div>
  );
}

function OverrideStat({ label, computed, value, onChange }: { label: string; computed: number; value?: number; onChange: (v?: number) => void }) {
  return (
    <div className="p-3 rounded-md bg-background/40 border border-border">
      <div className="display text-sm text-primary">{label}</div>
      <div className="text-xs text-muted-foreground">מחושב: {computed}</div>
      <input type="number" placeholder="דריסה" value={value ?? ""} onChange={e => onChange(e.target.value === "" ? undefined : +e.target.value)} className="input w-full mt-1 text-sm" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}
