import type {
  NarrativeStyle,
  InterestTag,
  DepthPreference,
} from "@/model/UserPreferences";

export const NARRATIVE_STYLES: Array<{
  value: NarrativeStyle;
  emoji: string;
  label: string;
}> = [
  { value: "kids", emoji: "🧒", label: "Dla dzieci" },
  { value: "humorous", emoji: "😀", label: "Zabawne" },
  { value: "vulgar", emoji: "🔞", label: "Wulgarne" },
  { value: "neutral", emoji: "🙂", label: "Neutralne" },
];

export const INTERESTS: Array<{ value: InterestTag; emoji: string; label: string }> = [
  { value: "architecture", emoji: "🏰", label: "Architektura" },
  { value: "history", emoji: "⚔️", label: "Historia" },
  { value: "curiosities", emoji: "🧩", label: "Ciekawostki" },
  { value: "legends", emoji: "🎭", label: "Legendy i mity" },
  { value: "art", emoji: "🎨", label: "Sztuka i symbolika" },
  { value: "culture", emoji: "🌍", label: "Kontekst kulturowy" },
  { value: "defense", emoji: "🛡", label: "Obrona i wojskowość" },
  { value: "daily_life", emoji: "🏛", label: "Codzienne życie dawniej" },
  { value: "conflicts", emoji: "💣", label: "Konflikty i dramaty historii" },
];

export const DEPTH_OPTIONS: Array<{
  value: DepthPreference;
  emoji: string;
  label: string;
  description: string;
}> = [
  { value: "short", emoji: "⏱", label: "Krótko", description: "Najważniejsze info" },
  { value: "normal", emoji: "🚶", label: "Na spokojnie", description: "To, co ciekawe" },
  { value: "deep", emoji: "🧠", label: "Dogłębnie", description: "Chcę wszystko poznać" },
];
