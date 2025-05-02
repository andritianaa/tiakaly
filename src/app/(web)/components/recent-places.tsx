"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

import Bounce from "@/components/bounce";
import { PlaceCard } from "@/components/place-card";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";

import type { PlaceSummary } from "@/types/place";
export default function RecentPlaces() {
  // Récupération des données directement dans le composant
  const { data: places, isLoading } = useSWR<PlaceSummary[]>(
    "/api/places/all",
    fetcher
  );

  return (
    <div className="mb-24 max-lg:mb-8">
      {isLoading ? (
        <Bounce>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 bg-muted animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        </Bounce>
      ) : !places ? (
        <div className="text-center py-12 bg-secondary rounded-xl">
          <p className="text-muted-foreground text-lg">
            Aucun lieu n'est disponible pour le moment. Revenez bientôt pour
            découvrir nos nouveaux lieux !
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl p-6 md:p-8 max-w-4xl mx-auto max-lg:p-0  ">
            <Bounce>
              <h2 className="max-lg:mb-4 text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#47556c] to-[#2e3746] mb-2 max-lg:text-center">
                À découvrir maintenant
              </h2>
            </Bounce>
            <Bounce>
              <p className="mb-6 max-lg:hidden">Les nouveautés</p>
            </Bounce>
            <Bounce>
              <div className="space-y-3">
                {places.slice(0, 5).map((place, index) => (
                  <PlaceCard place={place} key={index} />
                ))}
              </div>
            </Bounce>
          </div>
          <Bounce>
            <div className="text-center mt-12 max-lg:mt-8">
              <Button
                asChild
                size="lg"
                variant={"outline"}
                className="px-8 py-6 rounded-full transition-all  hover-lift"
              >
                <Link href="/places" className="flex items-center text-lg">
                  Voir tous les lieux
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Bounce>
        </>
      )}
    </div>
  );
}
