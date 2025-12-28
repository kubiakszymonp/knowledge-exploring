"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PreferencesSurvey } from "@/components/PreferencesSurvey";
import { StyleSettings } from "@/components/StyleSettings";
import { UserPreferences } from "@/model/UserPreferences";
import { loadPreferences, savePreferences, getDefaultPreferences } from "@/lib/userPreferences";
import { ArticleStyle, EdgeStyle, STYLE_LABELS, EDGE_STYLE_LABELS } from "@/lib/loadStylizations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [articleStyle, setArticleStyle] = useState<ArticleStyle>("adult");
  const [edgeStyle, setEdgeStyle] = useState<EdgeStyle>("informative");
  const [showSurvey, setShowSurvey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = loadPreferences();
    setPreferences(loaded);
    
    // Załaduj style z localStorage
    if (typeof window !== "undefined") {
      const savedArticleStyle = localStorage.getItem("articleStyle");
      const savedEdgeStyle = localStorage.getItem("edgeStyle");
      if (savedArticleStyle) {
        setArticleStyle(savedArticleStyle as ArticleStyle);
      }
      if (savedEdgeStyle) {
        setEdgeStyle(savedEdgeStyle as EdgeStyle);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleSurveyComplete = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    setShowSurvey(false);
  };

  const handleReset = () => {
    const defaultPrefs = getDefaultPreferences();
    savePreferences(defaultPrefs);
    setPreferences(defaultPrefs);
    setShowSurvey(false);
  };

  const handleArticleStyleChange = (style: ArticleStyle) => {
    setArticleStyle(style);
    if (typeof window !== "undefined") {
      localStorage.setItem("articleStyle", style);
    }
  };

  const handleEdgeStyleChange = (style: EdgeStyle) => {
    setEdgeStyle(style);
    if (typeof window !== "undefined") {
      localStorage.setItem("edgeStyle", style);
    }
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
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-stone-800 hover:text-amber-600 transition-colors">
              ← Knowledge Explorer
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">Ustawienia</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {showSurvey ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <PreferencesSurvey
              initialPreferences={preferences || undefined}
              onComplete={handleSurveyComplete}
              onCancel={() => setShowSurvey(false)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-stone-800 mb-2">Preferencje użytkownika</h2>
              <p className="text-stone-600">
                Dostosuj sposób, w jaki aplikacja prezentuje treści
              </p>
            </div>

            {/* Sekcja ustawień stylu artykułu */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-stone-800 mb-4">Styl prezentacji treści</h3>
              <StyleSettings
                articleStyle={articleStyle}
                edgeStyle={edgeStyle}
                onArticleStyleChange={handleArticleStyleChange}
                onEdgeStyleChange={handleEdgeStyleChange}
              />
            </Card>

            {/* Sekcja preferencji z ankiety */}
            {preferences ? (
              <Card className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-4">Preferencje personalizacji</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
                      Styl narracji
                    </h4>
                    <p className="text-lg font-medium text-stone-800">
                      {preferences.style === "kids" && "🧒 Dla dzieci"}
                      {preferences.style === "humorous" && "😀 Lekko i humorystycznie"}
                      {preferences.style === "neutral" && "🙂 Neutralnie"}
                      {preferences.style === "serious" && "📚 Poważnie / historycznie"}
                      {preferences.style === "adult" && "🔞 Dla dorosłych"}
                      {preferences.style === "fairy" && "🪄 Fantazyjnie / opowieściowe"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
                      Głębokość zwiedzania
                    </h4>
                    <p className="text-lg font-medium text-stone-800">
                      {preferences.depth === "short" && "⏱ Krótko — najważniejsze info"}
                      {preferences.depth === "normal" && "🚶 Na spokojnie — to, co ciekawe"}
                      {preferences.depth === "deep" && "🧠 Dogłębnie — chcę wszystko poznać"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
                      Tryb odbioru
                    </h4>
                    <p className="text-lg font-medium text-stone-800">
                      {preferences.mode === "audio" && "🎧 Audio"}
                      {preferences.mode === "text" && "📘 Tekst"}
                      {preferences.mode === "hybrid" && "🔀 Obie opcje"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
                      Zainteresowania ({preferences.interests.length})
                    </h4>
                    {preferences.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {preferences.interests.map((interest) => {
                          const interestMap: Record<string, { emoji: string; label: string }> = {
                            architecture: { emoji: "🏰", label: "Architektura" },
                            history: { emoji: "⚔️", label: "Historia" },
                            curiosities: { emoji: "🧩", label: "Ciekawostki" },
                            legends: { emoji: "🎭", label: "Legendy i mity" },
                            art: { emoji: "🎨", label: "Sztuka i symbolika" },
                            culture: { emoji: "🌍", label: "Kontekst kulturowy" },
                            defense: { emoji: "🛡", label: "Obrona i wojskowość" },
                            daily_life: { emoji: "🏛", label: "Codzienne życie dawniej" },
                            conflicts: { emoji: "💣", label: "Konflikty i dramaty historii" },
                          };
                          const info = interestMap[interest];
                          return (
                            <span
                              key={interest}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                            >
                              {info?.emoji} {info?.label}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-stone-500">Brak wybranych zainteresowań</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={() => setShowSurvey(true)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600"
                  >
                    Edytuj preferencje
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    Resetuj
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-stone-600 mb-6">
                  Nie ustawiono jeszcze preferencji. Rozpocznij ankietę, aby dostosować aplikację do swoich potrzeb.
                </p>
                <Button
                  onClick={() => setShowSurvey(true)}
                  className="bg-amber-500 hover:bg-amber-600"
                  size="lg"
                >
                  Rozpocznij ankietę
                </Button>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

