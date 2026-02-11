"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
}

// Custom marker icon
const markerIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="#f59e0b"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `),
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

export function MapView({ markers, center = [50.0647, 19.9450], zoom = 15 }: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={markerIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold text-stone-800 mb-2">{marker.name}</h3>
              <Link
                href={`/entity/${marker.id}`}
                className="inline-block px-3 py-1 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors"
              >
                Eksploruj
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}





