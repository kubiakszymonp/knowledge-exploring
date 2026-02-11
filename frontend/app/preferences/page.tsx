"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PreferencesSurvey } from "@/components/PreferencesSurvey";
import { UserPreferences } from "@/model/UserPreferences";
import { loadPreferences } from "@/lib/userPreferences";

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loaded = loadPreferences();
    setPreferences(loaded);
    setIsLoading(false);
  }, []);

  const handleComplete = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader variant="subpage" title="Preferencje" backHref="/" />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <PreferencesSurvey
            initialPreferences={preferences || undefined}
            onComplete={handleComplete}
            onCancel={() => router.push("/")}
          />
        </div>
      </main>
    </div>
  );
}

