"use client";
import { useRouter } from "next/navigation";

import { createPlace } from "@/actions/place-actions";
import { PlaceForm } from "@/components/place/place-form";
import { useToast } from "@/hooks/use-toast";

import type { PlaceInput } from "@/types/place";
export default function NewPlacePage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: PlaceInput) => {
    try {
      const result = await createPlace(data);

      if (result.success) {
        toast({
          title: "Succès",
          description: "Le lieu a été créé avec succès",
        });
        router.push("/map");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating place:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la création",
        variant: "error",
      });
    }
  };

  return (
    <div className="container py-10">
      <PlaceForm onSubmit={handleSubmit} />
    </div>
  );
}
