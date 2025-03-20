"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
// Import Leaflet components only on client side
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { PlaceSummary } from "@/types/place";

import { PlacePopup } from "./popup";

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
            url={"https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"}
          />
          {/* <MarkerClusterGroup chunkedLoading polygonOptions={{ opacity: 0 }}> */}
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
              <></>
            )
          )}
          {/* </MarkerClusterGroup> */}
        </MapContainer>
      </div>
      <Sheet>
        <SheetTrigger>
          <Button className="fixed bottom-[4.5rem] right-4 z-50 md:bottom-4">
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
              <Card key={place.id} className="cursor-pointer">
                <div className="space-y-1.5 p-4">
                  <div className="flex gap-4">
                    <div className="grid gap-1">
                      <p className="text-base font-medium leading-none">
                        {place.title}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>
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
