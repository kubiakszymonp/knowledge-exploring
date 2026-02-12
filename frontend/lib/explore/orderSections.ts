import type { Section, ThematicScores } from "@/model/pilot/types";
import type { UserPreferences, InterestTag } from "@/model/UserPreferences";

const IMPORTANCE_WEIGHT = 1;
const THEMATIC_WEIGHT = 0.3;

const INTEREST_TO_THEME: Partial<Record<InterestTag, keyof ThematicScores>> = {
  architecture: "architecture",
  history: "history",
  curiosities: "curiosity",
  legends: "culture",
  art: "culture",
  culture: "culture",
  defense: "military",
  daily_life: "culture",
  conflicts: "military",
};

function computeThematicScore(
  section: Section,
  preferences: UserPreferences
): number {
  const scores = section.thematicScores;
  if (!scores || preferences.interests.length === 0) return 0;

  let total = 0;
  let count = 0;

  for (const interest of preferences.interests) {
    const theme = INTEREST_TO_THEME[interest];
    if (!theme) continue;
    const value = scores[theme];
    if (typeof value === "number") {
      total += value;
      count += 1;
    }
  }

  if (count === 0) return 0;
  return total / count;
}

function computeCombinedScore(
  section: Section,
  preferences: UserPreferences
): number {
  const importanceComponent = section.importance * IMPORTANCE_WEIGHT;
  const thematicComponent =
    computeThematicScore(section, preferences) * THEMATIC_WEIGHT;
  return importanceComponent + thematicComponent;
}

export function orderSections(
  sections: Section[],
  preferences: UserPreferences
): Section[] {
  if (sections.length <= 1) {
    return sections.slice();
  }

  const scored = sections.map((section) => ({
    section,
    score: computeCombinedScore(section, preferences),
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.section.importance !== a.section.importance) {
      return b.section.importance - a.section.importance;
    }
    return a.section.id.localeCompare(b.section.id);
  });

  return scored.map((item) => item.section);
}

