import type { Section, ThematicScores } from "@/model/pilot/types";
import type { UserPreferences, InterestTag } from "@/model/UserPreferences";

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

/** Sort by importance first; interests only break ties when importance is equal. */
export function orderSections(
  sections: Section[],
  preferences: UserPreferences
): Section[] {
  if (sections.length <= 1) {
    return sections.slice();
  }

  const withThematic = sections.map((section) => ({
    section,
    thematic: computeThematicScore(section, preferences),
  }));

  withThematic.sort((a, b) => {
    if (b.section.importance !== a.section.importance) {
      return b.section.importance - a.section.importance;
    }
    if (b.thematic !== a.thematic) {
      return b.thematic - a.thematic;
    }
    return a.section.id.localeCompare(b.section.id);
  });

  return withThematic.map((item) => item.section);
}

