"use client";

import L from 'leaflet';
import { Route } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
// Import Leaflet components only on client side
import {
    Circle, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents
} from 'react-leaflet';
import useSWR from 'swr';

import { PlaceResume } from '@/components/place-resume';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { MARKER } from '@/lib/MarkerIcon';
import { fetcher } from '@/lib/utils';

import { PlacePopup } from './popup';

import type { PlaceSummary } from "@/types/place";
// Types pour les informations de l'itinéraire
interface RouteInfo {
  distance: string;
  time: string;
}

// Extension de Leaflet pour le routage
declare global {
  interface Window {
    L: typeof L & {
      Routing: {
        control: (options: any) => any;
        osrmv1: (options: any) => any;
      };
    };
  }
}

// Madagascar default coordinates
const MADAGASCAR_COORDS = {
  latitude: -18.902379,
  longitude: 47.533765,
};

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Configuration pour les différents modes de transport
const TRANSPORT_CONFIG = {
  driving: {
    profile: "car",
    serviceUrl: "https://router.project-osrm.org/route/v1",
    color: "#3b82f6",
    speedFactor: 1.0,
  },
  cycling: {
    profile: "motorcycle",
    serviceUrl: "https://router.project-osrm.org/route/v1",
    color: "#10b981",
    speedFactor: 0.8,
  },
  walking: {
    profile: "foot",
    serviceUrl: "https://router.project-osrm.org/route/v1",
    color: "#ef4444",
    speedFactor: 0.2,
  },
};

interface MapControllerProps {
  selectedPlace: PlaceSummary | null;
  userLocation: { latitude: number; longitude: number };
  hasUserLocation: boolean;
  routeDestination: PlaceSummary | null;
  setRouteInfo: React.Dispatch<React.SetStateAction<RouteInfo | null>>;
  transportMode: string;
}

