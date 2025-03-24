"use client";

import Autoplay from 'embla-carousel-autoplay';
import { Check, DollarSign, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';

import DynamicMap from '@/components/place/place-map';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious
} from '@/components/ui/carousel';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { PlaceWithRelations } from '@/types/place';
import { Media } from '@prisma/client';

import type { CarouselApi } from "@/components/ui/carousel";
export function PlaceDetailClient({
  place,
  mediaItems,
}: {
  place: PlaceWithRelations;
  mediaItems: Media[];
}) {
  const [copiedText, setCopiedText] = useState("");
  const { toast } = useToast();

  // Carousel state
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [allMedia, setAllMedia] = useState<Media[]>([]);

  // Combine main image with media items
  useEffect(() => {
    if (place?.mainMedia?.url) {
      const mainMediaItem = {
        id: "main-image",
        type: "image",
        url: place.mainMedia.url,
        createdAt: place.mainMedia.createdAt,
      };

      // Make sure mediaItems is an array before spreading
      const mediaArray = Array.isArray(mediaItems) ? mediaItems : [];
      setAllMedia([mainMediaItem, ...mediaArray]);
    } else {
      // If no main media, just use the media items
      setAllMedia(Array.isArray(mediaItems) ? mediaItems : []);
    }
  }, [place?.mainMedia, mediaItems]);

  // Setup carousel API
  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleCopyContact = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedText(value);
    toast({
      description: "Copié dans le presse-papier",
      duration: 2000,
    });

    setTimeout(() => {
      setCopiedText("");
    }, 2000);
  };

  const handlePhoneCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  // Debug output
  console.log("All media:", allMedia);

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        {/* En-tête avec actions */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:p-2 mt-12">
          {/* Carousel */}
          <div className="h-full max-md:h-[60vh] rounded-lg overflow-hidden">
            {allMedia.length > 0 ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Carousel
                    setApi={setApi}
                    className="h-full"
                    plugins={[
                      Autoplay({
                        delay: 5000,
                      }),
                    ]}
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent className="h-full">
                      {allMedia.map((media, index) => (
                        <CarouselItem key={index} className="h-full">
                          <div className="relative h-full w-full rounded-lg overflow-hidden bg-muted">
                            {media?.type === "image" ? (
                              <Image
                                src={media?.url || "/placeholder.svg"}
                                alt={
                                  index === 0 ? place.title : `Image ${index}`
                                }
                                fill
                                className="object-cover"
                                priority={index === 0}
                              />
                            ) : media?.type === "video" ? (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-sm">Vidéo</span>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-sm">Document</span>
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </DialogTrigger>
                <DialogContent className="max-w-3xl min-h-[80vh] bg-[#00000066] border-none">
                  <DialogHeader className="hidden">
                    <DialogTitle></DialogTitle>
                  </DialogHeader>
                  <Carousel
                    setApi={setApi}
                    className="h-full"
                    plugins={[
                      Autoplay({
                        delay: 5000,
                      }),
                    ]}
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent className="h-full">
                      {allMedia.map((media, index) => (
                        <CarouselItem key={index} className="h-full">
                          <div className="relative h-full w-full rounded-lg overflow-hidden">
                            {media?.type === "image" ? (
                              <Image
                                src={media?.url || "/placeholder.svg"}
                                alt={
                                  index === 0 ? place.title : `Image ${index}`
                                }
                                fill
                                className="object-cover"
                                priority={index === 0}
                              />
                            ) : media?.type === "video" ? (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-sm">Vidéo</span>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-sm">Document</span>
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {allMedia.length > 1 && (
                      <>
                        <CarouselPrevious className="-left-20" />
                        <CarouselNext className="-right-20" />
                      </>
                    )}
                  </Carousel>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="h-full w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">
                  Aucune image disponible
                </span>
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-full">
                    <div className="flex justify-between w-full items-center">
                      <h1 className="text-2xl font-bold flex items-center">
                        {place.title}
                      </h1>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center">
                          {place.priceInDollars && (
                            <>
                              {[1, 2, 3].map((dollar) => (
                                <DollarSign
                                  key={dollar}
                                  className={`size-4 ${
                                    dollar <= place.priceInDollars!
                                      ? ""
                                      : "hidden"
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
                              className="size-6"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="size-4 mr-1" />
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

              {place.Contact && place.Contact.length > 0 ? (
                <div className="grid grid-cols-2">
                  {place.Contact.map((contact) => (
                    <div key={contact.id} className="flex items-center">
                      {contact.type === "mobile" || contact.type === "fixe" ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-sm hover:bg-transparent pl-0"
                              onClick={() => handlePhoneCall(contact.value)}
                            >
                              <Phone className="size-4 text-muted-foreground" />
                              <span className="text-sm">{contact.value}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Appeler</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-sm hover:bg-transparent pl-0"
                              onClick={() => handleCopyContact(contact.value)}
                            >
                              <Mail className="size-4 text-muted-foreground" />
                              <span className="text-sm">{contact.value}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{`Copier l'email`}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Aucun contact disponible
                </p>
              )}

              <Separator />

              {/* Menus */}
              <div>
                <h2 className="text-lg font-medium mb-2">Menus</h2>
                {place.MenuPlace && place.MenuPlace.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {place.MenuPlace.map((mp) => (
                      <Badge
                        key={mp.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {mp.menu.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Aucun menu disponible
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {allMedia.length > 1 && (
          <Card className="hidden">
            <CardContent className="p-4">
              <h2 className="text-lg font-medium mb-2">Galerie</h2>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {allMedia.map((media, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                      current === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => goToSlide(index)}
                  >
                    {media?.type === "image" ? (
                      <Image
                        src={
                          media?.url || "/placeholder.svg?height=100&width=100"
                        }
                        alt=""
                        fill
                        className="object-cover"
                      />
                    ) : media?.type === "video" ? (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xs">Vidéo</span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xs">Document</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {place.instagramUrl && (
          <div className="flex items-center justify-center">
            <InstagramEmbed
              url={place.instagramUrl}
              className="w-full max-w-xl max-md:p-2"
              igVersion=""
            />
          </div>
        )}
        {/* Description */}
        <RichTextEditor content={place.content} readOnly />

        {/* Carte */}
        <Card>
          <CardContent className="p-4">
            <span className="flex gap-2">
              <h2 className="text-lg font-medium mb-2">Localisation</h2>
              <Link
                href={
                  place.gmapLink ??
                  `https://www.google.com/maps?q=${place.latitude},${place.longitude}`
                }
                className="text-yellow-500 underline"
                target="_blank"
              >
                Voir sur google map
              </Link>
            </span>
            {place.gmapEmbed ? (
              <div className="w-full overflow-hidden rounded-md ">
                <iframe
                  src={place.gmapEmbed}
                  height="450"
                  loading="lazy"
                  className="w-full"
                ></iframe>
              </div>
            ) : (
              <div className="h-[300px] rounded-md overflow-hidden">
                <DynamicMap
                  latitude={place.latitude}
                  longitude={place.longitude}
                  title={place.title}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <div className="flex flex-wrap gap-2">
            {place.keywords &&
              place.keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm text-yellow-500 border-yellow-500 bg-yellow-200/60"
                >
                  {keyword}
                </Badge>
              ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
