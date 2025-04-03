"use client";

import 'leaflet/dist/leaflet.css';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Type definitions for our props
interface MapCoordinatesInputProps {
  longitude: number;
  latitude: number;
  onChange: (longitude: number, latitude: number) => void;
}

// Wrapper component that will be rendered while map is loading
function MapPlaceholder() {
  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
      <p className="text-muted-foreground">Chargement de la carte...</p>
    </div>
  );
}

// The actual map component implementation
function MapComponent({
  longitude,
  latitude,
  onChange,
}: MapCoordinatesInputProps) {
  // Only import Leaflet and React-Leaflet components on the client side
  const {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
  } = require("react-leaflet");
  const L = require("leaflet");

  // Fix for Leaflet marker icons in Next.js
  const icon = L.icon({
    iconUrl: "/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const [position, setPosition] = useState<[number, number]>([
    latitude || -18.8792, // Default coordinates (Madagascar)
    longitude || 47.5079,
  ]);

  useEffect(() => {
    onChange(position[1], position[0]);
  }, [position, onChange]);

  // Define a default zoom
  const defaultZoom = 13;

  // Inner component for map events
  function LocationMarker({
    position,
    setPosition,
  }: {
    position: [number, number];
    setPosition: (pos: [number, number]) => void;
  }) {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return position ? <Marker position={position} icon={icon} /> : null;
  }

  return (
    <div className="h-[500px] w-full rounded-md overflow-hidden">
      <MapContainer
        center={position}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
}

// Dynamically import the map component with SSR disabled
const DynamicMap = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: MapPlaceholder,
});

// Main exported component
export function MapCoordinatesInput({
  longitude,
  latitude,
  onChange,
}: MapCoordinatesInputProps) {
  return (
    <div className="space-y-2">
      <Label>Coordonnées géographiques</Label>
      <Card>
        <CardContent className="p-4">
          <DynamicMap
            longitude={longitude}
            latitude={latitude}
            onChange={onChange}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Cliquez sur la carte pour définir la position du lieu
          </p>
          <p className="text-xs font-medium mt-1">
            Coordonnées actuelles: {latitude ? latitude.toFixed(6) : "-"},{" "}
            {longitude ? longitude.toFixed(6) : "-"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
