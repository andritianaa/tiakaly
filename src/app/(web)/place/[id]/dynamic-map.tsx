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
    speedFactor: 0.5,
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
  userLocation: { latitude: number; longitude: number } | null;
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
  const routingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      userLocation &&
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
      // Nettoyer tout timeout précédent
      if (routingTimeoutRef.current) {
        clearTimeout(routingTimeoutRef.current);
        routingTimeoutRef.current = null;
      }

      if (!routeDestination || !hasUserLocation || !userLocation) return;

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
          userLocation &&
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
            routingTimeoutRef.current = setTimeout(() => {
              handleRoutingFailure();
            }, 5000);

            routingControlRef.current.on("routesfound", function (e: any) {
              // Clear the timeout as we got a response
              if (routingTimeoutRef.current) {
                clearTimeout(routingTimeoutRef.current);
                routingTimeoutRef.current = null;
              }

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
              if (routingTimeoutRef.current) {
                clearTimeout(routingTimeoutRef.current);
                routingTimeoutRef.current = null;
              }
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

      if (routingTimeoutRef.current) {
        clearTimeout(routingTimeoutRef.current);
        routingTimeoutRef.current = null;
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

// Composant de la barre de statut
function LocationStatusBar({
  isLocating,
  locationError,
  hasUserLocation,
  getUserLocation,
}: {
  isLocating: boolean;
  locationError: string;
  hasUserLocation: boolean;
  getUserLocation: () => void;
}) {
  if (isLocating) {
    return (
      <div className=" bg-gray-200  p-2 z-10 flex justify-between items-center">
        <span>Recherche de votre position...</span>
        <div className="animate-spin h-5 w-5 border-2 border-black rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!hasUserLocation) {
    return (
      <div className=" bg-yellow-500 text-white p-2 z-10 flex justify-between items-center">
        <span>Position non disponible</span>
        <button
          onClick={getUserLocation}
          className="bg-white text-yellow-600 px-3 py-1 rounded text-sm"
        >
          Autoriser la localisation
        </button>
      </div>
    );
  }

  return null;
}

// Composant de contrôle de transport
function TransportControls({ routeInfo }: { routeInfo: RouteInfo | null }) {
  return (
    <div className="flex flex-col space-y-2">
      {/* Afficher les infos d'itinéraire */}
      {routeInfo && (
        <div className="p-2 pb-0 rounded-md flex justify-between">
          <div>
            <strong>Distance:</strong> {routeInfo.distance}
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
}

export default function PlaceMap({
  latitude,
  longitude,
  title,
  place,
}: PlaceMapProps) {
  const position: [number, number] = [latitude, longitude];
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [transportMode, setTransportMode] = useState("driving"); // Default to driving
  const [routeDestination, setRouteDestination] =
    useState<PlaceWithRelations | null>(null);
  const [locationRetryCount, setLocationRetryCount] = useState(0);

  // Get user location with improved handling
  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError("");
    setLocationRetryCount((prev) => prev + 1);

    // Force clear previous location on retry
    if (locationRetryCount > 0) {
      setUserLocation(null);
      setHasUserLocation(false);
    }

    if (navigator.geolocation) {
      // Options plus agressives pour la géolocalisation
      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      };

      const geolocationId = navigator.geolocation.watchPosition(
        (position) => {
          const userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          console.log("User location obtained:", userCoords);

          // Ne définir l'emplacement que s'il est valide
          if (userCoords.latitude !== 0 && userCoords.longitude !== 0) {
            setUserLocation(userCoords);
            setHasUserLocation(true);
            setIsLocating(false);

            // Arrêter le watching après avoir obtenu une position valide
            navigator.geolocation.clearWatch(geolocationId);

            // Si nous avons une destination, essayez d'obtenir un itinéraire immédiatement
            if (routeDestination) {
              handleShowDirections(routeDestination);
            }
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMsg = "";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg =
                "Accès à la localisation refusé. Vérifiez les paramètres de votre navigateur.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg =
                "Position indisponible. Vérifiez que votre GPS est activé.";
              break;
            case error.TIMEOUT:
              errorMsg = "Délai d'attente dépassé pour obtenir votre position.";
              break;
            default:
              errorMsg =
                "Erreur inconnue lors de la récupération de votre position.";
          }
          setLocationError(errorMsg);
          setIsLocating(false);
          setHasUserLocation(false);
          navigator.geolocation.clearWatch(geolocationId);
        },
        options
      );

      // Définir un délai d'expiration global au cas où watchPosition ne se déclencherait jamais
      setTimeout(() => {
        if (isLocating) {
          setIsLocating(false);
          setLocationError("Délai d'attente dépassé. Veuillez réessayer.");
          navigator.geolocation.clearWatch(geolocationId);
        }
      }, 20000);
    } else {
      setLocationError("Géolocalisation non supportée par ce navigateur");
      setIsLocating(false);
    }
  };

  // Get user location automatically when component mounts
  useEffect(() => {
    getUserLocation();

    // Nettoyage à la démontage du composant
    return () => {
      // Si nous avons des watch position en cours, les nettoyer
      if (navigator.geolocation) {
        // Note: nous ne pouvons pas accéder à geolocationId ici
        // donc cette méthode est moins précise mais suffisante en cas de démontage
      }
    };
  }, []);

  // Handle show directions request with improved error handling
  const handleShowDirections = (place: PlaceWithRelations) => {
    setRouteDestination(place);

    if (!hasUserLocation) {
      // Au lieu de montrer une alerte, démarrer automatiquement la localisation
      // avec une notification dans la barre d'état
      getUserLocation();
    }
  };

  // Définir la destination initiale une fois lors du montage du composant
  useEffect(() => {
    if (place) {
      setRouteDestination(place);
    }
  }, [place]);

  // Mettre à jour les directions lorsque le mode de transport change
  useEffect(() => {
    if (routeDestination && hasUserLocation) {
      setRouteInfo(null); // Réinitialiser les infos d'itinéraire
      // Le trajet sera recalculé par le MapController
    }
  }, [transportMode]);

  return (
    <>
      <div className="relative w-full h-[300px] rounded-md overflow-hidden">
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
            userLocation &&
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

          {/* Marqueur de la destination */}
          <Marker position={position} icon={icon}>
            <Popup>{title}</Popup>
          </Marker>
        </MapContainer>

        {/* Contrôles de transport en haut */}
      </div>
      <TransportControls routeInfo={routeInfo} />

      {/* Barre de statut de localisation en bas */}
      <LocationStatusBar
        isLocating={isLocating}
        locationError={locationError}
        hasUserLocation={hasUserLocation}
        getUserLocation={getUserLocation}
      />
    </>
  );
}
