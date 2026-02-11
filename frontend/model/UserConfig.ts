import type { ArticleStyle, EdgeStyle } from "@/lib/loadStylizations";
import type { UserPreferences } from "./UserPreferences";
import { getDefaultPreferences } from "@/lib/userPreferences";

export interface UserConfig extends UserPreferences {
  articleStyle: ArticleStyle;
  edgeStyle: EdgeStyle;
}

export function getDefaultUserConfig(): UserConfig {
  return {
    ...getDefaultPreferences(),
    articleStyle: "adult",
    edgeStyle: "informative",
  };
}
