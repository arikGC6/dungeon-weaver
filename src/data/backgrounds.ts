import type { Background } from "../lib/dnd-types";

export const BACKGROUNDS: Background[] = [
  { id: "acolyte", name: "Acolyte", nameHe: "שמש מקדש", skills: ["insight", "religion"], languages: 2,
    description: "שירתת במקדש. Shelter of the Faithful." },
  { id: "criminal", name: "Criminal", nameHe: "פושע", skills: ["deception", "stealth"], languages: 0,
    description: "עברך אפל. קשר עבריינים." },
  { id: "folk_hero", name: "Folk Hero", nameHe: "גיבור העם", skills: ["animal_handling", "survival"], languages: 0,
    description: "ילד הכפר שעשה מעשה גבורה." },
  { id: "noble", name: "Noble", nameHe: "אציל", skills: ["history", "persuasion"], languages: 1,
    description: "Position of Privilege." },
  { id: "sage", name: "Sage", nameHe: "חכם", skills: ["arcana", "history"], languages: 2,
    description: "חוקר שיודע איפה למצוא תשובות." },
  { id: "soldier", name: "Soldier", nameHe: "חייל", skills: ["athletics", "intimidation"], languages: 0,
    description: "Military Rank — שמירת דרגה." },
  { id: "outlander", name: "Outlander", nameHe: "נווד", skills: ["athletics", "survival"], languages: 1,
    description: "מצא דרך בכל טבע." },
  { id: "charlatan", name: "Charlatan", nameHe: "נוכל מקצועי", skills: ["deception", "sleight_of_hand"], languages: 0,
    description: "False Identity." },
  { id: "entertainer", name: "Entertainer", nameHe: "בדרן", skills: ["acrobatics", "performance"], languages: 0,
    description: "By Popular Demand." },
  { id: "guild_artisan", name: "Guild Artisan", nameHe: "אומן גילדה", skills: ["insight", "persuasion"], languages: 1,
    description: "Guild Membership." },
  { id: "hermit", name: "Hermit", nameHe: "פרוש", skills: ["medicine", "religion"], languages: 1,
    description: "Discovery." },
  { id: "sailor", name: "Sailor", nameHe: "מלח", skills: ["athletics", "perception"], languages: 0,
    description: "Ship's Passage." },
  { id: "urchin", name: "Urchin", nameHe: "ילד-רחוב", skills: ["sleight_of_hand", "stealth"], languages: 0,
    description: "City Secrets." },
];

export const getBackground = (id?: string) => BACKGROUNDS.find(b => b.id === id);
