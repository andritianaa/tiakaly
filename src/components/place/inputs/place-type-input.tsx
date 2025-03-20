"use client";

import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { createPlaceType } from "@/actions/place-type-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PlaceType {
  id: string;
  name: string;
  value: string;
}

interface PlaceTypeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlaceTypeInput({ value, onChange }: PlaceTypeInputProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placeTypes, setPlaceTypes] = useState<PlaceType[]>([]);

  // Charger les types d'endroits au chargement du composant
  useEffect(() => {
    const fetchPlaceTypes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/place-types");
        if (!response.ok) {
          throw new Error("Failed to fetch place types");
        }
        const data = await response.json();
        setPlaceTypes(data);
      } catch (error) {
        console.error("Error fetching place types:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les types d'endroits",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaceTypes();
  }, [toast]);

  const addNewType = async () => {
    if (!newType.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await createPlaceType(newType);

      if (result.success) {
        toast({
          title: "Succès",
          description: `Le type "${newType}" a été ajouté avec succès!`,
        });

        // Ajouter le nouveau type à la liste locale
        if (result.type) {
          setPlaceTypes((prev) => [...prev, result.type]);
          // Sélectionner automatiquement le nouveau type
          onChange(result.type.value);
        }

        // Fermer le dialogue
        setOpen(false);
        setNewType("");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="placeType">{`Type d'endroit`}</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <SelectTrigger id="placeType" className="flex-1">
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Chargement...
              </div>
            ) : (
              <SelectValue placeholder="Sélectionner un type" />
            )}
          </SelectTrigger>
          <SelectContent>
            {placeTypes.map((type) => (
              <SelectItem key={type.id} value={type.value}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Nouveau type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="newType">Nom du type</Label>
                <Input
                  id="newType"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="Ex: Café, Brasserie, etc."
                />
              </div>
              <Button
                onClick={addNewType}
                disabled={!newType.trim() || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  "Ajouter"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
