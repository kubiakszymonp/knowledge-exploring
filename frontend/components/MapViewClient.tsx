"use client";

import dynamic from "next/dynamic";

export interface MapViewClientProps {
  markers: { id: string; name: string; lat: number; lng: number }[];
  center?: [number, number];
  zoom?: number;
}

const MapView = dynamic(
  () => import("@/components/MapView").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-stone-100">
        <div className="animate-pulse text-stone-400">Ładowanie mapy...</div>
      </div>
    ),
  }
);

export function MapViewClient(props: MapViewClientProps) {
  return <MapView {...props} />;
}
