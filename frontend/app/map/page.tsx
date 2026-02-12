 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { MapViewClient } from "@/components/MapViewClient";
import { getEntities } from "@/lib/api/pilot";

type Marker = { id: string; name: string; lat: number; lng: number };

export default function MapPage() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const entities = await getEntities();
        if (cancelled) return;
        const nextMarkers: Marker[] = entities
          .filter((e) => e.type === "place" && e.geo)
          .map((e) => ({
            id: e.id,
            name: e.name,
            lat: e.geo!.lat,
            lng: e.geo!.lng,
          }));
        setMarkers(nextMarkers);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load entities for map", err);
        setError("Nie udało się załadować zabytków.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const center: [number, number] = [50.06, 19.938];
  const zoom = 15;

  return (
    <div className="h-screen flex flex-col">
      <AppHeader backHref="/" backBehavior="history" title="Mapa zabytków" />

      <main className="flex-1 relative">
        <MapViewClient markers={markers} center={center} zoom={zoom} />

        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 z-[1000]">
          <h3 className="text-sm font-semibold text-stone-700 mb-3">
            Zabytki
          </h3>
          <ul className="space-y-2">
            {loading && (
              <li className="text-sm text-stone-400">Ładowanie zabytków...</li>
            )}
            {!loading && error && (
              <li className="text-sm text-red-500">{error}</li>
            )}
            {!loading &&
              !error &&
              markers.map((marker) => (
                <li key={marker.id}>
                  <Link
                    href={`/entity/${marker.id}`}
                    className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700 transition-colors"
                  >
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    {marker.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
