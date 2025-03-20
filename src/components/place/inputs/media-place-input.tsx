"use client";

import { FileText, Film, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { MediaUploadDialog } from "@/components/media/media-upload-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { MediaInput } from "@/types/place";
interface MediaPlaceInputProps {
  value: string[];
  onChange: (mediaIds: string[]) => void;
  initialMedia?: MediaInput[];
}

export function MediaPlaceInput({
  value,
  onChange,
  initialMedia = [],
}: MediaPlaceInputProps) {
  const [selectedMedia, setSelectedMedia] =
    useState<MediaInput[]>(initialMedia);

  const handleMediaSelect = (media: MediaInput[]) => {
    // Filtrer les médias déjà sélectionnés
    const newMedia = media.filter(
      (m) => !selectedMedia.some((sm) => sm.id === m.id)
    );

    // Ajouter les nouveaux médias
    const updatedMedia = [...selectedMedia, ...newMedia];
    setSelectedMedia(updatedMedia);
    onChange(updatedMedia.map((m) => m.id));
  };

  const handleRemoveMedia = (mediaId: string) => {
    const updatedMedia = selectedMedia.filter((m) => m.id !== mediaId);
    setSelectedMedia(updatedMedia);
    onChange(updatedMedia.map((m) => m.id));
  };

  return (
    <div className="space-y-2">
      <Label>Médias associés</Label>
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            {selectedMedia.length} média(s) sélectionné(s)
          </p>
          <MediaUploadDialog
            onMediaSelect={handleMediaSelect}
            multiple={true}
            buttonText="Ajouter des médias"
          />
        </div>

        {selectedMedia.length > 0 ? (
          <ScrollArea className=" h-fit pr-4">
            <div className="grid grid-cols-5  gap-4">
              {selectedMedia.map((media) => (
                <div key={media.id} className="relative group">
                  {media.type.startsWith("image") ? (
                    <Image
                      src={media.url || "/placeholder.svg"}
                      alt=""
                      width={200}
                      height={200}
                      className="rounded-md object-cover w-full h-auto"
                    />
                  ) : media.type.startsWith("video") ? (
                    <div className="flex items-center justify-center bg-muted rounded-md w-full h-[150px]">
                      <Film className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center bg-muted rounded-md w-full h-[150px]">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveMedia(media.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[150px] bg-muted rounded-md">
            <p className="text-sm text-muted-foreground mb-2">
              Aucun média sélectionné
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
