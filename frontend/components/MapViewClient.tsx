"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/components/MapView";
import type { Map as LeafletMap } from "leaflet";

export interface MapViewClientProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMapReady?: (map: LeafletMap) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  flyToCenter?: [number, number] | null;
  flyToZoom?: number;
  userLocation?: [number, number] | null;
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
