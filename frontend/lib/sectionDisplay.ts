import type { Section } from "@/model/pilot/types";

export type ContentStyle = "default" | "children" | "casual";

/**
 * Resolves section title and content for the given style.
 * If style is not "default" and section has a variant for that style, uses it;
 * otherwise returns the default title and content.
 */
export function getSectionDisplay(
  section: Section,
  style: string
): { title: string; content: string } {
  if (style !== "default" && section.variants?.[style]) {
    const v = section.variants[style];
    return {
      title: v.title ?? section.title,
      content: v.content,
    };
  }
  return { title: section.title, content: section.content };
}
