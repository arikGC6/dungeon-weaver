import { useEffect, useState } from "react";

const SHARE_TEXT = "בר הקסמים — בונה דמויות D&D 5e בעברית. שב, הזמן משקה, וצור גיבור:";

export function ShareApp() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.origin + "/");
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const copy = async (value: string, which: "link" | "text") => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(which);
    setTimeout(() => setCopied(null), 1800);
  };

  const fullText = `${SHARE_TEXT} ${url}`;
  const enc = encodeURIComponent(fullText);

  const nativeShare = async () => {
    try {
      await navigator.share({ title: "בר הקסמים", text: SHARE_TEXT, url });
    } catch {
      /* בוטל ע"י המשתמש */
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="display text-2xl text-primary">שתף את הטברנה</h2>
        <div className="flex-1 gold-divider"></div>
      </div>

      <div className="tavern-card p-5">
        <p className="text-sm text-muted-foreground mb-4">
          שלח לחברים קישור לאתר — כל אחד יכול לבנות דמות משלו. אפשר גם להעתיק את הטקסט המלא ולהדביק בקבוצה.
        </p>

        <div className="flex items-stretch gap-2 mb-4">
          <input
            readOnly
            value={url}
            onFocus={e => e.currentTarget.select()}
            dir="ltr"
            className="flex-1 min-w-0 rounded-md bg-secondary border border-border px-3 py-2 text-sm"
            aria-label="קישור לאתר"
          />
          <button
            onClick={() => copy(url, "link")}
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 whitespace-nowrap"
          >
            {copied === "link" ? "✓ הועתק" : "העתק קישור"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {canNativeShare && (
            <button onClick={nativeShare} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">
              📤 שתף…
            </button>
          )}
          <a
            href={`https://wa.me/?text=${enc}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md bg-secondary border border-border text-sm hover:bg-accent"
          >
            💬 WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(SHARE_TEXT)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md bg-secondary border border-border text-sm hover:bg-accent"
          >
            ✈️ Telegram
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent("בר הקסמים — בונה דמויות D&D")}&body=${enc}`}
            className="px-3 py-1.5 rounded-md bg-secondary border border-border text-sm hover:bg-accent"
          >
            ✉️ מייל
          </a>
          <button
            onClick={() => copy(fullText, "text")}
            className="px-3 py-1.5 rounded-md bg-secondary border border-border text-sm hover:bg-accent"
          >
            {copied === "text" ? "✓ הועתק" : "📋 העתק טקסט הזמנה"}
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          רוצה לשתף דמות ספציפית? ייצא אותה ל-JSON מכרטיס הדמות ושלח את הקובץ — החבר טוען אותו דרך "טען JSON".
        </p>
      </div>
    </section>
  );
}
