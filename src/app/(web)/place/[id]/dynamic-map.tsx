"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { PlaceWithRelations } from "@/types/place";

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

// Fix pour les icônes Leaflet dans Next.js
const icon = L.icon({
  iconUrl: "/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

// Types pour les informations de l'itinéraire
interface RouteInfo {
  distance: string;
  time: string;
}

interface MapControllerProps {
  selectedPlace: PlaceWithRelations | null;
  userLocation: { latitude: number; longitude: number };
  hasUserLocation: boolean;
  routeDestination: PlaceWithRelations | null;
  setRouteInfo: React.Dispatch<React.SetStateAction<RouteInfo | null>>;
  transportMode: string;
}

interface PlaceMapProps {
  latitude: number;
  longitude: number;
  title: string;
  place: PlaceWithRelations;
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
const MADAGASCAR_COORDS = {
  latitude: -18.902379,
  longitude: 47.533765,
};

export default function PlaceMap({
  latitude,
  longitude,
  title,
  place,
}: PlaceMapProps) {
  const position: [number, number] = [latitude, longitude];
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState(MADAGASCAR_COORDS);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);

  const [locationError, setLocationError] = useState("");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [transportMode, setTransportMode] = useState("driving"); // Default to driving
  const [routeDestination, setRouteDestination] =
    useState<PlaceWithRelations | null>(null);
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

  // Handle show directions request
  const handleShowDirections = (place: PlaceWithRelations) => {
    if (!hasUserLocation) {
      alert(
        "Votre position n'est pas disponible. Veuillez autoriser la localisation."
      );
      getUserLocation();
      return;
    }

    setRouteDestination(place);
  };

  useEffect(() => {
    handleShowDirections(place);
  }, [place]);

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* Map controller to handle flying to locations and routing */}
      <MapController
        selectedPlace={place}
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
      <Marker position={position} icon={icon}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}
