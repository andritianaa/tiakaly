"use client";
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';

import Bounce from '@/components/bounce';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/utils';

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
                  <Bounce key={place.id}>
                    <Link href={`/place/${place.id}`} className="mb-2">
                      {" "}
                      <div className="bg-white rounded-lg p-3 flex items-center  hover-lift group max-lg:border-border max-lg:border">
                        <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden mr-4 group-hover:shadow-md transition-all duration-300">
                          {place.mainMedia && (
                            <Image
                              src={place.mainMedia.url || "/placeholder.svg"}
                              width={64}
                              height={64}
                              alt={place.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg  transition-colors duration-300">
                            {place.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500  transition-colors duration-300 w-full">
                            <MapPin className="h-3 w-3 mr-1 group-hover:animate-pulse" />
                            <span className="truncate w-full">
                              {place.localisation.length > 30
                                ? `${place.localisation.slice(0, 30)}...`
                                : place.localisation}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Bounce>
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
