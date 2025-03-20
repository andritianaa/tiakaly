"use client";

import type React from "react";

import { RefreshCw, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useMediaUpload } from "@/hooks/use-media-upload";

import type { MediaInput } from "@/types/place";
interface MediaUploadDialogProps {
  onMediaSelect: (media: MediaInput[]) => void;
  multiple?: boolean;
  buttonText?: string;
}

export function MediaUploadDialog({
  onMediaSelect,
  multiple = false,
  buttonText = "Sélectionner des médias",
}: MediaUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [availableMedia, setAvailableMedia] = useState<MediaInput[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaInput[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le rechargement

  const {
    uploadFile,
    uploadMultipleFiles,
    getMediaList,
    isUploading,
    uploadProgress,
    error,
  } = useMediaUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setSelectedFiles(multiple ? [...selectedFiles, ...fileArray] : fileArray);
    }
  };

  const loadMediaList = async () => {
    const mediaList = await getMediaList();
    setAvailableMedia(mediaList);
  };

  // Charger la liste des médias quand le dialog s'ouvre ou quand refreshKey change
  useEffect(() => {
    if (open) {
      loadMediaList();
    }
  }, [open, refreshKey]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const uploadedMedia = await uploadMultipleFiles(selectedFiles);

    if (uploadedMedia.length > 0) {
      // Fermer et rouvrir le dialog pour rafraîchir la liste des médias
      setOpen(false);

      // Mettre à jour la sélection
      setSelectedMedia(
        multiple ? [...selectedMedia, ...uploadedMedia] : uploadedMedia
      );

      // Réinitialiser les fichiers sélectionnés
      setSelectedFiles([]);

      // Incrémenter la clé de rafraîchissement pour forcer le rechargement des médias
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
        setOpen(true);
      }, 300); // Petit délai pour assurer que le dialog se ferme complètement
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleMediaSelect = (media: MediaInput) => {
    if (multiple) {
      setSelectedMedia((prev) =>
        prev.some((m) => m.id === media.id)
          ? prev.filter((m) => m.id !== media.id)
          : [...prev, media]
      );
    } else {
      setSelectedMedia([media]);
    }
  };

  const handleConfirm = () => {
    onMediaSelect(selectedMedia);
    setOpen(false);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRefresh = () => {
    loadMediaList();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Gestion des médias</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              title="Rafraîchir la liste"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">
              Uploader de nouveaux fichiers
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={handleFileChange}
                multiple={multiple}
                className="flex-1"
                accept="image/*,video/*,application/pdf"
              />
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                size="sm"
              >
                Uploader
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSelectedFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="mt-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload en cours: {uploadProgress}%
                </p>
              </div>
            )}

            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>

          <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">Médias disponibles</h3>
            <div className="grid grid-cols-4 gap-2">
              {availableMedia.length === 0 ? (
                <p className="col-span-4 text-center text-sm text-muted-foreground py-4">
                  Aucun média disponible
                </p>
              ) : (
                availableMedia.map((media) => (
                  <div
                    key={media.id}
                    className={`relative border rounded-md overflow-hidden cursor-pointer ${
                      selectedMedia.some((m) => m.id === media.id)
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handleMediaSelect(media)}
                  >
                    {media.type == "image" ? (
                      <Image
                        src={media.url || "/placeholder.svg"}
                        alt=""
                        width={100}
                        height={100}
                        className="w-full h-24 object-cover"
                      />
                    ) : media.type == "video" ? (
                      <div className="w-full h-24 bg-muted flex items-center justify-center">
                        <span className="text-xs">Vidéo</span>
                      </div>
                    ) : (
                      <div className="w-full h-24 bg-muted flex items-center justify-center">
                        <span className="text-xs">PDF</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleConfirm}>Confirmer la sélection</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
