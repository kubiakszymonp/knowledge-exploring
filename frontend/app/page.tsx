"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { loadPreferences } from "@/lib/userPreferences";
import { Button } from "@/components/ui/button";

const MapPreview = dynamic(() => import("@/components/MapPreview").then(mod => mod.MapPreview), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-200 animate-pulse" />
  ),
});

const places = [
  {
    id: "brama_florianska",
    name: "Brama Floriańska",
    image: "https://picsum.photos/seed/brama-tile/600/400",
    description: "Gotycka brama miejska z XIV wieku",
  },
  {
    id: "sukiennice",
    name: "Sukiennice",
    image: "https://picsum.photos/seed/sukiennice/600/400",
    description: "Renesansowe centrum handlu",
  },
  {
    id: "wawel",
    name: "Zamek Królewski na Wawelu",
    image: "https://picsum.photos/seed/wawel-castle/600/400",
    description: "Siedziba polskich królów",
  },
];

const trail = {
  name: "Droga Królewska",
  description: "Historyczny trakt koronacyjny królów polskich",
  stops: [
    { id: "brama_florianska", name: "Brama Floriańska", image: "https://picsum.photos/seed/trail-1/200/200" },
    { id: "sukiennice", name: "Sukiennice", image: "https://picsum.photos/seed/trail-2/200/200" },
    { id: "kosciol_mariacki", name: "Kościół Mariacki", image: "https://picsum.photos/seed/trail-3/200/200" },
    { id: "wawel", name: "Wawel", image: "https://picsum.photos/seed/trail-4/200/200" },
  ],
};

type Perspective = "turysta" | "zarzadca";

export default function Home() {
  const [hasPreferences, setHasPreferences] = useState<boolean | null>(null);
  const [activePerspective, setActivePerspective] = useState<Perspective>("turysta");

  useEffect(() => {
    const preferences = loadPreferences();
    // Uznajemy że ankieta jest wypełniona jeśli są zapisane zainteresowania
    setHasPreferences(preferences !== null && preferences.interests.length > 0);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-stone-800">Knowledge Explorer</h1>
          <Link
            href="/settings"
            className="text-sm text-stone-600 hover:text-amber-600 transition-colors"
          >
            Ustawienia
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-800 mb-8">
            Odkrywaj wiedzę inaczej
          </h2>
          
          {/* Perspective Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Turysta Card */}
            <button
              onClick={() => setActivePerspective("turysta")}
              className={`group relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${
                activePerspective === "turysta" ? "scale-[1.03] shadow-xl" : ""
              }`}
            >
              <div className="relative w-full h-[300px] sm:h-[400px]">
                <Image
                  src="/turysta.png"
                  alt="Turysta"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                {/* Overlay dla aktywnej karty i hover */}
                <div className={`absolute inset-0 bg-amber-500/40 transition-all duration-300 ${
                  activePerspective === "turysta" 
                    ? "opacity-100" 
                    : "opacity-0 group-hover:opacity-100"
                }`} />
                {/* Gradient z dołu */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                {/* Tekst na dole */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <h3 className="text-lg sm:text-2xl font-bold text-white">Dla turystów</h3>
                </div>
              </div>
            </button>

            {/* Zarządca Card */}
            <button
              onClick={() => setActivePerspective("zarzadca")}
              className={`group relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${
                activePerspective === "zarzadca" ? "scale-[1.03] shadow-xl" : ""
              }`}
            >
              <div className="relative w-full h-[300px] sm:h-[400px]">
                <Image
                  src="/zarzadca.png"
                  alt="Zarządca"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                {/* Overlay dla aktywnej karty i hover */}
                <div className={`absolute inset-0 bg-amber-500/40 transition-all duration-300 ${
                  activePerspective === "zarzadca" 
                    ? "opacity-100" 
                    : "opacity-0 group-hover:opacity-100"
                }`} />
                {/* Gradient z dołu */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                {/* Tekst na dole */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <h3 className="text-lg sm:text-2xl font-bold text-white">Dla twórców</h3>
                </div>
              </div>
            </button>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <div className="space-y-4">
              {activePerspective === "turysta" ? (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-semibold text-stone-800 mb-3">Dla turystów</h3>
                  <p className="text-stone-600 leading-relaxed">
                    Eksploruj zabytki Krakowa przez interaktywne artykuły. 
                    Wybierz temat, klikaj w pytania i buduj własną ścieżkę odkrywania. 
                    Dostosuj styl tekstu do swoich preferencji — dla dzieci, dorosłych lub z humorem.
                  </p>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-semibold text-stone-800 mb-3">Dla twórców</h3>
                  <p className="text-stone-600 leading-relaxed">
                    Zarządzaj treścią i informacjami o zabytkach. Dodawaj nowe miejsca, 
                    edytuj opisy i tworz interaktywne ścieżki zwiedzania dla turystów.
                  </p>
                </div>
              )}
            </div>
          </div>

          {hasPreferences !== null && (
            <div className="mt-6">
              <Link href="/settings">
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  {hasPreferences ? "✏️ Edytuj ankietę" : "📝 Wypełnij ankietę"}
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Map Section */}
        <section>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="h-64 sm:h-80">
              <MapPreview />
            </div>
            <Link
              href="/map"
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-4 transition-colors"
            >
              <span>Eksploruj na mapie</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* Places Section */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">Miejsca</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <Link
                key={place.id}
                href={`/${place.id}/explore`}
                className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">{place.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trail Section */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">{trail.name}</h2>
          <p className="text-stone-500 mb-6">{trail.description}</p>
          
          <div className="relative">
            {/* Vertical line connecting stops - mobile */}
            <div className="absolute top-8 bottom-8 left-8 w-0.5 bg-amber-200 sm:hidden" />
            {/* Horizontal line connecting stops - desktop */}
            <div className="absolute top-8 left-8 right-8 h-0.5 bg-amber-200 hidden sm:block" />
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {trail.stops.map((stop, i) => (
                <Link
                  key={stop.id}
                  href={`/${stop.id}/explore`}
                  className="group relative flex flex-row sm:flex-col items-center gap-4 sm:gap-0 text-left sm:text-center"
                >
                  <div className="relative z-10 w-16 h-16 flex-shrink-0 rounded-full overflow-hidden ring-4 ring-amber-100 group-hover:ring-amber-400 transition-all shadow-md">
                    <Image
                      src={stop.image}
                      alt={stop.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-stone-700 group-hover:text-amber-700 transition-colors sm:mt-3">
                    {i + 1}. {stop.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-stone-400 mt-12">
        Knowledge Explorer • Demo
      </footer>
    </div>
  );
}
