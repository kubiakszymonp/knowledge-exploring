import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { MapViewClient } from "@/components/MapViewClient";
import { getEntities } from "@/lib/api/pilot";

export default async function MapPage() {
  const entities = await getEntities();
  const markers = entities
    .filter((e) => e.type === "place" && e.geo)
    .map((e) => ({
      id: e.id,
      name: e.name,
      lat: e.geo!.lat,
      lng: e.geo!.lng,
    }));

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
            {markers.map((marker) => (
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
