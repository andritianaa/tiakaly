"use client";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceSummary } from "@/types/place";

export const PlacePopup = (place: PlaceSummary) => {
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
  return (
    <Card>
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-2 min-w-[500px]">
          <Image
            width={500}
            height={500}
            src={place.mainMedia?.url || "/placeholder.svg"}
            alt=""
            className="rounded"
          />
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-full">
                    <div className="flex justify-between w-full items-center">
                      <h1 className="text-2xl font-bold flex items-center">
                        {place.title}
                      </h1>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-4 ${
                              star <= place.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="size-4 mr-1" />
                      <span>{place.localisation}</span>
                    </div>
                  </div>
                </div>
                <p className="mb-2">{place.bio}</p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center">
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

              {place.Contact && place.Contact.length > 0 ? (
                <div className="grid grid-cols-3">
                  {place.Contact.map((contact) => (
                    <div key={contact.id} className="flex items-center">
                      {contact.type === "mobile" || contact.type === "fixe" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-sm hover:bg-transparent pl-0"
                          onClick={() => handlePhoneCall(contact.value)}
                        >
                          <Phone className="size-4 text-muted-foreground" />
                          <span className="text-sm">{contact.value}</span>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-sm hover:bg-transparent pl-0"
                          onClick={() => handleCopyContact(contact.value)}
                        >
                          <Mail className="size-4 text-muted-foreground" />
                          <span className="text-sm">{contact.value}</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Aucun contact disponible
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
