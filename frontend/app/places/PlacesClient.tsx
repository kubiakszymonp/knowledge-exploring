"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppHeader } from "@/components/AppHeader";
import type { Entity } from "@/model/pilot/types";

interface PlacesClientProps {
  places: Entity[];
}

export function PlacesClient({ places }: PlacesClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return places;
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription ?? "").toLowerCase().includes(q)
    );
  }, [query, places]);

  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader backHref="/" backBehavior="history" title="Miejsca" />

      <main className="container mx-auto px-6 py-6">
        <input
          type="search"
          placeholder="Szukaj miejsc..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md mx-auto block mb-8 px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((place) => (
            <Link
              key={place.id}
              href={`/entity/${place.id}`}
              className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={`https://picsum.photos/seed/${place.id}/600/400`}
                  alt={place.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-stone-800 text-sm group-hover:text-amber-700 transition-colors">
                  {place.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                  {place.shortDescription ?? ""}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-stone-500 py-8">
            Brak miejsc pasujących do wyszukiwania.
          </p>
        )}
      </main>
    </div>
  );
}
