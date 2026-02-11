"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

const features = [
  {
    title: "Zapis wiedzy jako grafu",
    description: "Wiedza jest przechowywana w formie grafu wiedzy, co pozwala na elastyczne powiązania między różnymi konceptami i sekcjami.",
  },
  {
    title: "Dodawanie zdjęć",
    description: "Możliwość dodawania zdjęć i innych załączników (wideo, audio, dokumenty) do każdego węzła wiedzy.",
  },
  {
    title: "Geolokalizacja punktów",
    description: "Punkty na mapie z geolokalizacją, umożliwiające wizualizację miejsc i nawigację do nich.",
  },
  {
    title: "Eksploracja interaktywna",
    description: "Dynamiczne odkrywanie treści poprzez pytania eksploracyjne, które prowadzą do kolejnych sekcji wiedzy.",
  },
  {
    title: "Personalizacja treści",
    description: "System preferencji użytkownika dopasowujący styl narracji, głębokość treści i zainteresowania.",
  },
  {
    title: "Odtwarzanie audio",
    description: "Możliwość odsłuchiwania treści w formie audio z pływającym odtwarzaczem.",
  },
  {
    title: "Tworzenie tras zwiedzania",
    description: "Możliwość tworzenia tras zwiedzania z wykorzystaniem geolokalizacji i współrzędnych.",
  },
  {
    title: "Tryb offline",
    description: "Aplikacja działa również offline dzięki technologii PWA, idealna do zwiedzania w miejscach bez zasięgu.",
  },
];

const potentialFeatures = [
  {
    title: "Możliwość lokowania własnych poleconych usług, miejsc itd.",
    description: "Funkcja umożliwiająca użytkownikom dodawanie i polecanie własnych banerów przekierowujących do ulubionych miejsc, usług i atrakcji w regionie.",
  },
  {
    title: "Tryb „W pobliżu”",
    description:
      "Widok atrakcji i punktów wiedzy w promieniu (np. 200m/1km) z możliwością filtrowania i szybkiej nawigacji.",
  },
  {
    title: "Wyszukiwanie semantyczne (AI search)",
    description:
      "Wyszukiwanie treści po znaczeniu, a nie tylko po tagach — np. „coś o Napoleonie w okolicy” albo „miejsce na zachód słońca”.",
  },
  {
    title: "Automatyczne planowanie zwiedzania",
    description:
      "Generator planu dnia na podstawie czasu użytkownika, preferencji, lokalizacji startowej, godzin otwarcia i odległości między punktami.",
  },
  {
    title: "Informowanie o lokalnych wydarzeniach",
    description: "System powiadomień o wydarzeniach kulturalnych, festiwalach i innych aktywnościach w regionie.",
  },
  {
    title: "Powiadomienia dla osób w regionie",
    description: "Lokalne powiadomienia push informujące użytkowników o istotnych wydarzeniach i aktualizacjach w ich okolicy.",
  },
  {
    title: "Gry terenowe wspomagane przez aplikację",
    description: "Gry terenowe wspomagane przez aplikację, które umożliwiają użytkownikom zabawę w sprawdzanie wiedzy o miejscach i zdobywanie odznaczeń.",
  },
  {
    title: "Panel dla gmin / muzeów / instytucji",
    description:
      "Panel administracyjny dla instytucji: dodawanie wydarzeń, aktualizacja treści, publikacja ogłoszeń oraz analityka zainteresowania turystów.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader backHref="/" title="O apce" />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-800 mb-4 text-center">
          Funkcje aplikacji
        </h2>
        <p className="text-stone-600 text-center mb-12 text-lg">
          Poznaj wszystkie możliwości, które oferuje Knowledge Explorer
        </p>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ornament separator */}
        <div className="flex items-center justify-center py-8 mt-12">
          <div className="flex items-center gap-2 w-full max-w-xs">
            <div className="flex-1 h-px bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="flex-1 h-px bg-amber-400" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-800 mb-4 text-center mt-12">
          Potencjalne funkcje do wdrożenia
        </h2>

        <div className="space-y-6">
          {potentialFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="w-6 h-6 text-amber-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ornament separator */}
        <div className="flex items-center justify-center py-8 mt-12">
          <div className="flex items-center gap-2 w-full max-w-xs">
            <div className="flex-1 h-px bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="flex-1 h-px bg-amber-400" />
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
          >
            Wróć do strony głównej
          </Link>
        </div>
      </main>
    </div>
  );
}

