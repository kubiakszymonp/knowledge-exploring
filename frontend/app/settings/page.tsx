"use client";

import { AppHeader } from "@/components/AppHeader";
import { useUserConfig } from "@/contexts/UserConfigContext";
import { getDefaultUserConfig } from "@/model/UserConfig";
import type { NarrativeStyle, InterestTag, DepthPreference, ContentMode } from "@/model/UserPreferences";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  NARRATIVE_STYLES,
  INTERESTS,
  DEPTH_OPTIONS,
  MODE_OPTIONS,
} from "@/lib/settingsOptions";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { config, updateConfig } = useUserConfig();

  const handleInterestToggle = (interest: InterestTag) => {
    const next = config.interests.includes(interest)
      ? config.interests.filter((i) => i !== interest)
      : [...config.interests, interest];
    if (next.length <= 4) updateConfig({ interests: next });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader title="Ustawienia" backHref="/" backBehavior="history" />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-800 mb-2">
            Preferencje użytkownika
          </h2>
          <p className="text-stone-600">
            Dostosuj sposób, w jaki aplikacja prezentuje treści
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Styl narracji
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {NARRATIVE_STYLES.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateConfig({ style: opt.value as NarrativeStyle })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    config.style === opt.value
                      ? "border-amber-500 bg-amber-50"
                      : "border-stone-200 bg-white hover:border-amber-300"
                  )}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-sm font-medium text-stone-700">{opt.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-2">
              Zainteresowania
            </h3>
            <p className="text-sm text-stone-500 mb-4">
              Wybierz 2–4 rzeczy, które Cię najbardziej interesują
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTERESTS.map((opt) => {
                const isSelected = config.interests.includes(opt.value);
                const disabled =
                  !isSelected && config.interests.length >= 4;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleInterestToggle(opt.value)}
                    disabled={disabled}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      isSelected
                        ? "border-amber-500 bg-amber-50"
                        : disabled
                        ? "border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed"
                        : "border-stone-200 bg-white hover:border-amber-300"
                    )}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-xs font-medium text-stone-700 text-center">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p
              className={cn(
                "text-sm mt-2",
                config.interests.length >= 2 && config.interests.length <= 4
                  ? "text-amber-600"
                  : "text-stone-500"
              )}
            >
              Wybrano: {config.interests.length} / 4
              {config.interests.length < 2 && " (wybierz minimum 2)"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Głębokość zwiedzania
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DEPTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateConfig({ depth: opt.value })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all",
                    config.depth === opt.value
                      ? "border-amber-500 bg-amber-50"
                      : "border-stone-200 bg-white hover:border-amber-300"
                  )}
                >
                  <span className="text-4xl">{opt.emoji}</span>
                  <span className="font-medium text-stone-800">{opt.label}</span>
                  <span className="text-sm text-stone-500">{opt.description}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Tryb odbioru
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateConfig({ mode: opt.value as ContentMode })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all",
                    config.mode === opt.value
                      ? "border-amber-500 bg-amber-50"
                      : "border-stone-200 bg-white hover:border-amber-300"
                  )}
                >
                  <span className="text-4xl">{opt.emoji}</span>
                  <span className="font-medium text-stone-800">{opt.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => updateConfig(getDefaultUserConfig())}
            >
              Resetuj do domyślnych
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
