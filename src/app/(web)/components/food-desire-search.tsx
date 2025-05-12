"use client";

import { ChevronRight, Loader, Search, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, fetcher } from "@/lib/utils";

interface FoodDesireSearchProps {
  className?: string;
}

export function FoodDesireSearch({ className }: FoodDesireSearchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  // Fetch menus for filter
  const { data: menus } = useSWR<{ id: string; name: string }[]>(
    "/api/menus",
    fetcher
  );
  const handleSearch = () => {
    setIsLoading(true);
    window.location.href = `/places?q=${query}`;
  };

  return (
    <>
      <div className={cn("relative z-10", className)}>
        <Card
          className={cn(
            "overflow-hidden border-none bg-white/95 backdrop-blur-sm"
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
                  <Input
                    placeholder="Rechercher un type de cuisine..."
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {typeof window !== "undefined" && (
                    <div
                      onClick={handleSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-primary transition-colors "
                    >
                      <Search className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground text-sm">
                  Sélectionnez tes envies culinaires et découvrez les meilleurs
                  restaurants qui correspondent à tes goûts.
                </p>
                {menus && (
                  <div className="mt-4 flex  gap-2 flex-wrap items-center pb-4">
                    <span className="text-sm text-muted-foreground">
                      Populaires:
                    </span>
                    {menus.slice(0, 5).map((menu) => (
                      <Link key={menu.id} href={`/places?q=${menu.name}`}>
                        <Badge
                          variant={"outline"}
                          className=" -sm -fast cursor-pointer"
                        >
                          {menu.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-[#47556c] to-[#2e3746] flex items-center justify-center p-6 md:p-8 ">
                <Button
                  onClick={handleSearch}
                  size="lg"
                  variant="secondary"
                  className=" hover-lift h-14 px-6 text-slate-600 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:bg-white mb-8 max-lg:mb-0  -shadow-dark"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      Recherche...
                      <Loader className="animate-spin ml-2 h-5 w-5 text-primary" />
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
    </>
  );
}
