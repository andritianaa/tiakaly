import { Plus } from "lucide-react";
import Link from "next/link";

import {
  deletePlace,
  getPlaces,
  updatePlaceStatus,
} from "@/actions/place-actions";
import { PlaceList } from "@/components/place/place-list";
import { Button } from "@/components/ui/button";

import type { Status } from "@prisma/client";
export default async function PlacesPage() {
  const { success, places = [], error } = await getPlaces();
  const handleStatusChange = async (id: string, status: Status) => {
    "use server";
    return updatePlaceStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    "use server";
    return deletePlace(id);
  };

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des lieux</h1>

        <Button asChild>
          <Link href="/admin/places/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau lieu
          </Link>
        </Button>
      </div>

      {success && places ? (
        <PlaceList
          places={places}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ) : (
        <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
          {error || "Une erreur est survenue lors du chargement des lieux"}
        </div>
      )}
    </div>
  );
}