// This component will be used to access the map instance and handle routing
function MapController({
  selectedPlace,
  userLocation,
  hasUserLocation,
  routeDestination,
  setRouteInfo,
  transportMode,
}: MapControllerProps) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  // Effect for handling place selection
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

  // Handle routing when a destination is set
  useEffect(() => {
    // We need to add a script tag to load Leaflet Routing Machine
    const loadRoutingMachine = () => {
      return new Promise<typeof window.L.Routing>((resolve, reject) => {
        if (typeof window !== "undefined") {
          // Check if Leaflet Routing Machine is already loaded
          if (window.L && window.L.Routing) {
            resolve(window.L.Routing);
            return;
          }

          // Load Leaflet Routing Machine CSS
          const linkElement = document.createElement("link");
          linkElement.rel = "stylesheet";
          linkElement.href =
            "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css";
          document.head.appendChild(linkElement);

          // Load Leaflet Routing Machine JS
          const script = document.createElement("script");
          script.src =
            "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.min.js";
          script.async = true;
          script.onload = () => {
            if (window.L && window.L.Routing) {
              resolve(window.L.Routing);
            } else {
              reject(
                new Error("Leaflet Routing Machine was not properly loaded")
              );
            }
          };
          script.onerror = reject;
          document.body.appendChild(script);
        } else {
          reject(new Error("Window is not defined"));
        }
      });
    };

    const initRouting = async () => {
      if (!routeDestination || !hasUserLocation) return;

      try {
        // Load Leaflet Routing Machine if not already loaded
        const RoutingMachine = await loadRoutingMachine();

        // Clean up previous routing control if it exists
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }

        // Create new routing if we have both user location and destination
        if (
          hasUserLocation &&
          routeDestination &&
          routeDestination.latitude &&
          routeDestination.longitude
        ) {
          const startPoint = L.latLng(
            userLocation.latitude,
            userLocation.longitude
          );
          const endPoint = L.latLng(
            routeDestination.latitude,
            routeDestination.longitude
          );

          // Récupérer la configuration du mode de transport actuel
          const config =
            TRANSPORT_CONFIG[transportMode as keyof typeof TRANSPORT_CONFIG];

          // Calculer une distance approximative en ligne droite en km
          const directDistance = calculateDistance(
            startPoint.lat,
            startPoint.lng,
            endPoint.lat,
            endPoint.lng
          );

          // Create the routing control
          routingControlRef.current = RoutingMachine.control({
            waypoints: [startPoint, endPoint],
            routeWhileDragging: true,
            showAlternatives: false,
            fitSelectedRoutes: true,
            lineOptions: {
              styles: [{ color: config.color, opacity: 1, weight: 6 }],
              extendToWaypoints: true,
              missingRouteTolerance: 0,
            },
            createMarker: function () {
              return null;
            }, // Don't create default markers
            addWaypoints: false, // Prevent users from adding waypoints
            router: RoutingMachine.osrmv1({
              serviceUrl: config.serviceUrl,
              profile: config.profile,
            }),
            show: false, // Hide the itinerary panel
          }).addTo(map);

          // Si le service OSRM ne répond pas correctement, utilisez une estimation
          const calculateEstimatedRoute = () => {
            // Facteur de route (routes ne sont pas en ligne droite)
            const routeFactor = 1.3;

            // Distance estimée en km (ligne droite × facteur de route)
            const estimatedDistance = directDistance * routeFactor;

            // Vitesse moyenne approximative en km/h selon le mode
            const speeds = {
              driving: 50, // 50 km/h en voiture (zones urbaines)
              cycling: 30, // 30 km/h en moto
              walking: 5, // 5 km/h à pied
            };

            const speed = speeds[transportMode as keyof typeof speeds];

            // Temps en minutes
            const timeMinutes = Math.round((estimatedDistance / speed) * 60);

            return {
              distance: `${estimatedDistance.toFixed(1)} km (estimé)`,
              time:
                timeMinutes > 60
                  ? `${Math.floor(timeMinutes / 60)}h ${
                      timeMinutes % 60
                    }min (estimé)`
                  : `${timeMinutes} min (estimé)`,
            };
          };

          // Function to handle routing failure
          const handleRoutingFailure = () => {
            console.log("Using estimated route calculation");
            const estimate = calculateEstimatedRoute();
            setRouteInfo(estimate);
          };

          // Get route info when route is calculated
          if (routingControlRef.current) {
            // Set a timeout for OSRM response
            const timeoutId = setTimeout(() => {
              handleRoutingFailure();
            }, 5000);

            routingControlRef.current.on("routesfound", function (e: any) {
              // Clear the timeout as we got a response
              clearTimeout(timeoutId);

              const routes = e.routes;
              const route = routes[0]; // Get the first route

              // Convert distance to kilometers
              const distanceKm = (route.summary.totalDistance / 1000).toFixed(
                1
              );

              // Adjust time based on transport mode
              // OSRM might not correctly calculate times for different modes
              let timeMinutes;

              if (transportMode === "driving") {
                // Use OSRM time estimate for driving
                timeMinutes = Math.round(route.summary.totalTime / 60);
              } else if (transportMode === "cycling") {
                // For cycling, estimate based on 15 km/h average speed
                timeMinutes = Math.round(
                  (route.summary.totalDistance / 1000 / 15) * 60
                );
              } else if (transportMode === "walking") {
                // For walking, estimate based on 5 km/h average speed
                timeMinutes = Math.round(
                  (route.summary.totalDistance / 1000 / 5) * 60
                );
              } else {
                // Fallback to OSRM time
                timeMinutes = Math.round(route.summary.totalTime / 60);
              }

              // Set route information
              setRouteInfo({
                distance: `${distanceKm} km`,
                time:
                  timeMinutes > 60
                    ? `${Math.floor(timeMinutes / 60)}h ${timeMinutes % 60}min`
                    : `${timeMinutes} min`,
              });
            });

            // Handle routing errors
            routingControlRef.current.on("routingerror", function () {
              clearTimeout(timeoutId);
              handleRoutingFailure();
            });
          }

          // Fit map to show both points
          const bounds = L.latLngBounds([
            [startPoint.lat, startPoint.lng],
            [endPoint.lat, endPoint.lng],
          ]);

          map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 15,
          });
        }
      } catch (error) {
        console.error("Error loading routing module:", error);
      }
    };

    initRouting();

    // Cleanup function
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [
    map,
    routeDestination,
    userLocation,
    hasUserLocation,
    setRouteInfo,
    transportMode,
  ]);

  // Map click handler to close popups when clicking elsewhere
  useMapEvents({
    click: () => {
      map.closePopup();
    },
  });

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
  const [selectedPlace, setSelectedPlace] = useState<PlaceSummary | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [routeDrawerOpen, setRouteDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(MADAGASCAR_COORDS);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [locationError, setLocationError] = useState("");
  const [routeDestination, setRouteDestination] = useState<PlaceSummary | null>(
    null
  );
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [transportMode, setTransportMode] = useState("driving"); // Default to driving

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
          (place.bio?.toLowerCase() || "").includes(lowerSearchText) ||
          (place.localisation?.toLowerCase() || "").includes(lowerSearchText)
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
  const filterByDistance = (distance: number, placesToFilter = places) => {
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

  const handlePlaceClick = (place: PlaceSummary) => {
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

  // Handle show directions request
  const handleShowDirections = (place: PlaceSummary) => {
    if (!hasUserLocation) {
      alert(
        "Votre position n'est pas disponible. Veuillez autoriser la localisation."
      );
      getUserLocation();
      return;
    }

    setRouteDestination(place);
    setRouteDrawerOpen(true); // Ouvrir automatiquement le drawer d'itinéraire
    setSelectedPlace(null); // Close any open popup
  };

  // Clear directions
  const clearDirections = () => {
    setRouteDestination(null);
    setRouteInfo(null);
    setRouteDrawerOpen(false);
  };

  // Toggle route drawer visibility without annuler l'itinéraire
  const toggleRouteDrawer = () => {
    setRouteDrawerOpen(!routeDrawerOpen);
  };

  // Change transport mode
  const changeTransportMode = (mode: string) => {
    setTransportMode(mode);
    // Recalculate route if there's an active route
    if (routeDestination) {
      // Trigger a new route calculation
      const tempDestination = routeDestination;
      setRouteDestination(null);
      // Small delay to ensure the previous route is cleared
      setTimeout(() => setRouteDestination(tempDestination), 50);
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
          {/* Map controller to handle flying to locations and routing */}
          <MapController
            selectedPlace={selectedPlace}
            userLocation={userLocation}
            hasUserLocation={hasUserLocation}
            routeDestination={routeDestination}
            setRouteInfo={setRouteInfo}
            transportMode={transportMode}
          />

          {/* User location blue dot - only show if we have a real user location */}
          {hasUserLocation &&
            userLocation.latitude !== 0 &&
            userLocation.longitude !== 0 && (
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={createUserLocationDot()}
                zIndexOffset={1000}
              >
                <Popup closeButton={false}>
                  <div className="text-sm">Votre position</div>
                </Popup>
              </Marker>
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
                              place.latitude!,
                              place.longitude!
                            ).toFixed(1) + " km"
                          : undefined
                      }
                      onShowDirections={handleShowDirections}
                    />
                  </div>{" "}
                </Popup>
              </Marker>
            ) : (
              <React.Fragment key={place.id}></React.Fragment>
            )
          )}
        </MapContainer>

        {/* Route information drawer */}
        <Drawer open={routeDrawerOpen} onOpenChange={setRouteDrawerOpen}>
          <DrawerContent className="z-[1000]">
            <div className="mx-auto w-full max-w-sm">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">
                    Itinéraire vers {routeDestination?.title}
                  </h3>
                </div>
                {routeInfo && (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={
                          transportMode === "driving" ? "default" : "outline"
                        }
                        onClick={() => changeTransportMode("driving")}
                        className="flex-1"
                      >
                        🚗 Voiture
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          transportMode === "cycling" ? "default" : "outline"
                        }
                        onClick={() => changeTransportMode("cycling")}
                        className="flex-1"
                      >
                        🏍️ Moto
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          transportMode === "walking" ? "default" : "outline"
                        }
                        onClick={() => changeTransportMode("walking")}
                        className="flex-1"
                      >
                        🚶 À pied
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      <p className="text-sm">
                        <span className="font-semibold">Distance :</span>{" "}
                        {routeInfo.distance}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Temps estimé :</span>{" "}
                        {routeInfo.time}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={clearDirections}
                      className="mt-2"
                    >
                      Annuler l'itinéraire
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className=" fixed bottom-[4.5rem] right-4 z-50 md:bottom-4 hidden md:flex gap-2">
        {routeInfo && routeDestination && !routeDrawerOpen && (
          <Button className=" w-fit  shadow-lg" onClick={toggleRouteDrawer}>
            <Route size={24} />
          </Button>
        )}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <Button>Rechercher</Button>
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
      </div>
      <div className="fixed bottom-[4.5rem] right-4 z-50 md:bottom-4 flex md:hidden gap-2">
        {routeInfo && routeDestination && !routeDrawerOpen && (
          <Button className=" w-fit  shadow-lg" onClick={toggleRouteDrawer}>
            <Route size={24} />
          </Button>
        )}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button className="">Rechercher</Button>
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
      </div>
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
  }, []);
  if (mounted) return <DynamicMap />;
  return <></>;
};

export default Map;
