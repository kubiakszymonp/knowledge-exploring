"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import type { Entity, Route } from "@/model/pilot/types";

const MapPreview = dynamic(
  () => import("@/components/MapPreview").then((mod) => mod.MapPreview),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-stone-200 animate-pulse" />
    ),
  }
);

const btnPrimary =
  "w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white text-base font-semibold px-6 py-3 rounded-lg transition-colors";
const btnOutline =
  "w-full sm:w-auto border-2 border-stone-300 hover:border-amber-500 hover:bg-amber-50 text-stone-700 hover:text-amber-700 text-base font-semibold px-6 py-3 rounded-lg transition-colors";

interface HomeClientProps {
  places: Entity[];
  recommendedRoutes: Route[];
}

export function HomeClient({ places, recommendedRoutes }: HomeClientProps) {
  const recommended = places.slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader />

      <main className="w-full flex flex-col items-center px-6 py-12 space-y-16">
        <section className="max-w-3xl w-full text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-800 mb-4">
            Knowledge Explorer
          </h1>
          <p className="text-stone-600 text-lg mb-8">
            Lekka aplikacja do odkrywania miejsc i historii w Twoim tempie –
            z mapą, polecanymi punktami i treściami dopasowanymi do Ciebie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/settings">
              <Button className={btnPrimary}>Ustaw preferencje</Button>
            </Link>
          </div>
        </section>

        <section className="max-w-5xl w-full relative z-0">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="h-64 sm:h-80 relative z-0">
              <MapPreview />
            </div>
            <Link
              href="/map"
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-4 transition-colors"
            >
              Eksploruj na mapie →
            </Link>
          </div>
        </section>

        <section className="max-w-6xl w-full">
          <h2 className="text-center text-2xl font-serif font-bold text-stone-800 mb-6">
            Polecane
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((place) => (
              <Link
                key={place.id}
                href={`/${place.id}/explore`}
                className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={`https://picsum.photos/seed/${place.id}/600/400`}
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    {place.shortDescription ?? ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link href="/places">
              <Button variant="outline" className={btnOutline}>
                Zobacz więcej
              </Button>
            </Link>
          </div>
        </section>

        <section className="max-w-6xl w-full">
          <h2 className="text-center text-2xl font-serif font-bold text-stone-800 mb-6">
            Polecane ścieżki zwiedzania
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedRoutes.map((route) => (
              <Link
                key={route.id}
                href={`/routes/${route.id}`}
                className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={`https://picsum.photos/seed/${route.id}/600/400`}
                    alt={route.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                    {route.name}
                  </h3>
                  {route.description && (
                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                      {route.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {recommendedRoutes.length === 0 && (
            <p className="text-center text-stone-500 py-6">
              Brak polecanych ścieżek.
            </p>
          )}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-stone-400 mt-12">
        Knowledge Explorer • Demo
      </footer>
    </div>
  );
}
