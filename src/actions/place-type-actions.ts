"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/prisma";

export async function getPlaceTypes() {
  try {
    // Récupérer tous les types d'endroits existants
    const types = await prisma.placeType.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, types };
  } catch (error) {
    console.error("Error fetching place types:", error);
    return { success: false, error: "Failed to fetch place types" };
  }
}

export async function createPlaceType(name: string) {
  try {
    // Vérifier si le type existe déjà
    const existingType = await prisma.placeType.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Recherche insensible à la casse
        },
      },
    });

    if (existingType) {
      return { success: false, error: "Ce type d'endroit existe déjà" };
    }

    // Créer le nouveau type
    const newType = await prisma.placeType.create({
      data: {
        name,
        value: name.toLowerCase().replace(/\s+/g, "_"), // Convertir en format valeur (snake_case)
      },
    });

    revalidatePath("/places/new");
    revalidatePath("/admin/places/edit/[id]");

    return { success: true, type: newType };
  } catch (error) {
    console.error("Error creating place type:", error);
    return { success: false, error: "Failed to create place type" };
  }
}
