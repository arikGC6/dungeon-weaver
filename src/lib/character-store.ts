import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { Character } from "./dnd-types";

interface CharacterStore {
  characters: Character[];
  _hydrated: boolean;
  setHydrated: (v: boolean) => void;
  saveCharacter: (c: Character) => void;
  deleteCharacter: (id: string) => void;
  duplicate: (id: string) => string | null;
  getCharacter: (id: string) => Character | undefined;
}

export const useCharacters = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],
      _hydrated: false,
      setHydrated: (v) => set({ _hydrated: v }),
      saveCharacter: (c) => set(state => {
        const updated = { ...c, updatedAt: Date.now() };
        const exists = state.characters.findIndex(x => x.id === c.id);
        if (exists >= 0) {
          const copy = [...state.characters];
          copy[exists] = updated;
          return { characters: copy };
        }
        return { characters: [...state.characters, updated] };
      }),
      deleteCharacter: (id) => set(state => ({ characters: state.characters.filter(c => c.id !== id) })),
      duplicate: (id) => {
        const c = get().characters.find(x => x.id === id);
        if (!c) return null;
        const copy = { ...c, id: crypto.randomUUID(), name: c.name + " (עותק)", createdAt: Date.now(), updatedAt: Date.now() };
        set(state => ({ characters: [...state.characters, copy] }));
        return copy.id;
      },
      getCharacter: (id) => get().characters.find(c => c.id === id),
    }),
    {
      name: "magic-tavern-characters",
      version: 1,
      // Avoid SSR/hydration flicker: skip auto-hydration, do it manually on the client
      skipHydration: true,
      partialize: (s) => ({ characters: s.characters }) as any,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Trigger hydration once on the client after mount. Prevents the
// "characters list flashes empty then re-appears" race during SSR/CSR boot.
let _hydrationStarted = false;
export function useHydrateCharacters() {
  const [ready, setReady] = useState(useCharacters.persist.hasHydrated());
  useEffect(() => {
    if (!_hydrationStarted) {
      _hydrationStarted = true;
      // rehydrate from localStorage now that we know we're on the client
      void useCharacters.persist.rehydrate();
    }
    const unsub = useCharacters.persist.onFinishHydration(() => setReady(true));
    if (useCharacters.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);
  return ready;
}
