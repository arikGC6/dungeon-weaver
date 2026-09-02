import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

/**
 * Small persistent gallery of race illustrations (raceId -> data URL).
 * Saved in localStorage so an image the player uploads once stays forever,
 * for every character they build afterwards.
 */
interface RacePortraitStore {
  portraits: Record<string, string>;
  setPortrait: (raceId: string, dataUrl: string) => void;
  clearPortrait: (raceId: string) => void;
}

export const useRacePortraits = create<RacePortraitStore>()(
  persist(
    (set) => ({
      portraits: {},
      setPortrait: (raceId, dataUrl) => set(s => ({ portraits: { ...s.portraits, [raceId]: dataUrl } })),
      clearPortrait: (raceId) => set(s => {
        const next = { ...s.portraits };
        delete next[raceId];
        return { portraits: next };
      }),
    }),
    { name: "magic-tavern-race-portraits", version: 1, skipHydration: true },
  ),
);

let started = false;
/** Hydrate the portrait gallery on the client (SSR-safe). */
export function useHydrateRacePortraits() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const api = (useRacePortraits as any).persist;
    if (!started) { started = true; void api?.rehydrate?.(); }
    const unsub = api?.onFinishHydration?.(() => setReady(true));
    if (api?.hasHydrated?.()) setReady(true);
    return unsub;
  }, []);
  return ready;
}

/** Read an uploaded image file as a compressed data URL (max 768px — high quality). */
export function readImageAsDataUrl(file: File, max = 768): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("קריאת התמונה נכשלה"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("קובץ תמונה לא תקין"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
