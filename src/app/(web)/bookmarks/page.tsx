"use client";

import { BookmarkIcon, CheckCircle, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PlaceCard } from "@/components/place-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

import type { PlaceSummary } from "@/types/place";

export default function BookmarksPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<PlaceSummary[]>([]);
  const [testedPlaces, setTestedPlaces] = useState<PlaceSummary[]>([]);

  // Fonction pour charger les données
  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bookmarks");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la récupération des favoris"
        );
      }

      const data = await response.json();
      setBookmarkedPlaces(data.bookmarkedPlaces || []);
      setTestedPlaces(data.testedPlaces || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      toast({
        title: "Erreur",
        description:
          err instanceof Error ? err.message : "Une erreur est survenue",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au chargement de la page
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    fetchBookmarks();
  }, [user, router]);

  // Gérer les changements de bookmark
  const handleBookmarkToggle = (placeId: string, isBookmarked: boolean) => {
    if (isBookmarked) {
      // Ajouter aux bookmarks, retirer des testés
      setBookmarkedPlaces((prev) =>
        [...prev, testedPlaces.find((p) => p.id === placeId)!].filter(Boolean)
      );
      setTestedPlaces((prev) => prev.filter((p) => p.id !== placeId));
    } else {
      // Retirer des bookmarks
      setBookmarkedPlaces((prev) => prev.filter((p) => p.id !== placeId));
    }
  };

  // Gérer les changements de tested
  const handleTestedToggle = (placeId: string, isTested: boolean) => {
    if (isTested) {
      // Ajouter aux testés, retirer des bookmarks
      setTestedPlaces((prev) =>
        [...prev, bookmarkedPlaces.find((p) => p.id === placeId)!].filter(
          Boolean
        )
      );
      setBookmarkedPlaces((prev) => prev.filter((p) => p.id !== placeId));
    } else {
      // Retirer des testés, ajouter aux bookmarks
      setBookmarkedPlaces((prev) =>
        [...prev, testedPlaces.find((p) => p.id === placeId)!].filter(Boolean)
      );
      setTestedPlaces((prev) => prev.filter((p) => p.id !== placeId));
    }
  };

  const totalPlaces = bookmarkedPlaces.length + testedPlaces.length;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col justify-center">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-4 mt-12">
            <BookmarkIcon className="size-6" />
            <h1 className="text-2xl font-bold">Mes lieux</h1>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col justify-center">
      <div className="max-w-4xl">
        <div className="flex items-center gap-2 mb-4 mt-12">
          <BookmarkIcon className="size-6" />
          <h1 className="text-2xl font-bold">Mes lieux</h1>
        </div>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : totalPlaces === 0 ? (
          <div className="text-center py-12">
            <BookmarkIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Aucun lieu enregistré
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Vous n'avez pas encore ajouté de lieux à vos favoris ou marqué des
              lieux comme testés. Explorez les lieux pour en ajouter à votre
              collection.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 bg-white">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
              >
                <MapPin className="h-4 w-4" />
                <span>Tous ({totalPlaces})</span>
              </TabsTrigger>
              <TabsTrigger
                value="bookmarked"
                className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
              >
                <BookmarkIcon className="h-4 w-4" />
                <span>À visiter ({bookmarkedPlaces.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="tested"
                className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Testés ({testedPlaces.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...bookmarkedPlaces, ...testedPlaces].map((place) => (
                  <PlaceCard
                    key={`place-${place.id}`}
                    place={place}
                    onBookmarkToggle={handleBookmarkToggle}
                    onTestedToggle={handleTestedToggle}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bookmarked">
              {bookmarkedPlaces.length === 0 ? (
                <div className="text-center py-8">
                  <BookmarkIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">
                    Aucun lieu à visiter dans vos favoris
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookmarkedPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onBookmarkToggle={handleBookmarkToggle}
                      onTestedToggle={handleTestedToggle}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tested">
              {testedPlaces.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">Aucun lieu marqué comme testé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testedPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onBookmarkToggle={handleBookmarkToggle}
                      onTestedToggle={handleTestedToggle}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
