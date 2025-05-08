"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Bookmark, Check, CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  toggleBookmarkPlace,
  toggleTestedPlace,
} from "@/actions/bookmark-actions";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

import type { PlaceSummary } from "@/types/place";

interface PlaceCardProps {
  place: PlaceSummary;
  onBookmarkToggle?: (placeId: string, isBookmarked: boolean) => void;
  onTestedToggle?: (placeId: string, isTested: boolean) => void;
}

export function PlaceCard({
  place,
  onBookmarkToggle,
  onTestedToggle,
}: PlaceCardProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isTested, setIsTested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsBookmarked(user?.BookmarkPlace?.includes(place.id) ?? false);
    setIsTested(user?.TestedPlace?.includes(place.id) ?? false);
  }, [user, place.id]);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour enregistrer ce lieu",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await toggleBookmarkPlace(place.id);
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);

      if (newBookmarkState) {
        // Si on ajoute aux favoris, on retire des testés
        setIsTested(false);
      }

      // Notifier le parent du changement
      if (onBookmarkToggle) {
        onBookmarkToggle(place.id, newBookmarkState);
      }

      toast({
        title: isBookmarked ? "Retiré des favoris" : "Ajouté aux favoris",
        description: isBookmarked
          ? "Ce lieu a été retiré de vos favoris"
          : "Ce lieu a été ajouté à vos favoris",
      });
    } catch (error) {
      toast({
        title: "Une erreur est survenue",
        description:
          "Échec de la mise à jour du statut du favori. Veuillez réessayer.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestedClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour marquer ce lieu comme testé",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await toggleTestedPlace(place.id);
      const newTestedState = !isTested;
      setIsTested(newTestedState);

      if (newTestedState) {
        // Si on marque comme testé, on retire des favoris
        setIsBookmarked(false);
      } else {
        // Si on retire des testés, on ajoute aux favoris
        setIsBookmarked(true);
      }

      // Notifier le parent du changement
      if (onTestedToggle) {
        onTestedToggle(place.id, newTestedState);
      }

      toast({
        title: isTested ? "Retiré des lieux testés" : "Marqué comme testé",
        description: isTested
          ? "Ce lieu a été retiré de vos lieux testés"
          : "Ce lieu a été marqué comme testé",
      });
    } catch (error) {
      toast({
        title: "Une erreur est survenue",
        description:
          "Échec de la mise à jour du statut du lieu. Veuillez réessayer.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="bg-white border border-border rounded-lg p-3 flex items-center hover-lift group max-lg:border-border max-lg:border relative">
        <Link
          href={`/place/${place.id}`}
          className="flex-grow flex items-center"
          onClick={(e) => {
            // Permettre la navigation seulement si on ne clique pas sur les boutons
            if ((e.target as HTMLElement).closest("button")) {
              e.preventDefault();
            }
          }}
        >
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
          <div className="flex-grow pr-20">
            <h3 className="font-semibold text-lg transition-colors duration-300">
              {place.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 transition-colors duration-300 w-full">
              <MapPin className="h-3 w-3 mr-1 group-hover:animate-pulse" />
              <span className="truncate w-full">
                {place.localisation.length > 30
                  ? `${place.localisation.slice(0, 30)}...`
                  : place.localisation}
              </span>
            </div>
          </div>
        </Link>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmarkClick}
                  disabled={isLoading || isTested}
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center transition-all duration-200",
                    isBookmarked && "bg-amber-100",
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  <Bookmark
                    className={cn(
                      "transition-all duration-200 size-4",
                      isBookmarked
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-400"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>
                  {isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleTestedClick}
                  disabled={isLoading}
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center transition-all duration-200",
                    isTested && "bg-green-100",
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isTested ? (
                    <Check className="text-green-500" />
                  ) : (
                    <CheckCircle
                      className={cn(
                        "transition-all duration-200 size-4 text-slate-400"
                      )}
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>
                  {isTested ? "Marquer comme non testé" : "Marquer comme testé"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}
