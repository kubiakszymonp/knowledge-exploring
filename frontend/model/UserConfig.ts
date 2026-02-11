import type { UserPreferences } from "./UserPreferences";
import { getDefaultPreferences } from "@/lib/userPreferences";

export interface UserConfig extends UserPreferences {}

export function getDefaultUserConfig(): UserConfig {
  return {
    ...getDefaultPreferences(),
  };
}
