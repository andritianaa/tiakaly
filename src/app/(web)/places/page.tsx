"use client";

import type React from "react";

import { Check, DollarSign, Filter, Search, SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { PlaceResume } from '@/components/place-resume';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    MultiSelect, MultiSelectContent, MultiSelectEmpty, MultiSelectGroup, MultiSelectItem,
    MultiSelectList, MultiSelectSearch, MultiSelectTrigger, MultiSelectValue
} from '@/components/ui/multi-select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

import type { PlaceSummary } from "@/types/place";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);
  const [priceInDollars, setPriceInDollars] = useState<number>(0);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [allPlaces, setAllPlaces] = useState<PlaceSummary[]>([]);
  const [menus, setMenus] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Ajouter l'état pour le rating
  const [rating, setRating] = useState<number>(0);

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

  // Modifier la fonction de filtrage pour inclure le rating
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
        (place.priceInDollars && place.priceInDollars >= priceInDollars);

      // Menu filter
      const matchesMenus =
        selectedMenus.length === 0 ||
        (place.MenuPlace &&
          place.MenuPlace.some((mp) => selectedMenus.includes(mp.menuId)));

      // Rating filter
      const matchesRating = rating === 0 || place.rating >= rating;

      return (
        matchesSearch &&
        matchesPriceRange &&
        matchesPriceInDollars &&
        matchesMenus &&
        matchesRating
      );
    });
  }, [
    allPlaces,
    searchTerm,
    priceRange,
    priceInDollars,
    selectedMenus,
    rating,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set("q", searchTerm);
    else params.delete("q");

    router.push(`/search?${params.toString()}`);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto py-8 mt-14 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
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
              <SearchIcon /> <span className="max-md:hidden">Rechercher</span>
            </Button>
          </form>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="max-md:hidden">Filtres</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filtres de recherche</DialogTitle>
              </DialogHeader>

              {/* Remplacer la section des filtres dans le DialogContent */}
              <div className="grid gap-6 py-4">
                <div className="space-y-4 mb-4">
                  <h3 className="font-medium">Menus</h3>
                  <MultiSelect
                    value={selectedMenus}
                    onValueChange={(values) => setSelectedMenus(values)}
                  >
                    <MultiSelectTrigger>
                      <MultiSelectValue placeholder="Sélectionner des menus" />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                      <MultiSelectSearch placeholder="Rechercher un menu..." />
                      <MultiSelectList>
                        <MultiSelectGroup>
                          {menus.map((menu) => (
                            <MultiSelectItem key={menu.id} value={menu.id}>
                              {menu.name}
                            </MultiSelectItem>
                          ))}
                        </MultiSelectGroup>
                      </MultiSelectList>
                      <MultiSelectEmpty>Aucun menu trouvé</MultiSelectEmpty>
                    </MultiSelectContent>
                  </MultiSelect>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Fourchette de prix</h3>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={200000}
                      step={1000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Recommandation</h3>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className={`flex items-center justify-center h-10 w-10 rounded-full border ${
                            rating >= value
                              ? "bg-primary text-primary-foreground"
                              : "bg-background"
                          }`}
                        >
                          <Check className={cn("size-5", rating >= value)} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Prix</h3>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPriceInDollars(value)}
                          className={`flex items-center justify-center h-10 w-10 rounded-full border ${
                            priceInDollars >= value
                              ? "bg-primary text-primary-foreground"
                              : "bg-background"
                          }`}
                        >
                          <DollarSign
                            className={cn("size-5", priceInDollars >= value)}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                {/* Mettre à jour le bouton de réinitialisation pour inclure le rating */}
                <Button
                  onClick={() => {
                    setPriceRange([0, 200000]);
                    setPriceInDollars(0);
                    setRating(0);
                    setSelectedMenus([]);
                  }}
                  variant="outline"
                  className="mr-2"
                >
                  Réinitialiser
                </Button>
                <Button>Appliquer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaces.map((place) => (
              <PlaceResume key={place.id} {...place} />
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
