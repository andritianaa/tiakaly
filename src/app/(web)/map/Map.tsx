"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// Import Leaflet components only on client side
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import useSWR from "swr";

import { PlaceResume } from "@/components/place-resume";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { MARKER } from "@/lib/MarkerIcon";
import { fetcher } from "@/lib/utils";

import { PlacePopup } from "./popup";

import type { PlaceSummary } from "@/types/place";

// This component will be used to access the map instance
function MapController({ selectedPlace }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace && selectedPlace.latitude && selectedPlace.longitude) {
      // Fly to the selected place with animation
      map.flyTo(
        [selectedPlace.latitude, selectedPlace.longitude],
        18, // Zoom level
        {
          animate: true,
          duration: 1.5, // Animation duration in seconds
        }
      );

      // Optional: Update URL hash without navigating
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `/map#${selectedPlace.id}`);
      }
    }
  }, [selectedPlace, map]);

  return null;
}

function MapPlaceholder() {
  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
      <p className="text-muted-foreground">Chargement de la carte...</p>
    </div>
  );
}

function MapComponent() {
  const { data: fetchedPlaces, isLoading } = useSWR<PlaceSummary[]>(
    "/api/places/all",
    fetcher
  );

  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (fetchedPlaces) {
      const filteredPlaces = fetchedPlaces.filter((place) => {
        const lowerSearchText = searchText.toLowerCase();
        return (
          place.title.toLowerCase().includes(lowerSearchText) ||
          place.bio?.toLowerCase().includes(lowerSearchText) ||
          place.localisation?.toLowerCase().includes(lowerSearchText)
        );
      });
      setPlaces(filteredPlaces);
    }
  }, [searchText, fetchedPlaces]);

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);

    // Close the sheet/drawer after selecting a place
    if (window.innerWidth >= 768) {
      // For desktop (Sheet)
      setSheetOpen(false);
    } else {
      // For mobile (Drawer)
      setDrawerOpen(false);
    }
  };

  return (
    <>
      <div className="fixed h-screen w-screen big-map">
        <MapContainer
          center={[-18.902379, 47.533765]}
          zoom={15}
          scrollWheelZoom={true}
          minZoom={9}
          className="h-screen w-screen"
        >
          <TileLayer
            url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          />
          {/* Map controller to handle flying to locations */}
          <MapController selectedPlace={selectedPlace} />

          {places?.map((place) =>
            place.longitude != 0 ? (
              <Marker
                key={place.id}
                position={[place.latitude!, place.longitude!]}
                interactive
                icon={MARKER}
              >
                <Popup closeButton={false} closeOnClick={false}>
                  <Link
                    prefetch={true}
                    href={`/place/${place.id}`}
                    className="flex flex-col items-start justify-start overflow-hidden w-fit bg-transparent text-black rounded-lg"
                  >
                    <PlacePopup {...place} />
                  </Link>{" "}
                </Popup>
              </Marker>
            ) : (
              <React.Fragment key={place.id}></React.Fragment>
            )
          )}
        </MapContainer>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger>
          <Button className="fixed bottom-[4.5rem] right-4 z-50 md:bottom-4 hidden md:flex">
            Rechercher
          </Button>
        </SheetTrigger>
        <SheetContent className="h-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Carte</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Rechercher..."
            />
            {isLoading &&
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton className="rounded-lg shadow-sm h-20" key={index} />
              ))}
            {places.map((place) => (
              <PlaceResume
                key={place.id}
                place={place}
                mapMode={true}
                onMapClick={handlePlaceClick}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button className="fixed bottom-[4.5rem] right-4 z-50 md:bottom-4 flex md:hidden">
            Rechercher
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh]">
          <div className="mx-auto w-full px-4">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className=""
              placeholder="Rechercher..."
            />
            <ScrollArea className="h-[calc(80vh-4rem)] pb-2 w-full">
              <div className="grid grid-cols-2 gap-4 mt-4">
                {isLoading &&
                  Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                      className="rounded-lg shadow-sm h-20"
                      key={index}
                    />
                  ))}

                {places.map((place) => (
                  <PlaceResume
                    key={place.id}
                    place={place}
                    mapMode={true}
                    onMapClick={handlePlaceClick}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const DynamicMap = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: MapPlaceholder,
});

const Map = () => {
  const [mounted, setmounted] = useState(false);
  useEffect(() => {
    setmounted(true);
  });
  if (mounted) return <DynamicMap />;
  return <></>;
};

export default Map;
