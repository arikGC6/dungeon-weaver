import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Character } from "./dnd-types";

interface CharacterStore {
  characters: Character[];
  saveCharacter: (c: Character) => void;
  deleteCharacter: (id: string) => void;
  duplicate: (id: string) => string | null;
  getCharacter: (id: string) => Character | undefined;
}

export const useCharacters = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],
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
    { name: "magic-tavern-characters", version: 1 }
  )
);
