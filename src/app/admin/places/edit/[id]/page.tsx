"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Importez les actions mais ne les appelez pas directement dans le corps du composant
import { updatePlace } from "@/actions/place-actions";
import { PlaceForm } from "@/components/place/place-form";
import { useToast } from "@/hooks/use-toast";

import type { PlaceInput, PlaceWithRelations } from "@/types/place";
export default function EditPlacePage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [place, setPlace] = useState<PlaceWithRelations | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour charger les données
    const fetchPlace = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/places/${id}`);

        if (!response.ok) {
          throw new Error("Impossible de charger les données du lieu");
        }

        const data = await response.json();
        console.log("data ==> ", data);
        setPlace(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  const handleSubmit = async (data: PlaceInput) => {
    try {
      const result = await updatePlace(id, data);

      if (result.success) {
        toast({
          title: "Succès",
          description: "Le lieu a été mis à jour avec succès",
        });
        router.push("/map");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la mise à jour",
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-[60vh]">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="container py-10">
        <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
          {error || "Le lieu demandé n'a pas été trouvé"}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <PlaceForm initialData={place} onSubmit={handleSubmit} />
    </div>
  );
}
