"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/prisma";

export async function createMedia(url: string, type: string) {
  try {
    if (!url || !type) {
      return { success: false, error: "URL and type are required" };
    }

    const media = await prisma.media.create({
      data: {
        url,
        type,
      },
    });

    return { success: true, media };
  } catch (error) {
    console.error("Error creating media:", error);
    return { success: false, error: "Failed to create media" };
  }
}

export async function getMediaList() {
  try {
    const media = await prisma.media.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, media };
  } catch (error) {
    console.error("Error fetching media:", error);
    return { success: false, error: "Failed to fetch media" };
  }
}

export async function deleteMedia(id: string) {
  try {
    // Vérifier si le média est utilisé
    const usedAsMain = await prisma.place.findFirst({
      where: {
        mainMediaId: id,
      },
    });

    if (usedAsMain) {
      return {
        success: false,
        error: "Media is used as main image for a place",
      };
    }

    const usedInPlace = await prisma.mediaPlace.findFirst({
      where: {
        mediaId: id,
      },
    });

    if (usedInPlace) {
      return { success: false, error: "Media is used in a place" };
    }

    // Supprimer le média
    await prisma.media.delete({
      where: {
        id,
      },
    });

    revalidatePath("/places");
    return { success: true };
  } catch (error) {
    console.error("Error deleting media:", error);
    return { success: false, error: "Failed to delete media" };
  }
}
