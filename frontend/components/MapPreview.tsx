"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const markers = [
  { id: "brama_florianska", lat: 50.0657, lng: 19.9412 },
  { id: "sukiennice", lat: 50.0619, lng: 19.9372 },
  { id: "kosciol_mariacki", lat: 50.0617, lng: 19.9393 },
  { id: "wawel", lat: 50.0540, lng: 19.9354 },
];

const markerIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="20" height="30">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="#f59e0b"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `),
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});

export function MapPreview() {
  return (
    <MapContainer
      center={[50.0600, 19.9380]}
      zoom={14}
      className="w-full h-full"
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={false}
      touchZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={markerIcon} />
      ))}
    </MapContainer>
  );
}


