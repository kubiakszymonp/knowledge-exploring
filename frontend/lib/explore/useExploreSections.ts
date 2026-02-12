"use client";

import { useMemo } from "react";
import type { Section } from "@/model/pilot/types";
import type { ContentStyle } from "@/lib/sectionDisplay";
import { getSectionDisplay } from "@/lib/sectionDisplay";
import { useUserConfig } from "@/contexts/UserConfigContext";
import { orderSections } from "@/lib/explore/orderSections";
import {
  applyReadingLimit,
  type SectionWithVisibility,
} from "@/lib/explore/applyReadingLimit";

export interface ResolvedSectionWithVisibility extends SectionWithVisibility {
  title: string;
  content: string;
}

export function useExploreSections(
  sections: Section[],
  contentStyle: ContentStyle
): ResolvedSectionWithVisibility[] {
  const { config } = useUserConfig();

  return useMemo(() => {
    if (!sections.length) return [];

    const ordered = orderSections(sections, config);
    const withVisibility = applyReadingLimit(ordered, {
      depth: config.depth,
      getContent: (section) => getSectionDisplay(section, contentStyle).content,
    });

    return withVisibility.map(({ section, hidden }) => {
      const display = getSectionDisplay(section, contentStyle);
      return {
        section,
        hidden,
        title: display.title,
        content: display.content,
      };
    });
  }, [sections, contentStyle, config]);
}

