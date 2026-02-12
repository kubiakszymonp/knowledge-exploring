import type { Section } from "@/model/pilot/types";
import type { DepthPreference } from "@/model/UserPreferences";

export interface SectionWithVisibility {
  section: Section;
  hidden: boolean;
}

interface ApplyReadingLimitOptions {
  getContent: (section: Section) => string;
  depth: DepthPreference;
  wordsPerMinute?: number;
}

const DEFAULT_WORDS_PER_MINUTE = 200;

function estimateReadingTimeMinutes(
  section: Section,
  getContent: (section: Section) => string,
  wordsPerMinute: number
): number {
  if (typeof section.readingTimeSec === "number" && section.readingTimeSec > 0) {
    return section.readingTimeSec / 60;
  }

  const text = getContent(section);
  if (!text.trim()) return 0;

  const words = text.trim().split(/\s+/).length;
  return words / wordsPerMinute;
}

function getMaxMinutesForDepth(depth: DepthPreference): number | null {
  switch (depth) {
    case "short":
      return 2;
    case "normal":
      return 5;
    case "deep":
    default:
      return null;
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
  // For deep reading we always show everything
  if (maxMinutes == null) {
    return sections.map((section) => ({ section, hidden: false }));
  }

  let totalMinutes = 0;
  let visibleCount = 0;

  return sections.map((section) => {
    const minutes = estimateReadingTimeMinutes(section, getContent, wordsPerMinute);

    const shouldShow =
      visibleCount === 0 || totalMinutes + minutes <= maxMinutes;

    if (shouldShow) {
      visibleCount += 1;
      totalMinutes += minutes;
      return { section, hidden: false };
    }

    return { section, hidden: true };
  });
}

