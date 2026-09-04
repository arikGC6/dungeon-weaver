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
import plasmoid from "../assets/races/plasmoid.jpg.asset.json";
import owlin from "../assets/races/owlin.jpg.asset.json";
import aarakocra from "../assets/races/aarakocra.jpg.asset.json";
import thriKreen from "../assets/races/thri-kreen.jpg.asset.json";
import hexblood from "../assets/races/hexblood.jpg.asset.json";
import halfling from "../assets/races/halfling.jpg.asset.json";
import dwarf from "../assets/races/dwarf.jpg.asset.json";
import gnome from "../assets/races/gnome.jpg.asset.json";
import aasimar from "../assets/races/aasimar.jpg.asset.json";
import harengon from "../assets/races/harengon.jpg.asset.json";

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
  plasmoid: plasmoid.url,
  owlin: owlin.url,
  aarakocra: aarakocra.url,
  "thri-kreen": thriKreen.url,
  hexblood: hexblood.url,
  halfling: halfling.url,
  dwarf: dwarf.url,
  gnome: gnome.url,
  aasimar: aasimar.url,
  harengon: harengon.url,
};


export function defaultRaceImage(raceId: string): string | undefined {
  return DEFAULT_RACE_IMAGES[raceId];
}
