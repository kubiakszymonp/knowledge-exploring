import type { UserPreferences } from "@/model/UserPreferences";

export function getDefaultPreferences(): UserPreferences {
  return {
    style: "neutral",
    interests: [],
    depth: "normal",
  };
}
