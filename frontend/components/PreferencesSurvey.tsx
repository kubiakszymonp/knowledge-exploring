"use client";

import { useState } from "react";
import { UserPreferences, NarrativeStyle, InterestTag, DepthPreference, ContentMode } from "@/model/UserPreferences";
import { savePreferences } from "@/lib/userPreferences";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PreferencesSurveyProps {
  initialPreferences?: UserPreferences;
  onComplete?: (preferences: UserPreferences) => void;
  onCancel?: () => void;
}

const STEPS = [
  { id: 1, title: "Styl narracji" },
  { id: 2, title: "Zainteresowania" },
  { id: 3, title: "Głębokość zwiedzania" },
  { id: 4, title: "Tryb odbioru" },
] as const;

const NARRATIVE_STYLES: Array<{ value: NarrativeStyle; emoji: string; label: string }> = [
  { value: "kids", emoji: "🧒", label: "Dla dzieci" },
  { value: "humorous", emoji: "😀", label: "Lekko i humorystycznie" },
  { value: "neutral", emoji: "🙂", label: "Neutralnie" },
  { value: "serious", emoji: "📚", label: "Poważnie / historycznie" },
  { value: "adult", emoji: "🔞", label: "Dla dorosłych" },
  { value: "fairy", emoji: "🪄", label: "Fantazyjnie / opowieściowe" },
];

const INTERESTS: Array<{ value: InterestTag; emoji: string; label: string }> = [
  { value: "architecture", emoji: "🏰", label: "Architektura" },
  { value: "history", emoji: "⚔️", label: "Historia" },
  { value: "curiosities", emoji: "🧩", label: "Ciekawostki" },
  { value: "legends", emoji: "🎭", label: "Legendy i mity" },
  { value: "art", emoji: "🎨", label: "Sztuka i symbolika" },
  { value: "culture", emoji: "🌍", label: "Kontekst kulturowy" },
  { value: "defense", emoji: "🛡", label: "Obrona i wojskowość" },
  { value: "daily_life", emoji: "🏛", label: "Codzienne życie dawniej" },
  { value: "conflicts", emoji: "💣", label: "Konflikty i dramaty historii" },
];

const DEPTH_OPTIONS: Array<{ value: DepthPreference; emoji: string; label: string; description: string }> = [
  { value: "short", emoji: "⏱", label: "Krótko", description: "Najważniejsze info" },
  { value: "normal", emoji: "🚶", label: "Na spokojnie", description: "To, co ciekawe" },
  { value: "deep", emoji: "🧠", label: "Dogłębnie", description: "Chcę wszystko poznać" },
];

const MODE_OPTIONS: Array<{ value: ContentMode; emoji: string; label: string }> = [
  { value: "audio", emoji: "🎧", label: "Audio" },
  { value: "text", emoji: "📘", label: "Tekst" },
  { value: "hybrid", emoji: "🔀", label: "Obie opcje" },
];

