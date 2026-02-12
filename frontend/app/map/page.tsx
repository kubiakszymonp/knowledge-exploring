"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Filter, X } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { MapViewClient } from "@/components/MapViewClient";
import type { MapMarker } from "@/components/MapView";
import { getEntities, getMediaList } from "@/lib/api/pilot";
import type { Entity } from "@/model/pilot/types";
import type { Map as LeafletMap } from "leaflet";

export default function MapPage() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [flyToCenter, setFlyToCenter] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const onMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;
  }, []);

  const handleSearchInArea = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;
    setSearchError(null);
    setSearching(true);
    try {
      const [entities, mediaList] = await Promise.all([
        getEntities(),
        getMediaList(),
      ]);
      const mediaById = new Map(mediaList.map((m) => [m.id, m]));
      const bounds = map.getBounds();
      const south = bounds.getSouth();
      const north = bounds.getNorth();
      const west = bounds.getWest();
      const east = bounds.getEast();

      const placeEntities = entities.filter(
        (e): e is Entity & { geo: { lat: number; lng: number } } =>
          e.type === "place" && !!e.geo
      );
      const inBounds = placeEntities.filter(
        (e) =>
          e.geo.lat >= south &&
          e.geo.lat <= north &&
          e.geo.lng >= west &&
          e.geo.lng <= east
      );

      const nextMarkers: MapMarker[] = inBounds.map((e) => {
        const firstMediaId = e.mediaIds?.[0];
        const media = firstMediaId ? mediaById.get(firstMediaId) : undefined;
        return {
          id: e.id,
          name: e.name,
          lat: e.geo.lat,
          lng: e.geo.lng,
          shortDescription: e.shortDescription,
          imageUrl: media?.storageUrl,
        };
      });
      setMarkers(nextMarkers);
    } catch (err) {
      console.error("Failed to load places in area", err);
      setSearchError("Nie udało się wczytać miejsc w tym obszarze.");
    } finally {
      setSearching(false);
    }
  }, []);

  const handleMyLocation = useCallback(() => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolokalizacja nie jest dostępna.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setFlyToCenter(coords);
      },
      () => setLocationError("Brak dostępu do lokalizacji.")
    );
  }, []);

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
  }, []);

  const center: [number, number] = [50.06, 19.938];
  const zoom = 15;

  return (
    <div className="h-screen flex flex-col">
      <AppHeader backHref="/" backBehavior="history" title="Mapa zabytków" />

      <main className="flex-1 relative">
        <MapViewClient
          markers={markers}
          center={center}
          zoom={zoom}
          onMapReady={onMapReady}
          onMarkerClick={handleMarkerClick}
          flyToCenter={flyToCenter}
          flyToZoom={16}
          userLocation={userLocation}
        />

        <div className="absolute left-1/2 top-4 -translate-x-1/2 z-[1000]">
          <button
            type="button"
            onClick={handleSearchInArea}
            disabled={searching}
            className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60 transition-colors"
          >
            {searching ? "Szukam…" : "Szukaj w okolicy"}
          </button>
        </div>

        <div className="absolute top-4 right-4 z-[1000]">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-label="Filtry"
            title="Filtry"
            className="p-3 rounded-full shadow-lg bg-white/95 backdrop-blur-sm text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-6 right-4 z-[1000]">
          <button
            type="button"
            onClick={handleMyLocation}
            aria-label="Moja lokalizacja"
            title="Pokaż moją lokalizację"
            className="p-3 rounded-full shadow-lg bg-white/95 backdrop-blur-sm text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {searchError && (
          <div className="absolute top-4 left-4 right-24 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg z-[1000]">
            {searchError}
          </div>
        )}
        {locationError && (
          <div className="absolute top-4 left-4 right-24 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg z-[1000]">
            {locationError}
          </div>
        )}

        {filtersOpen && (
          <>
            <button
              type="button"
              aria-label="Zamknij"
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 z-[1100] transition-opacity"
            />
            <div
              className="fixed left-0 right-0 bottom-0 z-[1101] bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-slideUp max-h-[85vh] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Filtry"
            >
              <div className="relative flex items-center justify-center px-4 pt-3 pb-2">
                <span className="w-10 h-1 bg-stone-200 rounded-full" />
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Zamknij"
                  className="absolute right-4 p-2 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-4 pb-6 min-h-[120px]" />
            </div>
          </>
        )}

        {selectedMarker && (
          <>
            <button
              type="button"
              aria-label="Zamknij"
              onClick={() => setSelectedMarker(null)}
              className="fixed inset-0 bg-black/40 z-[1100] transition-opacity"
            />
            <div
              className="fixed left-0 right-0 bottom-0 z-[1101] bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-slideUp max-h-[85vh] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="marker-sheet-title"
            >
              <div className="relative flex items-center justify-center px-4 pt-3 pb-2">
                <span className="w-10 h-1 bg-stone-200 rounded-full" />
                <button
                  type="button"
                  onClick={() => setSelectedMarker(null)}
                  aria-label="Zamknij"
                  className="absolute right-4 p-2 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-4 pb-6">
                {selectedMarker.imageUrl && (
                  <div className="aspect-[16/10] -mx-4 mt-2 mb-4 rounded-t-2xl overflow-hidden bg-stone-100">
                    <img
                      src={selectedMarker.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2
                  id="marker-sheet-title"
                  className="text-xl font-semibold text-stone-800 mb-2"
                >
                  {selectedMarker.name}
                </h2>
                {selectedMarker.shortDescription && (
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">
                    {selectedMarker.shortDescription}
                  </p>
                )}
                <Link
                  href={`/entity/${selectedMarker.id}`}
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Zobacz
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
