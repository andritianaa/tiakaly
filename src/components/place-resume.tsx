"use client";

import { Check, DollarSign, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { PlaceSummary } from '@/types/place';

export type PlaceResumeProps = {
  place: PlaceSummary;
};

export const PlaceResume = (place: PlaceSummary) => {
  return (
    <Link
      href={`/place/${place.id}`}
      key={place.title}
      className="relative overflow-hidden rounded max-h-[45vh] min-h-[45vh] bg-muted"
    >
      <Image
        src={place.mainMedia!.url}
        width={500}
        height={500}
        alt=""
        className="transition-transform duration-300 hover:scale-105 h-full w-full object-cover max-h-[45vh] min-h-[45vh]"
      />

      <div className=" bg-gradient-to-t  from-black to-transparent absolute bottom-0 left-0 w-full h-[60%]"></div>
      <div className="absolute bottom-0 p-2 w-full text-white">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="w-full">
              <div className="flex  w-full flex-col items-start justify-start">
                <h1 className="text-2xl font-bold flex items-center max-md:text-lg text-start">
                  {place.title}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center">
                    {place.priceInDollars && (
                      <>
                        {[1, 2, 3].map((dollar) => (
                          <DollarSign
                            key={dollar}
                            className={`size-4 max-md:size-3 ${
                              dollar <= place.priceInDollars! ? "" : "hidden"
                            }`}
                          />
                        ))}
                      </>
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
              <div className="flex items-center text-sm">
                <MapPin className="size-4 mr-1 max-md:hidden" />
                <span className=" line-clamp-1">{place.localisation}</span>
              </div>
            </div>
          </div>
          <p className="mb-2 line-clamp-2 max-md:hidden">{place.bio}</p>
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
      </div>
    </Link>
  );
};
