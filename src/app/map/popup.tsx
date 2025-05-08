"use client";
import {
  Check,
  DollarSign,
  Mail,
  Navigation,
  Phone,
  SquareArrowOutUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlaceSummary } from "@/types/place";

export const PlacePopup = ({
  distance,
  onShowDirections,
  ...place
}: PlaceSummary & {
  distance?: string;
  onShowDirections?: (place: PlaceSummary) => void;
}) => {
  const [copiedText, setCopiedText] = useState("");

  const handlePhoneCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleCopyContact = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedText(value);

    setTimeout(() => {
      setCopiedText("");
    }, 2000);
  };

  const handleShowDirections = () => {
    if (onShowDirections) {
      onShowDirections(place);
    }
  };

  return (
    <TooltipProvider>
      <Card className="">
        <CardContent className="p-2">
          <div className="grid grid-cols-1 gap-2 min-w-[300px] max-md:max-w-[60vw]">
            <Image
              width={500}
              height={500}
              src={place.mainMedia?.url || "/placeholder.svg"}
              alt=""
              className="rounded-lg h-[20vh] object-cover"
            />
            <Card>
              <CardContent className="p-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-full">
                      <div className="flex flex-col justify-center w-full">
                        <h1 className="text-2xl font-bold flex items-center">
                          {place.title} {distance ? `(${distance})` : ""}
                        </h1>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center">
                            {place.priceInDollars && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex">
                                    {[1, 2, 3].map((dollar) => (
                                      <span
                                        key={dollar}
                                        className={
                                          dollar <= place.priceInDollars!
                                            ? ""
                                            : "hidden"
                                        }
                                      >
                                        <DollarSign className="size-4" />
                                      </span>
                                    ))}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="p-0">
                                    {place.priceInDollars === 1
                                      ? "Petit budget"
                                      : place.priceInDollars === 2
                                      ? "Budget moyen"
                                      : "Gros budget"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div className="flex items-center justify-center">
                            {[1, 2, 3].map((star) => (
                              <Check
                                key={star}
                                color={`${
                                  star <= place.rating ? "#3df50a" : "#9e958e"
                                }`}
                                className="size-6"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <span>{place.localisation}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-2">{place.bio}</p>
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

                <div className="flex gap-2 flex-wrap">
                  {place.Contact && place.Contact.length > 0 ? (
                    place.Contact.map((contact) => (
                      <div key={contact.id} className="flex items-center">
                        {contact.type === "mobile" ||
                        contact.type === "fixe" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-sm hover:bg-transparent"
                            onClick={() => handlePhoneCall(contact.value)}
                          >
                            <Phone className="size-4 text-muted-foreground" />
                            <span className="text-sm">{contact.value}</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-sm hover:bg-transparent"
                            onClick={() => handleCopyContact(contact.value)}
                          >
                            <Mail className="size-4 text-muted-foreground" />
                            <span className="text-sm">{contact.value}</span>
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Aucun contact disponible
                    </p>
                  )}

                  <Link href={`/place/${place.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-sm hover:bg-transparent"
                    >
                      <SquareArrowOutUpRight className="size-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Visiter</span>
                    </Button>
                  </Link>
                  {/* Bouton Itinéraire */}
                  {place.latitude && place.longitude && (
                    <Button
                      size="sm"
                      className="h-8 px-2 text-sm"
                      onClick={handleShowDirections}
                    >
                      <Navigation className="size-4 " />
                      <span className="text-sm  ml-1">Itinéraire</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
