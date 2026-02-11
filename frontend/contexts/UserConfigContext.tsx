"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UserConfig } from "@/model/UserConfig";
import { getDefaultUserConfig } from "@/model/UserConfig";

const STORAGE_KEY = "userConfig";

function loadConfig(): UserConfig {
  if (typeof window === "undefined") return getDefaultUserConfig();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultUserConfig();
    const parsed = JSON.parse(raw) as UserConfig;
    return { ...getDefaultUserConfig(), ...parsed };
  } catch {
    return getDefaultUserConfig();
  }
}

interface UserConfigContextValue {
  config: UserConfig;
  updateConfig: (partial: Partial<UserConfig>) => void;
}

const UserConfigContext = createContext<UserConfigContextValue | null>(null);

export function UserConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<UserConfig>(getDefaultUserConfig);

  useEffect(() => {
    setConfig(loadConfig());
  }, []);

  const updateConfig = useCallback((partial: Partial<UserConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ config, updateConfig }),
    [config, updateConfig]
  );

  return (
    <UserConfigContext.Provider value={value}>
      {children}
    </UserConfigContext.Provider>
  );
}

export function useUserConfig(): UserConfigContextValue {
  const ctx = useContext(UserConfigContext);
  if (!ctx) throw new Error("useUserConfig must be used within UserConfigProvider");
  return ctx;
}
