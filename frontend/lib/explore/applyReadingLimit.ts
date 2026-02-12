import type { Section } from "@/model/pilot/types";
import type { DepthPreference } from "@/model/UserPreferences";
import {
  estimateMinutesForText,
  DEFAULT_WORDS_PER_MINUTE,
} from "@/lib/readingTime";

export interface SectionWithVisibility {
  section: Section;
  hidden: boolean;
}

interface ApplyReadingLimitOptions {
  getContent: (section: Section) => string;
  depth: DepthPreference;
  wordsPerMinute?: number;
}

function estimateReadingTimeMinutes(
  section: Section,
  getContent: (section: Section) => string,
  wordsPerMinute: number
): number {
  if (typeof section.readingTimeSec === "number" && section.readingTimeSec > 0) {
    return section.readingTimeSec / 60;
  }
  return estimateMinutesForText(getContent(section), wordsPerMinute);
}

function getMaxMinutesForDepth(depth: DepthPreference): number {
  switch (depth) {
    case "short":
      return 1;
    case "normal":
      return 3;
    case "deep":
      return 5;
    default:
      return 5;
  }
}

export function applyReadingLimit(
  sections: Section[],
  options: ApplyReadingLimitOptions
): SectionWithVisibility[] {
  const { getContent, depth, wordsPerMinute = DEFAULT_WORDS_PER_MINUTE } = options;

  if (sections.length === 0) {
    return [];
  }

  const maxMinutes = getMaxMinutesForDepth(depth);
  const sectionMinutes = sections.map((section) =>
    estimateReadingTimeMinutes(section, getContent, wordsPerMinute)
  );

  let totalMinutes = 0;

  return sections.map((section, i) => {
    const minutes = sectionMinutes[i];
    const shouldShow = totalMinutes === 0 || totalMinutes + minutes <= maxMinutes;

    if (shouldShow) {
      totalMinutes += minutes;
      return { section, hidden: false };
    }
    return { section, hidden: true };
  });
}

