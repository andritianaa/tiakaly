"use client";

import { ArrowRight, ChevronRight, Search, UtensilsCrossed } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { PlaceResume } from '@/components/place-resume';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    MultiSelect, MultiSelectContent, MultiSelectEmpty, MultiSelectGroup, MultiSelectItem,
    MultiSelectList, MultiSelectSearch, MultiSelectTrigger, MultiSelectValue
} from '@/components/ui/multi-select';
import { cn, fetcher } from '@/lib/utils';

interface FoodDesireSearchProps {
  className?: string;
}

export function FoodDesireSearch({ className }: FoodDesireSearchProps) {
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [menus, setMenus] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [searchFocus, setSearchFocus] = useState(false);

  // Fetch menus for filter
  const { data: menusData } = useSWR<{ id: string; name: string }[]>(
    "/api/menus",
    fetcher
  );

  // Fetch all places
  const { data: placesData, isLoading: isLoadingPlaces } = useSWR(
    dialogOpen ? "/api/places/all" : null,
    fetcher
  );

  useEffect(() => {
    if (menusData) {
      setMenus(menusData);
    }
  }, [menusData]);

  useEffect(() => {
    if (placesData) {
      setPlaces(placesData);
    }
  }, [placesData]);

  // Automatically update results when selections change in the dialog
  useEffect(() => {
    if (dialogOpen) {
      // No need to call handleSearch() as the SWR hook will handle the data fetching
      // Just update the loading state for visual feedback
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [selectedMenus, dialogOpen]);

  // Filtrer les lieux en fonction des menus sélectionnés
  const filteredPlaces = useMemo(() => {
    if (!places.length) return [];

    return places.filter((place) => {
      // Menu filter - Logique ET (tous les menus sélectionnés doivent être présents)
      const matchesMenus =
        selectedMenus.length === 0 ||
        (place.MenuPlace &&
          selectedMenus.every((menuId) =>
            place.MenuPlace.some((mp: any) => mp.menuId === menuId)
          ));

      return matchesMenus;
    });
  }, [places, selectedMenus]);

  const handleSearch = () => {
    // if (selectedMenus.length === 0) return;

    setIsLoading(true);
    setDialogOpen(true);

    // Le chargement sera géré par le hook SWR
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Obtenir les noms des menus sélectionnés
  const selectedMenuNames = useMemo(() => {
    return selectedMenus.map((id) => {
      const menu = menus.find((m) => m.id === id);
      return menu ? menu.name : id;
    });
  }, [selectedMenus, menus]);

  return (
    <>
      <div className={cn("relative z-10", className)}>
        <Card
          className={cn(
            "overflow-hidden border-none bg-white/95 backdrop-blur-sm",
            searchFocus ? "ring-2 ring-primary ring-offset-2" : ""
          )}
        >
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] overflow-hidden">
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    J'ai envie de...
                  </h2>
                </div>

                <div className="relative">
                  <MultiSelect
                    value={selectedMenus}
                    onValueChange={(values) => setSelectedMenus(values)}
                  >
                    <MultiSelectTrigger className="w-full h-14 text-lg border-2 bg-background/50 hover:bg-background/80 transition-colors">
                      <MultiSelectValue placeholder="Vos envies culinaires" />
                    </MultiSelectTrigger>
                    <MultiSelectContent className="max-h-[300px]">
                      <MultiSelectSearch placeholder="Rechercher un type de cuisine..." />
                      <MultiSelectList>
                        <MultiSelectGroup>
                          {menus.map((menu) => (
                            <MultiSelectItem
                              key={menu.id}
                              value={menu.id}
                              className="py-2"
                            >
                              {menu.name}
                            </MultiSelectItem>
                          ))}
                        </MultiSelectGroup>
                      </MultiSelectList>
                      <MultiSelectEmpty>Aucun menu trouvé</MultiSelectEmpty>
                    </MultiSelectContent>
                  </MultiSelect>
                  <Search className="absolute right-10 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>

                <p className="text-muted-foreground text-sm">
                  Sélectionnez vos envies culinaires et découvrez les meilleurs
                  restaurants qui correspondent à vos goûts.
                </p>
                <div className="mt-4 flex  gap-2 flex-wrap items-center pb-4">
                  <span className="text-sm text-muted-foreground">
                    Populaires:
                  </span>
                  {menus.slice(0, 5).map((menu) => (
                    <Badge
                      key={menu.id}
                      variant={"outline"}
                      onClick={() => {
                        setSelectedMenus([menu.id]);
                        handleSearch();
                      }}
                    >
                      {menu.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary to-amber-500 flex items-center justify-center p-6 md:p-8">
                <Button
                  onClick={handleSearch}
                  size="lg"
                  variant="secondary"
                  className="h-14 px-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-primary hover:bg-white/90 mb-8"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Recherche...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Découvrir
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="lg:min-w-[672px] lg:max-w-2xl min-h-[90vh] max-h-[90vh] flex flex-col ">
          <DialogHeader className="flex flex-col items-start justify-between border-b pb-4">
            <div className="w-full items-center justify-center flex flex-col">
              <DialogTitle className="text-2xl font-bold">
                Résultats de recherche
              </DialogTitle>
              <p className="text-muted-foreground mt-1 text-center">
                {selectedMenuNames.length > 0 ? (
                  <>
                    Lieux proposant :{" "}
                    <span className="font-medium">
                      {selectedMenuNames.join(", ")}
                    </span>
                  </>
                ) : (
                  "Tous les lieux"
                )}
              </p>
            </div>

            <div className="w-full mt-4">
              <MultiSelect
                value={selectedMenus}
                onValueChange={(values) => setSelectedMenus(values)}
              >
                <MultiSelectTrigger className="w-full h-12 text-md border-2 bg-background/50 hover:bg-background/80 transition-colors">
                  <MultiSelectValue placeholder="Vos envies culinaires" />
                </MultiSelectTrigger>
                <MultiSelectContent className="max-h-[300px]">
                  <MultiSelectSearch placeholder="Rechercher un type de cuisine..." />
                  <MultiSelectList>
                    <MultiSelectGroup>
                      {menus.map((menu) => (
                        <MultiSelectItem
                          key={menu.id}
                          value={menu.id}
                          className="py-2"
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
          </DialogHeader>

          {/* Filter chips removed as they're redundant with the MultiSelect above */}

          <div className="flex-1 pr-4 max-h-[70vh]  overflow-y-auto">
            {isLoadingPlaces ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="text-muted-foreground">
                  Chargement des résultats...
                </p>
              </div>
            ) : filteredPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
                {filteredPlaces.map((place) => (
                  <PlaceResume key={place.id} {...place} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Nous n'avons pas trouvé de restaurants correspondant à tous
                  vos critères. Essayez de modifier vos filtres.
                </p>
                {selectedMenus.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMenus([])}
                    className="mt-2"
                  >
                    Essayer sans filtres
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center border-t">
            <div className="text-sm text-muted-foreground">
              {filteredPlaces.length} résultat
              {filteredPlaces.length !== 1 ? "s" : ""} trouvé
              {filteredPlaces.length !== 1 ? "s" : ""}
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a
                href={`/places?menus=${selectedMenus.join(",")}`}
                className="flex items-center"
              >
                Voir tous les résultats
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
