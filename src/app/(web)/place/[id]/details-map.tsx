"use client";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { PlaceWithRelations } from "@/types/place";

import DynamicMap from "./dynamic-map";

export type DetailsMapProps = {
  place: PlaceWithRelations;
};

export const DetailsMap = (props: DetailsMapProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <span className="flex gap-2">
          <h2 className="text-lg font-medium mb-2">Localisation</h2>
          <Link
            href={
              props.place.gmapLink ??
              `https://www.google.com/maps?q=${props.place.latitude},${props.place.longitude}`
            }
            className="text-yellow-500 underline"
            target="_blank"
          >
            Voir sur google map
          </Link>
        </span>

        <div className="">
          <DynamicMap
            latitude={props.place.latitude}
            longitude={props.place.longitude}
            title={props.place.title}
            place={props.place}
          />
        </div>
      </CardContent>
    </Card>
  );
};
