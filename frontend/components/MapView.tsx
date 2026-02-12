"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  shortDescription?: string;
  imageUrl?: string;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMapReady?: (map: LeafletMap) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  flyToCenter?: [number, number] | null;
  flyToZoom?: number;
  userLocation?: [number, number] | null;
}

// Custom marker icon
const markerIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="#f59e0b"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `),
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

// User location dot (Google Maps style: blue circle with inner dot)
const userLocationIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="8" fill="#4285F4" opacity="0.3"/>
      <circle cx="12" cy="12" r="4" fill="#4285F4"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapController({
  onMapReady,
  flyToCenter,
  flyToZoom = 16,
}: {
  onMapReady?: (map: LeafletMap) => void;
  flyToCenter?: [number, number] | null;
  flyToZoom?: number;
}) {
  const map = useMap();
  const onMapReadyRef = useRef(onMapReady);
  onMapReadyRef.current = onMapReady;

  useEffect(() => {
    onMapReadyRef.current?.(map);
  }, [map]);

  useEffect(() => {
    if (!flyToCenter) return;
    map.flyTo(flyToCenter, flyToZoom, { duration: 0.5 });
  }, [map, flyToCenter, flyToZoom]);

  return null;
}

export function MapView({
  markers,
  center = [50.0647, 19.9450],
  zoom = 15,
  onMapReady,
  onMarkerClick,
  flyToCenter = null,
  flyToZoom = 16,
  userLocation = null,
}: MapViewProps) {
  return (
    <div className="map-hide-zoom-controls w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
      <MapController
        onMapReady={onMapReady}
        flyToCenter={flyToCenter}
        flyToZoom={flyToZoom}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={markerIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(marker),
          }}
        />
      ))}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={userLocationIcon}
          interactive={false}
          zIndexOffset={1000}
        />
      )}
    </MapContainer>
    </div>
  );
}
