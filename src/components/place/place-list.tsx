"use client";

import { Archive, Eye, FileText, MoreHorizontal, Pencil, Trash2, View } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Status } from '@prisma/client';

import type { PlaceWithRelations } from "@/types/place";
interface PlaceListProps {
  places: PlaceWithRelations[];
  onStatusChange: (
    id: string,
    status: Status
  ) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function PlaceList({
  places,
  onStatusChange,
  onDelete,
}: PlaceListProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [filter, setFilter] = useState<Status | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPlaces =
    filter === "all"
      ? places
      : places.filter((place) => place.status === filter);

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      setIsLoading(true);
      const result = await onStatusChange(id, status);

      if (result.success) {
        toast({
          title: "Succès",
          description: "Le statut a été mis à jour",
        });
        router.refresh();
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
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setPlaceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (placeToDelete) {
      try {
        setIsLoading(true);
        const result = await onDelete(placeToDelete);

        if (result.success) {
          toast({
            title: "Succès",
            description: "Le lieu a été supprimé",
          });
          router.refresh();
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description:
            error instanceof Error
              ? error.message
              : "Une erreur est survenue lors de la suppression",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
        setDeleteDialogOpen(false);
        setPlaceToDelete(null);
      }
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.published:
        return <Badge variant="default">Publié</Badge>;
      case Status.draft:
        return <Badge variant="secondary">Brouillon</Badge>;
      case Status.archived:
        return <Badge variant="outline">Archivé</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          Tous
        </Button>
        <Button
          variant={filter === Status.published ? "default" : "outline"}
          onClick={() => setFilter(Status.published)}
        >
          Publiés
        </Button>
        <Button
          variant={filter === Status.draft ? "default" : "outline"}
          onClick={() => setFilter(Status.draft)}
        >
          Brouillons
        </Button>
        <Button
          variant={filter === Status.archived ? "default" : "outline"}
          onClick={() => setFilter(Status.archived)}
        >
          Archivés
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlaces.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Aucun lieu trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredPlaces.map((place) => (
                <TableRow key={place.id}>
                  <TableCell>
                    <div className="w-12 h-12 relative rounded-md overflow-hidden">
                      <Image
                        src={place.mainMedia.url || "/placeholder.svg"}
                        alt={place.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{place.title}</TableCell>
                  <TableCell>{place.localisation}</TableCell>
                  <TableCell>
                    {place.priceMin} - {place.priceMax} Ar
                  </TableCell>
                  <TableCell>{getStatusBadge(place.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLoading}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/place/${place.id}`}>
                          <DropdownMenuItem>
                            <View className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/places/edit/${place.id}`}>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                        </Link>
                        {place.status !== Status.published && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(place.id, Status.published)
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Publier
                          </DropdownMenuItem>
                        )}
                        {place.status !== Status.draft && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(place.id, Status.draft)
                            }
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Mettre en brouillon
                          </DropdownMenuItem>
                        )}
                        {place.status !== Status.archived && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(place.id, Status.archived)
                            }
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(place.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Es-tu sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le lieu sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
