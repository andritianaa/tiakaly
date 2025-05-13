"use client";

import type React from "react";

import "leaflet/dist/leaflet.css";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const { MapContainer, TileLayer, Marker, useMap } = require("react-leaflet");
  const L = require("leaflet");

  // Fix for Leaflet marker icons in Next.js
  const icon = L.icon({
    iconUrl: "/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Define a default zoom
  const defaultZoom = 13;
  const initialPosition: [number, number] = [
    latitude || -18.8792, // Default coordinates (Madagascar)
    longitude || 47.5079,
  ];

  // MapController handles map events and updates
  function MapController() {
    const map = useMap();

    // Handle map click events
    useEffect(() => {
      const handleMapClick = (e: any) => {
        const { lat, lng } = e.latlng;
        onChange(lng, lat);
      };

      map.on("click", handleMapClick);

      return () => {
        map.off("click", handleMapClick);
      };
    }, [map]);

    // Update map view when props change
    useEffect(() => {
      if (latitude && longitude) {
        map.setView([latitude, longitude], map.getZoom());
      }
    }, [map, latitude, longitude]);

    return null;
  }

  return (
    <div className="h-[500px] w-full rounded-md overflow-hidden">
      <MapContainer
        center={initialPosition}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {latitude && longitude && (
          <Marker position={[latitude, longitude]} icon={icon} />
        )}
        <MapController />
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
  const [localLatitude, setLocalLatitude] = useState<string>(
    latitude ? latitude.toString() : ""
  );
  const [localLongitude, setLocalLongitude] = useState<string>(
    longitude ? longitude.toString() : ""
  );

  // Flag to prevent infinite loops
  const isUpdatingRef = useRef(false);

  // Update local state when props change (e.g., when map is clicked)
  useEffect(() => {
    if (isUpdatingRef.current) return;

    if (latitude !== undefined && !isNaN(latitude)) {
      setLocalLatitude(latitude.toFixed(6));
    }
    if (longitude !== undefined && !isNaN(longitude)) {
      setLocalLongitude(longitude.toFixed(6));
    }
  }, [latitude, longitude]);

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalLatitude(value);
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalLongitude(value);
  };

  // Apply coordinates when button is clicked or form is submitted
  const applyCoordinates = () => {
    const lat = Number.parseFloat(localLatitude);
    const lng = Number.parseFloat(localLongitude);

    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      isUpdatingRef.current = true;
      onChange(lng, lat);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  };

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
          <p className="text-xs font-medium mt-1 mb-4">
            Coordonnées actuelles: {latitude ? latitude.toFixed(6) : "-"},{" "}
            {longitude ? longitude.toFixed(6) : "-"}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="latitude" className="text-sm">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="text"
                inputMode="decimal"
                placeholder="-90 à 90"
                value={localLatitude}
                onChange={handleLatitudeChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="longitude" className="text-sm">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="text"
                inputMode="decimal"
                placeholder="-180 à 180"
                value={localLongitude}
                onChange={handleLongitudeChange}
                className="mt-1"
              />
            </div>
          </div>
          <Button
            onClick={applyCoordinates}
            className="mt-4 w-full"
            type="button"
            variant="secondary"
          >
            Appliquer les coordonnées
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Saisissez les coordonnées et cliquez sur "Appliquer" pour mettre à
            jour la carte
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
