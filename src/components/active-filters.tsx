"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface ActiveFiltersProps {
  selectedMenus: string[];
  placeType: string;
  rating: number;
  priceInDollars: number;
  searchTerm: string;
  menus: { id: string; name: string }[];
  onRemoveMenu: (menuId: string) => void;
  onRemovePlaceType: () => void;
  onRemoveRating: () => void;
  onRemovePrice: () => void;
  onRemoveSearch: () => void;
}

export function ActiveFilters({
  selectedMenus,
  placeType,
  rating,
  priceInDollars,
  searchTerm,
  menus,
  onRemoveMenu,
  onRemovePlaceType,
  onRemoveRating,
  onRemovePrice,
  onRemoveSearch,
}: ActiveFiltersProps) {
  // Check if there are any active filters
  const hasActiveFilters =
    selectedMenus.length > 0 ||
    placeType ||
    rating > 0 ||
    priceInDollars > 0 ||
    searchTerm;

  if (!hasActiveFilters) {
    return null;
  }

  // Get menu names from IDs
  const getMenuName = (menuId: string) => {
    const menu = menus.find((m) => m.id === menuId);
    return menu ? menu.name : menuId;
  };

  // Get rating text
  const getRatingText = (rating: number) => {
    const ratingTexts: Record<number, string> = {
      1: "Je recommande",
      2: "Il faut y aller",
      3: "Vaut vraiment le detour",
    };
    return ratingTexts[rating] || `Note: ${rating}`;
  };

  // Get price text
  const getPriceText = (price: number) => {
    const priceTexts: Record<number, string> = {
      1: "Très bon marché",
      2: "Bon rapport qualité-prix",
      3: "Assez cher",
      4: "Très cher",
    };
    return priceTexts[price] || `Prix: ${price}`;
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      <div className="text-sm text-muted-foreground mr-1 flex items-center">
        Filtres actifs:
      </div>

      {searchTerm && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>Recherche: {searchTerm}</span>
          <X className="h-3 w-3 cursor-pointer" onClick={onRemoveSearch} />
        </Badge>
      )}

      {selectedMenus.map((menuId) => (
        <Badge
          key={menuId}
          variant="secondary"
          className="flex items-center gap-1"
        >
          <span>{getMenuName(menuId)}</span>
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemoveMenu(menuId)}
          />
        </Badge>
      ))}

      {placeType && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>Type: {placeType}</span>
          <X className="h-3 w-3 cursor-pointer" onClick={onRemovePlaceType} />
        </Badge>
      )}

      {rating > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>{getRatingText(rating)}</span>
          <X className="h-3 w-3 cursor-pointer" onClick={onRemoveRating} />
        </Badge>
      )}

      {priceInDollars > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>{getPriceText(priceInDollars)}</span>
          <X className="h-3 w-3 cursor-pointer" onClick={onRemovePrice} />
        </Badge>
      )}
    </div>
  );
}
