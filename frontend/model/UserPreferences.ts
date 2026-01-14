// Typy preferencji użytkownika z ankiety

export type NarrativeStyle = "kids" | "humorous" | "neutral" | "serious" | "adult" | "fairy";

export type InterestTag = 
  | "architecture" 
  | "history" 
  | "curiosities" 
  | "legends" 
  | "art" 
  | "culture" 
  | "defense" 
  | "daily_life" 
  | "conflicts";

export type DepthPreference = "short" | "normal" | "deep";

export type ContentMode = "audio" | "text" | "hybrid";

export interface UserPreferences {
  style: NarrativeStyle;
  interests: InterestTag[];
  depth: DepthPreference;
  mode: ContentMode;
}

// Mapowanie stylów narracji na style artykułów
export function mapNarrativeStyleToArticleStyle(style: NarrativeStyle): "adult" | "kids" | "vulgar" {
  switch (style) {
    case "kids":
      return "kids";
    case "adult":
      return "vulgar";
    case "humorous":
    case "neutral":
    case "serious":
    case "fairy":
    default:
      return "adult";
  }
}

// Mapowanie tagów zainteresowań na tagi węzłów
export function mapInterestTagToNodeTag(interest: InterestTag): string {
  const mapping: Record<InterestTag, string> = {
    architecture: "architektura",
    history: "historia",
    curiosities: "ciekawostki",
    legends: "legendy",
    art: "sztuka",
    culture: "kultura",
    defense: "militaria",
    daily_life: "codzienne życie",
    conflicts: "konflikty",
  };
  return mapping[interest] || interest;
}

// Obliczanie importance boost dla tagów
export function getImportanceBoost(preferences: UserPreferences, nodeTags: string[]): number {
  let boost = 0;
  
  for (const interest of preferences.interests) {
    const nodeTag = mapInterestTagToNodeTag(interest);
    if (nodeTags.includes(nodeTag)) {
      // Priorytetowe zainteresowania dostają większy boost
      boost += 3;
    }
  }
  
  return boost;
}

// Sprawdzanie czy node powinien być pokazany na podstawie głębokości
export function shouldShowNode(
  preferences: UserPreferences,
  nodeImportance: number,
  hasBoost: boolean
): boolean {
  const baseImportance = nodeImportance + (hasBoost ? 3 : 0);
  
  switch (preferences.depth) {
    case "short":
      return baseImportance >= 7;
    case "normal":
      return baseImportance >= 5;
    case "deep":
      return true;
    default:
      return true;
  }
}




