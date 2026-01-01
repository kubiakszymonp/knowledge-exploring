// Funkcje do zarządzania preferencjami użytkownika w localStorage

import { UserPreferences, NarrativeStyle, InterestTag, DepthPreference, ContentMode } from "@/model/UserPreferences";

const PREFERENCES_KEY = "userPreferences";

export function savePreferences(preferences: UserPreferences): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }
}

export function loadPreferences(): UserPreferences | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as UserPreferences;
      } catch (e) {
        console.warn("Failed to parse user preferences:", e);
      }
    }
  }
  return null;
}

export function getDefaultPreferences(): UserPreferences {
  return {
    style: "neutral",
    interests: [],
    depth: "normal",
    mode: "hybrid",
  };
}

export function getPreferences(): UserPreferences {
  return loadPreferences() || getDefaultPreferences();
}



