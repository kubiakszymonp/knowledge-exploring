"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-[1000]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-stone-800">
              ← Knowledge Explorer
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">Preferencje</h1>
          </div>
        </div>
      </header>

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

