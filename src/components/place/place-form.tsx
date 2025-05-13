"use client";

import { useState } from "react";

import { BioInput } from "@/components/place/inputs/bio-input";
import { GmapLinkInput } from "@/components/place/inputs/gmapLink-input";
import { InstaLinkInput } from "@/components/place/inputs/Insta-input";
import { OpenSundayInput } from "@/components/place/inputs/is-open-sunday-input";
import { PriceInDollarsInput } from "@/components/place/inputs/priceInDollars-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Status } from "@prisma/client";

import { ContactsInput } from "./inputs/contacts-input";
import { ContentInput } from "./inputs/content-input";
import { KeywordsInput } from "./inputs/keywords-input";
import { LocalisationInput } from "./inputs/localisation-input";
import { MainMediaInput } from "./inputs/main-media-input";
import { MapCoordinatesInput } from "./inputs/map-coordinates-input";
import { MediaPlaceInput } from "./inputs/media-place-input";
import { MenuInput } from "./inputs/menu-input";
import { PlaceTypeInput } from "./inputs/place-type-input";
import { PriceRangeInput } from "./inputs/price-range-input";
import { RatingInput } from "./inputs/rating-input";
import { StatusInput } from "./inputs/status-input";
import { TitleInput } from "./inputs/title-input";

import type {
  ContactInput,
  PlaceInput,
  PlaceWithRelations,
} from "@/types/place";
interface PlaceFormProps {
  initialData?: PlaceWithRelations;
  onSubmit: (data: PlaceInput) => Promise<void>;
}

export function PlaceForm({ initialData, onSubmit }: PlaceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour chaque champ du formulaire
  const [title, setTitle] = useState(initialData?.title || "");
  const [localisation, setLocalisation] = useState(
    initialData?.localisation || ""
  );
  const [gmapLink, setGmapLink] = useState(initialData?.gmapLink || "");
  const [gmapEmbed, setGmapEmbed] = useState(initialData?.gmapEmbed || "");
  const [instagramUrl, setinstagramUrl] = useState(
    initialData?.instagramUrl || ""
  );
  const [bio, setBio] = useState(initialData?.bio || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [longitude, setLongitude] = useState(initialData?.longitude || 0);
  const [latitude, setLatitude] = useState(initialData?.latitude || 0);
  const [keywords, setKeywords] = useState<string[]>(
    initialData?.keywords || []
  );
  const [rating, setRating] = useState(initialData?.rating || 3);
  const [priceInDollars, setPriceInDollars] = useState(
    initialData?.priceInDollars || 2
  );
  const [isOpenSunday, setIsOpenSunday] = useState(
    initialData?.isOpenSunday || false
  );

  const [priceMin, setPriceMin] = useState(initialData?.priceMin || 0);
  const [priceMax, setPriceMax] = useState(initialData?.priceMax || 0);
  const [mainMediaId, setMainMediaId] = useState(
    initialData?.mainMediaId || ""
  );
  const [contacts, setContacts] = useState<ContactInput[]>(
    initialData?.Contact.map((c) => ({
      id: c.id,
      type: c.type,
      value: c.value,
    })) || []
  );
  const [placeType, setPlaceType] = useState<string>(initialData?.type || "");
  const [menuIds, setMenuIds] = useState<string[]>(
    initialData?.MenuPlace.map((mp) => mp.menu.id) || []
  );
  const [mediaIds, setMediaIds] = useState<string[]>(
    initialData?.MediaPlace.map((mp) => mp.media.id) || []
  );
  const [status, setStatus] = useState<Status>(
    initialData?.status || Status.draft
  );

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validation basique
      if (!title) {
        toast({
          title: "Erreur",
          description: "Le titre est obligatoire",
          variant: "error",
        });
        return;
      }

      if (!mainMediaId) {
        toast({
          title: "Erreur",
          description: "L'image principale est obligatoire",
          variant: "error",
        });
        return;
      }

      const placeData: PlaceInput = {
        id: initialData?.id,
        title,
        localisation,
        content,
        longitude,
        gmapEmbed,
        instagramUrl,
        gmapLink,
        priceInDollars,
        latitude,
        keywords,
        rating,
        priceMin,
        priceMax,
        type: placeType,
        menu: menuIds,
        status,
        mainMediaId,
        isOpenSunday,
        contacts,
        mediaIds,
        bio,
      };

      await onSubmit(placeData);

      toast({
        title: "Succès",
        description: initialData
          ? "Le lieu a été mis à jour avec succès"
          : "Le lieu a été créé avec succès",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            {initialData ? "Modifier un lieu" : "Créer un nouveau lieu"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TitleInput value={title} onChange={setTitle} />
            <LocalisationInput
              value={localisation}
              onChange={setLocalisation}
            />
          </div>
          <div className="">
            <BioInput value={bio} onChange={setBio} />
          </div>

          <ContentInput value={content} onChange={setContent} />

          <MapCoordinatesInput
            longitude={longitude}
            latitude={latitude}
            onChange={(lng, lat) => {
              setLongitude(lng);
              setLatitude(lat);
            }}
          />
          <div className="grid grid-cols-2 gap-4">
            <GmapLinkInput value={gmapLink} onChange={setGmapLink} />
            <InstaLinkInput value={instagramUrl} onChange={setinstagramUrl} />
          </div>

          <div className="grid grid-cols-1">
            <KeywordsInput value={keywords} onChange={setKeywords} />
          </div>

          <div className="space-y-4">
            <PriceRangeInput
              minValue={priceMin}
              maxValue={priceMax}
              onMinChange={setPriceMin}
              onMaxChange={setPriceMax}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
              <OpenSundayInput
                value={isOpenSunday}
                onChange={setIsOpenSunday}
              />
              <PriceInDollarsInput
                value={priceInDollars}
                onChange={setPriceInDollars}
              />
              <RatingInput value={rating} onChange={setRating} />
            </div>
          </div>

          <MainMediaInput
            value={mainMediaId}
            onChange={setMainMediaId}
            mediaUrl={initialData?.mainMedia?.url}
          />

          <ContactsInput value={contacts} onChange={setContacts} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlaceTypeInput value={placeType} onChange={setPlaceType} />
            <StatusInput value={status} onChange={setStatus} />
          </div>

          <MenuInput value={menuIds} onChange={setMenuIds} />

          <MediaPlaceInput
            value={mediaIds}
            onChange={setMediaIds}
            initialMedia={initialData?.MediaPlace.map((mp) => mp.media)}
          />

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button">
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting
                ? "Enregistrement..."
                : initialData
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
