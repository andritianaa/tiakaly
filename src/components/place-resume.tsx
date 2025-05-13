"use client";

import type React from "react";

import { Check, DollarSign, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PlaceBookmark } from "@/components/bookmark/place-bookmark";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { PlaceSummary } from "@/types/place";

export type PlaceCardProps = {
  place: PlaceSummary;
  mapMode?: boolean;
  onMapClick?: (place: PlaceSummary) => void;
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

export const PlaceResume = ({
  place,
  mapMode = false,
  onMapClick,
}: PlaceCardProps) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  // Get user location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(userCoords);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  // Calculate distance when user location is available
  useEffect(() => {
    if (userLocation && place.latitude && place.longitude) {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.latitude,
        place.longitude
      );

      if (dist < 1) {
        setDistance(Math.round(dist * 1000) + " m");
      } else {
        setDistance(parseFloat(dist.toFixed(1)).toString() + " km");
      }
    }
  }, [userLocation, place]);

  const handleClick = (e: React.MouseEvent) => {
    if (mapMode && onMapClick) {
      e.preventDefault();
      onMapClick(place);
    }
  };

  return (
    <TooltipProvider>
      <div className="relative rounded-lg overflow-hidden bg-muted">
        <PlaceBookmark placeId={place.id} />
        <Link
          href={mapMode ? `/map` : `/place/${place.id}`}
          key={place.title}
          className="relative overflow-hidden rounded-lg max-h-[40vh] min-h-[40vh] bg-muted"
          onClick={handleClick}
        >
          <Image
            src={place.mainMedia!.url || "/placeholder.svg"}
            width={500}
            height={500}
            alt=""
            className="transition-transform duration-300 hover:scale-105 h-full w-full object-cover max-h-[40vh] min-h-[40vh]"
          />

          <div className=" bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 w-full h-[60%]"></div>
          <div className="absolute bottom-0 p-2 w-full text-white">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-full">
                  <div className="flex w-full flex-col items-start justify-start">
                    <p className="text-2xl font-bold  max-md:text-lg text-startflex-colitems-start">
                      {place.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center">
                        {place.priceInDollars && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex">
                                {" "}
                                {/* Single wrapper element */}
                                {[1, 2, 3, 4].map((dollar) => (
                                  <span
                                    key={dollar}
                                    className={
                                      dollar <= place.priceInDollars!
                                        ? ""
                                        : "hidden"
                                    }
                                  >
                                    <DollarSign className="size-4" />
                                  </span>
                                ))}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="p-0">
                                {place.priceInDollars === 1
                                  ? "Petit budget"
                                  : place.priceInDollars === 2
                                  ? "Budget moyen"
                                  : "Gros budget"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex items-center justify-center">
                        {[1, 2, 3].map((star) => (
                          <Check
                            key={star}
                            color={`${
                              star <= place.rating ? "#3df50a" : "#9e958e"
                            }`}
                            className="size-6 max-md:size-4"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <MapPin className="size-4 mr-1 max-md:hidden" />
                      <span className="line-clamp-1">{place.localisation}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="line-clamp-2 max-md:hidden">{place.bio}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="items-center hidden">
                  <span>
                    Entre{" "}
                    {place.priceMin
                      .toLocaleString("fr-FR", { useGrouping: true })
                      .replace(/\s/g, ".")}{" "}
                    {" et "}
                    {place.priceMax
                      .toLocaleString("fr-FR", { useGrouping: true })
                      .replace(/\s/g, ".")}{" "}
                    Ar
                  </span>
                </div>
              </div>
            </div>
            {distance && place.longitude !== 0 && (
              <span className="flex items-center py-0.5 rounded-full max-lg:ml-0">
                <span className="text-sm font-medium">A {distance}</span>
              </span>
            )}

            {place.longitude == 0 && (
              <span className="flex items-center py-0.5 rounded-full max-lg:ml-0">
                <span className="text-sm font-medium">Commande en ligne</span>
              </span>
            )}
          </div>
        </Link>
      </div>
    </TooltipProvider>
  );
};
