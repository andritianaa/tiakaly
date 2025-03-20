"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix pour les icônes Leaflet dans Next.js
const icon = L.icon({
  iconUrl: "/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface PlaceMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

export default function PlaceMap({
  latitude,
  longitude,
  title,
}: PlaceMapProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />
      <Marker position={position} icon={icon}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}
