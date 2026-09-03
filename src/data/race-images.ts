// Default illustrations per race (CDN assets). Players can still upload their own,
// which overrides these via the race-portraits gallery.
import human from "../assets/races/human.jpg.asset.json";
import elf from "../assets/races/elf.jpg.asset.json";
import halfElf from "../assets/races/half-elf.jpg.asset.json";
import halfOrc from "../assets/races/half-orc.jpg.asset.json";
import dragonborn from "../assets/races/dragonborn.jpg.asset.json";
import tiefling from "../assets/races/tiefling.jpg.asset.json";
import tabaxi from "../assets/races/tabaxi.jpg.asset.json";
import kenku from "../assets/races/kenku.jpg.asset.json";
import warforged from "../assets/races/warforged.jpg.asset.json";
import autognome from "../assets/races/autognome.jpg.asset.json";

export const DEFAULT_RACE_IMAGES: Record<string, string> = {
  human: human.url,
  elf: elf.url,
  "half-elf": halfElf.url,
  "half-orc": halfOrc.url,
  dragonborn: dragonborn.url,
  tiefling: tiefling.url,
  tabaxi: tabaxi.url,
  kenku: kenku.url,
  warforged: warforged.url,
  autognome: autognome.url,
};

export function defaultRaceImage(raceId: string): string | undefined {
  return DEFAULT_RACE_IMAGES[raceId];
}
