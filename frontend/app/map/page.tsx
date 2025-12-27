"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/MapView").then(mod => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-stone-100">
      <div className="animate-pulse text-stone-400">Ładowanie mapy...</div>
    </div>
  ),
});

const markers = [
  { id: "brama_florianska", name: "Brama Floriańska", lat: 50.0657, lng: 19.9412 },
  { id: "sukiennice", name: "Sukiennice", lat: 50.0619, lng: 19.9372 },
  { id: "kosciol_mariacki", name: "Kościół Mariacki", lat: 50.0617, lng: 19.9393 },
  { id: "wawel", name: "Zamek Królewski na Wawelu", lat: 50.0540, lng: 19.9354 },
];

export default function MapPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-[1000]">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-stone-500 hover:text-stone-800 transition-colors">
            ← Powrót
          </Link>
          <h1 className="text-xl font-semibold text-stone-800">Mapa zabytków</h1>
        </div>
      </header>

      {/* Map */}
      <main className="flex-1 relative">
        <MapView markers={markers} center={[50.0600, 19.9380]} zoom={15} />
        
        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 z-[1000]">
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Zabytki</h3>
          <ul className="space-y-2">
            {markers.map((marker) => (
              <li key={marker.id}>
                <Link
                  href={`/${marker.id}/explore`}
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