export function PreferencesSurvey({ initialPreferences, onComplete, onCancel }: PreferencesSurveyProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || {
      style: "neutral",
      interests: [],
      depth: "normal",
      mode: "hybrid",
    }
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStyleSelect = (style: NarrativeStyle) => {
    setPreferences((prev) => ({ ...prev, style }));
    setTimeout(() => nextStep(), 200);
  };

  const handleInterestToggle = (interest: InterestTag) => {
    setPreferences((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleDepthSelect = (depth: DepthPreference) => {
    setPreferences((prev) => ({ ...prev, depth }));
    setTimeout(() => nextStep(), 200);
  };

  const handleModeSelect = (mode: ContentMode) => {
    setPreferences((prev) => ({ ...prev, mode }));
    setTimeout(() => handleComplete(), 200);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleComplete = () => {
    savePreferences(preferences);
    onComplete?.(preferences);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Style zawsze wybrany (ma default)
      case 2:
        return preferences.interests.length >= 2 && preferences.interests.length <= 4;
      case 3:
        return true; // Depth zawsze wybrany (ma default)
      case 4:
        return true; // Mode zawsze wybrany (ma default)
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300",
                  currentStep > step.id
                    ? "bg-amber-500 text-white"
                    : currentStep === step.id
                    ? "bg-amber-600 text-white scale-110"
                    : "bg-stone-200 text-stone-500"
                )}
              >
                {currentStep > step.id ? "✓" : step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 transition-all duration-300",
                    currentStep > step.id ? "bg-amber-500" : "bg-stone-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-stone-500 text-center">
          Krok {currentStep} z {STEPS.length}
        </p>
      </div>

      {/* Step content */}
      <div className="relative min-h-[400px]">
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
          )}
        >
          {/* Step 1: Style */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">
                W jakim stylu chcesz słuchać / czytać przewodnik?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {NARRATIVE_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => handleStyleSelect(style.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 transition-all duration-200",
                      "hover:scale-105 hover:shadow-lg active:scale-95",
                      preferences.style === style.value
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-stone-200 bg-white hover:border-amber-300"
                    )}
                  >
                    <span className="text-4xl">{style.emoji}</span>
                    <span className="text-sm font-medium text-stone-700">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">
                Co chcesz najbardziej odkrywać w tym miejscu?
              </h2>
              <p className="text-sm text-stone-500 text-center mb-4">
                Wybierz 2-4 rzeczy, które Cię najbardziej interesują
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INTERESTS.map((interest) => {
                  const isSelected = preferences.interests.includes(interest.value);
                  return (
                    <button
                      key={interest.value}
                      onClick={() => handleInterestToggle(interest.value)}
                      disabled={!isSelected && preferences.interests.length >= 4}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                        "hover:scale-105 hover:shadow-lg active:scale-95",
                        isSelected
                          ? "border-amber-500 bg-amber-50 shadow-md"
                          : preferences.interests.length >= 4
                          ? "border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed"
                          : "border-stone-200 bg-white hover:border-amber-300"
                      )}
                    >
                      <span className="text-3xl">{interest.emoji}</span>
                      <span className="text-xs font-medium text-stone-700 text-center">{interest.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-sm font-medium",
                  preferences.interests.length >= 2 && preferences.interests.length <= 4
                    ? "text-amber-600"
                    : preferences.interests.length < 2
                    ? "text-stone-500"
                    : "text-red-500"
                )}>
                  Wybrano: {preferences.interests.length} / 4
                  {preferences.interests.length < 2 && " (wybierz minimum 2)"}
                  {preferences.interests.length > 4 && " (wybierz maksimum 4)"}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Depth */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">
                Jak bardzo szczegółowo chcesz zwiedzać?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DEPTH_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDepthSelect(option.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 transition-all duration-200",
                      "hover:scale-105 hover:shadow-lg active:scale-95",
                      preferences.depth === option.value
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-stone-200 bg-white hover:border-amber-300"
                    )}
                  >
                    <span className="text-5xl">{option.emoji}</span>
                    <div className="text-center">
                      <div className="font-semibold text-stone-800 mb-1">{option.label}</div>
                      <div className="text-sm text-stone-500">{option.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Mode */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">
                Wolisz czytać czy słuchać?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {MODE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleModeSelect(option.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 transition-all duration-200",
                      "hover:scale-105 hover:shadow-lg active:scale-95",
                      preferences.mode === option.value
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-stone-200 bg-white hover:border-amber-300"
                    )}
                  >
                    <span className="text-5xl">{option.emoji}</span>
                    <div className="font-semibold text-stone-800">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : prevStep}
          disabled={isAnimating}
        >
          {currentStep === 1 ? "Anuluj" : "← Wstecz"}
        </Button>
        {currentStep < 4 && (
          <Button
            onClick={nextStep}
            disabled={!canProceed() || isAnimating}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Dalej →
          </Button>
        )}
      </div>
    </div>
  );
}

