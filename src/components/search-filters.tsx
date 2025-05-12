"use client";

import { Check, DollarSign } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select-name";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, fetcher } from "@/lib/utils";

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

const ratingTexts = {
  1: "Je recommande",
  2: "Il faut y aller",
  3: "Vaut vraiment le detour",
};
const pricingText = {
  1: "C'est très bon marché",
  2: "Super rapport qualité-prix",
  3: "Assez cher",
  4: "Très cher",
};

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
                    <MultiSelectItem
                      key={menu.id}
                      value={menu.id}
                      name={menu.name}
                    >
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-medium">Prix</h3>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                {[1, 2, 3, 4].map((value) => (
                  <Tooltip key={value}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setPriceInDollars(value)}
                        className={`flex items-center justify-center h-10 w-10 rounded-full border hover-lift ${
                          priceInDollars >= value
                            ? "bg-primary text-primary-foreground"
                            : "bg-background"
                        }`}
                      >
                        <DollarSign
                          className={cn("size-5", priceInDollars >= value)}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{pricingText[value as keyof typeof pricingText]}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-medium">Recommandation</h3>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                {[1, 2, 3].map((value) => (
                  <Tooltip key={value}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setRating(value)}
                        className={`flex items-center justify-center h-10 w-10 rounded-full border hover-lift ${
                          rating >= value
                            ? "bg-primary text-primary-foreground"
                            : "bg-background"
                        }`}
                      >
                        <Check className={cn("size-5", rating >= value)} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{ratingTexts[value as keyof typeof ratingTexts]}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
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
