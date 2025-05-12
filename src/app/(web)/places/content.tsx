"use client";

import type React from "react";

import { Filter, Search, SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { ActiveFilters } from "@/components/active-filters";
import { PlaceResume } from "@/components/place-resume";
import { SearchFilters } from "@/components/search-filters";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/utils";

import type { PlaceType } from "@prisma/client";

import type { PlaceSummary } from "@/types/place";
// Liste des types de lieux (à remplacer par des données réelles)

export default function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);
  const [priceInDollars, setPriceInDollars] = useState<number>(0);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [placeType, setPlaceType] = useState<string>("");
  const [allPlaces, setAllPlaces] = useState<PlaceSummary[]>([]);
  const [menus, setMenus] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: placeTypes } = useSWR<PlaceType[]>("/api/place-types", fetcher);

  // Fetch all places once
  useEffect(() => {
    const fetchAllPlaces = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/places/all");
        if (!response.ok) throw new Error("Failed to fetch places");

        const data = await response.json();
        setAllPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPlaces();
  }, []);

  // Fetch menus for filter
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/menus");
        if (!response.ok) throw new Error("Failed to fetch menus");

        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, []);

  // Modifier la fonction de filtrage pour inclure le placeType et changer la logique des menus
  const filteredPlaces = useMemo(() => {
    if (!allPlaces.length) return [];

    return allPlaces.filter((place) => {
      // Text search filter
      const matchesSearch =
        !searchTerm ||
        place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (place.bio &&
          place.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (place.keywords &&
          place.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      // Price range filter
      const matchesPriceRange =
        place.priceMin >= priceRange[0] && place.priceMax <= priceRange[1];

      // Price in dollars filter
      const matchesPriceInDollars =
        priceInDollars === 0 ||
        (place.priceInDollars && place.priceInDollars <= priceInDollars);

      // Menu filter - Logique ET (tous les menus sélectionnés doivent être présents)
      const matchesMenus =
        selectedMenus.length === 0 ||
        (place.MenuPlace &&
          selectedMenus.every((menuId) =>
            place.MenuPlace.some((mp) => mp.menuId === menuId)
          ));

      // Rating filter
      const matchesRating = rating === 0 || place.rating >= rating;

      // Place type filter
      const matchesPlaceType =
        !placeType ||
        (place.type && place.type.toLowerCase() === placeType.toLowerCase());

      return (
        matchesSearch &&
        matchesPriceRange &&
        matchesPriceInDollars &&
        matchesMenus &&
        matchesRating &&
        matchesPlaceType
      );
    });
  }, [
    allPlaces,
    searchTerm,
    priceRange,
    priceInDollars,
    selectedMenus,
    rating,
    placeType,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set("q", searchTerm);
    else params.delete("q");

    router.push(`/places?${params.toString()}`);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetFilters = () => {
    setPriceRange([0, 200000]);
    setPriceInDollars(0);
    setRating(0);
    setSelectedMenus([]);
    setPlaceType("");
  };

  // Handler functions for removing individual filters
  const handleRemoveMenu = (menuId: string) => {
    setSelectedMenus(selectedMenus.filter((id) => id !== menuId));
  };

  const handleRemovePlaceType = () => {
    setPlaceType("");
  };

  const handleRemoveRating = () => {
    setRating(0);
  };

  const handleRemovePrice = () => {
    setPriceInDollars(0);
  };

  const handleRemoveSearch = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/places?${params.toString()}`);
  };

  return (
    <div className="py-8 mt-14 px-4">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <p className="text-2xl font-bold -mb-4">Les meilleurs spots</p>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par titre, localisation, mots-clés..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">
              <SearchIcon /> <span className="max-lg:hidden">Rechercher</span>
            </Button>
          </form>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="max-lg:hidden">Filtres</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filtres de recherche</DialogTitle>
              </DialogHeader>

              <SearchFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceInDollars={priceInDollars}
                setPriceInDollars={setPriceInDollars}
                rating={rating}
                setRating={setRating}
                selectedMenus={selectedMenus}
                setSelectedMenus={setSelectedMenus}
                placeType={placeType}
                setPlaceType={setPlaceType}
                menus={menus}
                formatPrice={formatPrice}
                resetFilters={resetFilters}
              />
            </DialogContent>
          </Dialog>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 md:hidden"
              >
                <Filter className="h-4 w-4" />
                <span className="max-lg:hidden">Filtres</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4">
                <SearchFilters
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  priceInDollars={priceInDollars}
                  setPriceInDollars={setPriceInDollars}
                  rating={rating}
                  setRating={setRating}
                  selectedMenus={selectedMenus}
                  setSelectedMenus={setSelectedMenus}
                  placeType={placeType}
                  setPlaceType={setPlaceType}
                  menus={menus}
                  formatPrice={formatPrice}
                  resetFilters={resetFilters}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Active Filters Component */}
        <ActiveFilters
          selectedMenus={selectedMenus}
          placeType={placeType}
          rating={rating}
          priceInDollars={priceInDollars}
          searchTerm={searchTerm}
          menus={menus}
          onRemoveMenu={handleRemoveMenu}
          onRemovePlaceType={handleRemovePlaceType}
          onRemoveRating={handleRemoveRating}
          onRemovePrice={handleRemovePrice}
          onRemoveSearch={handleRemoveSearch}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3  gap-4">
            {filteredPlaces.map((place) => (
              <PlaceResume key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun résultat trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
