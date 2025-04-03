"use client";

import { Check, DollarSign } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { Button } from '@/components/ui/button';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from '@/components/ui/command';
import {
    MultiSelect, MultiSelectContent, MultiSelectEmpty, MultiSelectGroup, MultiSelectItem,
    MultiSelectList, MultiSelectSearch, MultiSelectTrigger, MultiSelectValue
} from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn, fetcher } from '@/lib/utils';

import type { PlaceType } from "@prisma/client";

interface SearchFiltersProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  priceInDollars: number;
  setPriceInDollars: (value: number) => void;
  rating: number;
  setRating: (value: number) => void;
  selectedMenus: string[];
  setSelectedMenus: (value: string[]) => void;
  placeType: string;
  setPlaceType: (value: string) => void;
  menus: { id: string; name: string }[];
  formatPrice: (value: number) => string;
  resetFilters: () => void;
}

export function SearchFilters({
  priceRange,
  setPriceRange,
  priceInDollars,
  setPriceInDollars,
  rating,
  setRating,
  selectedMenus,
  setSelectedMenus,
  placeType,
  setPlaceType,
  menus,
  formatPrice,
  resetFilters,
}: SearchFiltersProps) {
  const [open, setOpen] = useState(false);
  const { data: placeTypes } = useSWR<PlaceType[]>("/api/place-types", fetcher);
  const searchParams = useSearchParams();

  // Récupérer les menus depuis les paramètres d'URL lors du chargement initial
  useEffect(() => {
    const menusParam = searchParams.get("menus");
    if (menusParam) {
      const menuIds = menusParam.split(",");
      setSelectedMenus(menuIds);
    }

    // Vous pouvez également récupérer d'autres paramètres ici
    // et les appliquer aux filtres correspondants
  }, [searchParams, setSelectedMenus]);

  if (placeTypes) {
    return (
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

        <div className="space-y-4 mb-4">
          <h3 className="font-medium">Type de lieu</h3>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {placeType ? placeType : "Sélectionner un type"}
                <DollarSign className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un type..." />
                <CommandEmpty>Aucun type trouvé</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {placeTypes.map((type) => (
                      <CommandItem
                        key={type.id}
                        value={type.name}
                        onSelect={(currentValue) => {
                          setPlaceType(
                            currentValue === placeType ? "" : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            placeType === type.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {type.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
        </div>

        <div className="flex justify-end">
          <Button
            onClick={resetFilters}
            variant="outline"
            className="mr-2 text-red-600 hover:text-red-800"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    );
  }
  return <></>;
}
