import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { useCharacters, useHydrateCharacters } from "@/lib/character-store";
import { getRace, getClass } from "@/lib/calculations";
import { importCharacterJson, exportCharacterJson, exportCharacterPdf } from "@/lib/export-pdf";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "בר הקסמים — בונה דמויות D&D 5e" },
      { name: "description", content: "צור דמות D&D 5e בעברית: גזעים, קלאסים, כישופים, פריטים. ייצוא ל-PDF ו-JSON." },
      { property: "og:title", content: "בר הקסמים — בונה דמויות D&D" },
      { property: "og:description", content: "אשף יצירת דמויות מלא בעברית עם עיצוב פנטזיה." },
    ],
  }),
  component: Home,
});

function Home() {
  const hydrated = useHydrateCharacters();
  const { characters, deleteCharacter, duplicate, saveCharacter } = useCharacters();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const c = await importCharacterJson(file);
      saveCharacter(c);
      navigate({ to: "/character/$id", params: { id: c.id } });
    } catch (err: any) {
      alert("שגיאה בטעינת קובץ: " + err.message);
    }
    e.target.value = "";
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="text-center mb-12 relative">
        <div className="inline-block">
          <h1 className="display text-5xl md:text-6xl text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">בר הקסמים</h1>
          <div className="gold-divider my-3"></div>
          <p className="text-muted-foreground text-lg">בונה דמויות D&amp;D 5e — שב, הזמן משקה, ובוא נצור גיבור</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Link to="/builder" search={{ edit: undefined }} className="tavern-card p-6 text-center hover:ember-glow transition-all">
          <div className="text-4xl mb-2">⚔️</div>
          <h2 className="display text-xl text-primary mb-1">דמות חדשה</h2>
          <p className="text-sm text-muted-foreground">פתח אשף יצירת דמות</p>
        </Link>
        <button
          onClick={() => fileRef.current?.click()}
          className="tavern-card p-6 text-center hover:ember-glow transition-all cursor-pointer"
        >
          <div className="text-4xl mb-2">📜</div>
          <h2 className="display text-xl text-primary mb-1">טען JSON</h2>
          <p className="text-sm text-muted-foreground">החזר דמות שיצאת בעבר</p>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} />
        </button>
        <a href="https://dnd5e.wikidot.com/" target="_blank" rel="noopener noreferrer" className="tavern-card p-6 text-center hover:ember-glow transition-all">
          <div className="text-4xl mb-2">📚</div>
          <h2 className="display text-xl text-primary mb-1">מקורות D&amp;D</h2>
          <p className="text-sm text-muted-foreground">wikidot · DnD Beyond</p>
        </a>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="display text-2xl text-primary">המגילות שלך</h2>
          <div className="flex-1 gold-divider"></div>
          <span className="text-sm text-muted-foreground">{characters.length} דמויות שמורות</span>
        </div>

        {!hydrated ? (
          <div className="tavern-card p-10 text-center text-muted-foreground">
            <div className="text-5xl mb-2 animate-pulse">🕯️</div>
            טוען את המגילות מהמרתף…
          </div>
        ) : characters.length === 0 ? (
          <div className="tavern-card p-10 text-center text-muted-foreground">
            <div className="text-5xl mb-2">🕯️</div>
            אין דמויות שמורות עדיין. צור את הראשונה כדי להתחיל את ההרפתקה.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map(c => {
              const race = getRace(c.raceId);
              const cls = getClass(c.classId);
              return (
                <div key={c.id} className="tavern-card p-4 flex gap-3">
                  {c.portrait ? (
                    <img src={c.portrait} alt={c.name} className="w-20 h-20 rounded-md object-cover border border-border" />
                  ) : (
                    <div className="w-20 h-20 rounded-md bg-secondary border border-border flex items-center justify-center text-3xl">🧙</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link to="/character/$id" params={{ id: c.id }} className="block">
                      <h3 className="display text-lg text-primary truncate">{c.name || "ללא שם"}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {race?.nameHe ?? "—"} · {cls?.nameHe ?? "—"} · רמה {c.level}
                      </p>
                    </Link>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <button onClick={() => exportCharacterPdf(c)} className="text-[11px] px-2 py-0.5 rounded bg-primary text-primary-foreground hover:opacity-90">PDF</button>
                      <button onClick={() => exportCharacterJson(c)} className="text-[11px] px-2 py-0.5 rounded bg-secondary hover:bg-accent">JSON</button>
                      <button onClick={() => { const id = duplicate(c.id); if (id) navigate({ to: "/character/$id", params: { id } }); }} className="text-[11px] px-2 py-0.5 rounded bg-secondary hover:bg-accent">שכפל</button>
                      <button onClick={() => { if (confirm("למחוק את " + c.name + "?")) deleteCharacter(c.id); }} className="text-[11px] px-2 py-0.5 rounded bg-destructive/80 text-destructive-foreground hover:bg-destructive">מחק</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="mt-16 text-center text-xs text-muted-foreground">
        מקורות: dnd5e.wikidot.com · dndbeyond.com · נתונים בסגנון SRD לצורך נוחות המשתמש.
      </footer>
    </div>
  );
}
