/* eslint-disable @next/next/no-img-element */
"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { MediaUploadDialog } from "@/components/media/media-upload-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import type { MediaInput } from "@/types/place";
interface MainMediaInputProps {
  value: string;
  onChange: (mediaId: string) => void;
  mediaUrl?: string;
}

export function MainMediaInput({
  value,
  onChange,
  mediaUrl,
}: MainMediaInputProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaInput | null>(
    mediaUrl ? { id: value, url: mediaUrl, type: "image/*" } : null
  );

  const handleMediaSelect = (media: MediaInput[]) => {
    if (media.length > 0) {
      setSelectedMedia(media[0]);
      onChange(media[0].id);
    }
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    onChange("");
  };

  return (
    <div className="space-y-2">
      <Label>Image principale</Label>
      <div className="border rounded-md p-4">
        {selectedMedia ? (
          <div className="relative flex items-center justify-center">
            <img
              src={selectedMedia.url || "/placeholder.svg"}
              alt="Image principale"
              className="rounded-md object-cover w-full max-w-lg h-auto"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveMedia}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] bg-muted rounded-md">
            <p className="text-sm text-muted-foreground mb-2">
              Aucune image sélectionnée
            </p>
            <MediaUploadDialog
              onMediaSelect={handleMediaSelect}
              multiple={false}
              buttonText="Sélectionner une image"
            />
          </div>
        )}
      </div>
    </div>
  );
}
