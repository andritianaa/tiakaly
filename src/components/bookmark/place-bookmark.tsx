"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

import { toggleBookmarkPlace } from "@/actions/bookmark-actions";
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

export type PlaceBookmarkProps = {
  placeId: string;
  className?: string;
  /**
   * Variant d'affichage du bouton de favori
   * @default "icon"
   */
  variant?: "icon" | "button";
};

export const PlaceBookmark = ({
  placeId,
  className,
  variant = "icon",
}: PlaceBookmarkProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isBookmarked = user?.BookmarkPlace?.includes(placeId) ?? false;
    setIsBookmarked(isBookmarked);
  }, [user, placeId]);

  const handleBookmarkClick = async () => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour enregistrer ce place",
        variant: "error",
        action: {
          label: "Se connecter",
          altText: "Se connecter",
          onClick: () => {
            window.location.href = "/auth/login";
          },
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      await toggleBookmarkPlace(placeId);
      setIsBookmarked((prev) => !prev);

      toast({
        title: isBookmarked ? "Retiré des favoris" : "Ajouté aux favoris",
        description: isBookmarked
          ? "Cet endroit a été retiré de vos favoris"
          : "Cet endroit a été ajouté à vos favoris",
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

  // Version icône (absolute)
  if (variant === "icon") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmarkClick}
              disabled={isLoading}
              aria-label={
                isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"
              }
              className={cn(
                "absolute right-2 top-2 bg-slate-500/50 hover:bg-slate-500/70 size-10 rounded-full z-10 flex items-center justify-center transition-all duration-200",
                isLoading && "opacity-70 cursor-not-allowed",
                className
              )}
            >
              <Bookmark
                className={cn(
                  "transition-all duration-200",
                  isBookmarked ? "text-[#fdbf43] fill-[#fdbf43]" : "text-white"
                )}
                size={20}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>
              {isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Version bouton avec texte
  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      onClick={handleBookmarkClick}
      disabled={isLoading}
      className={cn(
        "gap-2 transition-all duration-200",
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      <Bookmark
        className={cn(
          "transition-all duration-200",
          isBookmarked ? "fill-current" : ""
        )}
        size={16}
      />
      {isBookmarked ? "Enregistré" : "Enregistrer"}
    </Button>
  );
};
