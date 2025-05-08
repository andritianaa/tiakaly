"use client";

import L from "leaflet";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
// Import Leaflet components only on client side
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import useSWR from "swr";

import { PlaceResume } from "@/components/place-resume";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { MARKER } from "@/lib/MarkerIcon";
import { fetcher } from "@/lib/utils";

import { PlacePopup } from "./popup";

import type { PlaceSummary } from "@/types/place";

// Madagascar default coordinates
const MADAGASCAR_COORDS = {
  latitude: -18.902379,
  longitude: 47.533765,
};

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Number.POSITIVE_INFINITY;

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// This component will be used to access the map instance
function MapController({ selectedPlace, userLocation, hasUserLocation }) {
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

  // Center map on user location when it becomes available
  useEffect(() => {
    if (
      hasUserLocation &&
      userLocation.latitude !== 0 &&
      userLocation.longitude !== 0
    ) {
      map.flyTo(
        [userLocation.latitude, userLocation.longitude],
        15, // Zoom level
        {
          animate: true,
          duration: 1.5, // Animation duration in seconds
        }
      );
    }
  }, [userLocation, hasUserLocation, map]);

  return null;
}

function MapPlaceholder() {
  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
      <p className="text-muted-foreground">Chargement de la carte...</p>
    </div>
  );
}

// Create a custom blue dot icon for user location
const createUserLocationDot = () => {
  return L.divIcon({
    className: "user-location-dot",
    html: `<div style="
      background-color: #3b82f6;
      border: 2px solid white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function MapComponent() {
  const { data: fetchedPlaces, isLoading } = useSWR<PlaceSummary[]>(
    "/api/places/all",
    fetcher
  );

  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceSummary[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(MADAGASCAR_COORDS);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState(null);
  const [locationError, setLocationError] = useState("");

  // Get user location automatically when component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

  // Get user location
  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(userCoords);
          setHasUserLocation(true);
          setIsLocating(false);
          console.log("User location obtained:", userCoords);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMsg = "";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Accès à la localisation refusé";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Position indisponible";
              break;
            case error.TIMEOUT:
              errorMsg = "Délai d'attente dépassé";
              break;
            default:
              errorMsg = "Erreur inconnue";
          }
          setLocationError(errorMsg);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Géolocalisation non supportée par ce navigateur");
      setIsLocating(false);
    }
  };

  // Filter places by search text
  useEffect(() => {
    if (fetchedPlaces) {
      const textFiltered = fetchedPlaces.filter((place) => {
        const lowerSearchText = searchText.toLowerCase();
        return (
          place.title.toLowerCase().includes(lowerSearchText) ||
          place.bio?.toLowerCase().includes(lowerSearchText) ||
          place.localisation?.toLowerCase().includes(lowerSearchText)
        );
      });

      setPlaces(textFiltered);

      // Apply distance filter if active
      if (distanceFilter && hasUserLocation) {
        filterByDistance(distanceFilter, textFiltered);
      } else {
        setFilteredPlaces(textFiltered);
      }
    }
  }, [
    searchText,
    fetchedPlaces,
    distanceFilter,
    userLocation,
    hasUserLocation,
  ]);

  // Filter places by distance
  const filterByDistance = (distance, placesToFilter = places) => {
    if (!hasUserLocation) return;

    setDistanceFilter(distance);

    const filtered = placesToFilter.filter((place) => {
      if (!place.latitude || !place.longitude) return false;

      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.latitude,
        place.longitude
      );

      return dist <= distance;
    });

    setFilteredPlaces(filtered);
  };

  // Reset distance filter
  const resetDistanceFilter = () => {
    setDistanceFilter(null);
    setFilteredPlaces(places);
  };

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

  // Display places based on filters
  const displayedPlaces = distanceFilter ? filteredPlaces : places;

  return (
    <>
      <div className="fixed h-screen w-screen big-map">
        <MapContainer
          center={[MADAGASCAR_COORDS.latitude, MADAGASCAR_COORDS.longitude]}
          zoom={13}
          scrollWheelZoom={true}
          minZoom={9}
          className="h-screen w-screen"
        >
          <TileLayer
            url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          />
          {/* Map controller to handle flying to locations */}
          <MapController
            selectedPlace={selectedPlace}
            userLocation={userLocation}
            hasUserLocation={hasUserLocation}
          />

          {/* User location blue dot - only show if we have a real user location */}
          {hasUserLocation &&
            userLocation.latitude !== 0 &&
            userLocation.longitude !== 0 && (
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={createUserLocationDot()}
                zIndexOffset={1000}
              />
            )}

          {/* Distance filter circle */}
          {hasUserLocation && distanceFilter && (
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={distanceFilter * 1000} // Convert km to meters
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
          )}

          {places?.map((place) =>
            place.longitude != 0 ? (
              <Marker
                key={place.id}
                position={[place.latitude!, place.longitude!]}
                interactive
                icon={MARKER}
              >
                <Popup closeButton={false} closeOnClick={true}>
                  <div className="flex flex-col items-start justify-start overflow-hidden w-fit bg-transparent text-black rounded-lg">
                    <PlacePopup
                      {...place}
                      distance={
                        hasUserLocation
                          ? calculateDistance(
                              userLocation.latitude,
                              userLocation.longitude,
                              place.latitude,
                              place.longitude
                            ).toFixed(1) + " km"
                          : undefined
                      }
                    />
                  </div>{" "}
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
          </SheetHeader>
          <div className="flex flex-col gap-2">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Rechercher..."
            />

            {/* Distance filter buttons - only show if we have user location */}
            {hasUserLocation && (
              <div className="flex flex-wrap gap-2 my-2">
                <Button
                  variant={distanceFilter === null ? "default" : "outline"}
                  size="sm"
                  onClick={resetDistanceFilter}
                >
                  Tous
                </Button>
                <Button
                  variant={distanceFilter === 2 ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByDistance(2)}
                >
                  2km
                </Button>
                <Button
                  variant={distanceFilter === 5 ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByDistance(5)}
                >
                  5km
                </Button>
                <Button
                  variant={distanceFilter === 10 ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByDistance(10)}
                >
                  10km
                </Button>
                <Button
                  variant={distanceFilter === 15 ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByDistance(15)}
                >
                  15km
                </Button>
              </div>
            )}

            {/* Show message when no places match the distance filter */}
            {distanceFilter && filteredPlaces.length === 0 && !isLoading && (
              <p className="text-center text-muted-foreground py-4">
                Aucun lieu trouvé dans un rayon de {distanceFilter}km
              </p>
            )}

            {isLoading &&
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton className="rounded-lg shadow-sm h-20" key={index} />
              ))}

            {displayedPlaces.map((place) => (
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
              className="mb-2"
              placeholder="Rechercher..."
            />

            {/* Location status message */}
            {locationError ? (
              <p className="text-sm text-red-500 mb-2">{locationError}</p>
            ) : !hasUserLocation ? (
              <p className="text-sm text-muted-foreground mb-2">
                Recherche de votre position...
              </p>
            ) : null}

            {/* Distance filter buttons for mobile - only show if we have user location */}
            {hasUserLocation && (
              <div className="flex flex-wrap gap-2 my-2">
                <Button
                  variant={distanceFilter === null ? "default" : "outline"}
                  size="sm"
                  onClick={resetDistanceFilter}
                >
                  Tous
                </Button>
                <Button
                  variant={distanceFilter === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByDistance(1)}
                >
                  1km
                </Button>
                <Button
                  variant={distanceFilter === 2 ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByDistance(2)}
                >
                  2km
                </Button>
                <Button
                  variant={distanceFilter === 5 ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByDistance(5)}
                >
                  5km
                </Button>
                <Button
                  variant={distanceFilter === 10 ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByDistance(10)}
                >
                  10km
                </Button>
              </div>
            )}

            <ScrollArea className="h-[calc(80vh-8rem)] pb-2 w-full">
              <div className="grid grid-cols-2 gap-4 mt-4">
                {isLoading &&
                  Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                      className="rounded-lg shadow-sm h-20"
                      key={index}
                    />
                  ))}

                {/* Show message when no places match the distance filter */}
                {distanceFilter &&
                  filteredPlaces.length === 0 &&
                  !isLoading && (
                    <p className="text-center text-muted-foreground py-4 col-span-2">
                      Aucun lieu trouvé dans un rayon de {distanceFilter}km
                    </p>
                  )}

                {displayedPlaces.map((place) => (
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
