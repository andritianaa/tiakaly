"use server";

import { revalidatePath } from 'next/cache';

import { buildSlug } from '@/lib/utils';
import { prisma } from '@/prisma';
import { Status } from '@prisma/client';

import type { PlaceInput, PlaceWithRelations } from "@/types/place";
export async function createPlace(data: PlaceInput) {
  try {
    const {
      title,
      localisation,
      content,
      longitude,
      latitude,
      keywords,
      rating,
      priceMin,
      priceMax,
      type,
      menu,
      status,
      mainMediaId,
      contacts,
      mediaIds,
      bio,
      priceInDollars,
      gmapEmbed,
      instagramUrl,
      gmapLink,
    } = data;

    // Créer le lieu
    let generatedId = buildSlug(title);
    let isUnique = false;

    while (!isUnique) {
      const existingPlace = await prisma.place.findUnique({
        where: { id: generatedId },
      });

      if (!existingPlace) {
        isUnique = true;
      } else {
        const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate 4 random digits
        generatedId = `${buildSlug(title)}-${randomNumbers}`;
      }
    }

    const place = await prisma.place.create({
      data: {
        id: generatedId,
        title,
        localisation,
        content,
        longitude,
        latitude,
        keywords,
        rating,
        priceMin,
        priceMax,
        type,
        status: status || Status.draft,
        mainMediaId,
        bio,
        priceInDollars,
        gmapEmbed,
        instagramUrl,
        gmapLink,
      },
    });

    // Ajouter les contacts
    if (contacts && contacts.length > 0) {
      await Promise.all(
        contacts.map((contact) =>
          prisma.contact.create({
            data: {
              type: contact.type,
              value: contact.value,
              placeId: place.id,
            },
          })
        )
      );
    }

    // Ajouter les médias
    if (mediaIds && mediaIds.length > 0) {
      await Promise.all(
        mediaIds.map((mediaId) =>
          prisma.mediaPlace.create({
            data: {
              placeId: place.id,
              mediaId,
            },
          })
        )
      );
    }

    // Ajouter les menus
    if (menu && menu.length > 0) {
      console.log("menu ==> ", menu);
      await Promise.all(
        menu.map((menuId) =>
          prisma.menuPlace.create({
            data: {
              placeId: place.id,
              menuId,
            },
          })
        )
      );
    }

    revalidatePath("/places");
    return { success: true, place };
  } catch (error) {
    console.error("Error creating place:", error);
    return { success: false, error: "Failed to create place" };
  }
}

export async function updatePlace(id: string, data: PlaceInput) {
  try {
    const {
      title,
      localisation,
      content,
      longitude,
      latitude,
      keywords,
      rating,
      priceMin,
      priceMax,
      type,
      menu,
      status,
      mainMediaId,
      contacts,
      mediaIds,
      bio,
      priceInDollars,
      gmapEmbed,
      instagramUrl,
      gmapLink,
    } = data;

    // Vérifier si le lieu existe
    const existingPlace = await prisma.place.findUnique({
      where: {
        id,
      },
    });

    if (!existingPlace) {
      return { success: false, error: "Place not found" };
    }

    // Mettre à jour le lieu
    const updatedPlace = await prisma.place.update({
      where: {
        id,
      },
      data: {
        title,
        localisation,
        content,
        longitude,
        latitude,
        keywords,
        rating,
        priceMin,
        priceMax,
        type,
        status,
        mainMediaId,
        bio,
        priceInDollars,
        gmapEmbed,
        instagramUrl,
        gmapLink,
      },
    });

    // Mettre à jour les contacts
    if (contacts) {
      // Supprimer les contacts existants
      await prisma.contact.deleteMany({
        where: {
          placeId: id,
        },
      });

      // Ajouter les nouveaux contacts
      if (contacts.length > 0) {
        await Promise.all(
          contacts.map((contact) =>
            prisma.contact.create({
              data: {
                type: contact.type,
                value: contact.value,
                placeId: id,
              },
            })
          )
        );
      }
    }

    // Mettre à jour les médias
    if (mediaIds) {
      // Supprimer les associations existantes
      await prisma.mediaPlace.deleteMany({
        where: {
          placeId: id,
        },
      });

      // Ajouter les nouvelles associations
      if (mediaIds.length > 0) {
        await Promise.all(
          mediaIds.map((mediaId) =>
            prisma.mediaPlace.create({
              data: {
                placeId: id,
                mediaId,
              },
            })
          )
        );
      }
    }

    // Mettre à jour les menus
    if (menu) {
      // Supprimer les associations existantes
      await prisma.menuPlace.deleteMany({
        where: {
          placeId: id,
        },
      });

      // Ajouter les nouvelles associations
      if (menu.length > 0) {
        await Promise.all(
          menu.map((menuId) =>
            prisma.menuPlace.create({
              data: {
                placeId: id,
                menuId,
              },
            })
          )
        );
      }
    }

    revalidatePath("/places");
    revalidatePath(`/admin/places/edit/${id}`);
    return { success: true, place: updatedPlace };
  } catch (error) {
    console.error("Error updating place:", error);
    return { success: false, error: "Failed to update place" };
  }
}

export async function updatePlaceStatus(id: string, status: Status) {
  try {
    const place = await prisma.place.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    revalidatePath("/places");
    return { success: true, place };
  } catch (error) {
    console.error("Error updating place status:", error);
    return { success: false, error: "Failed to update place status" };
  }
}

export async function deletePlace(id: string) {
  try {
    // Vérifier si le lieu existe
    const existingPlace = await prisma.place.findUnique({
      where: {
        id,
      },
    });

    if (!existingPlace) {
      return { success: false, error: "Place not found" };
    }

    // Supprimer les associations
    await prisma.contact.deleteMany({
      where: {
        placeId: id,
      },
    });

    await prisma.mediaPlace.deleteMany({
      where: {
        placeId: id,
      },
    });

    await prisma.menuPlace.deleteMany({
      where: {
        placeId: id,
      },
    });

    // Supprimer le lieu
    await prisma.place.delete({
      where: {
        id,
      },
    });

    revalidatePath("/places");
    return { success: true };
  } catch (error) {
    console.error("Error deleting place:", error);
    return { success: false, error: "Failed to delete place" };
  }
}

export async function getPlaces(): Promise<{
  success: boolean;
  places?: PlaceWithRelations[];
  error?: string;
}> {
  try {
    const places = await prisma.place.findMany({
      include: {
        mainMedia: true,
        MediaPlace: {
          include: {
            media: true,
          },
        },
        Contact: true,
        MenuPlace: {
          include: {
            menu: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, places: places as unknown as PlaceWithRelations[] };
  } catch (error) {
    console.error("Error fetching places:", error);
    return { success: false, error: "Failed to fetch places" };
  }
}

export async function getPlace(
  id: string
): Promise<{ success: boolean; place?: PlaceWithRelations; error?: string }> {
  try {
    const place = await prisma.place.findUnique({
      where: {
        id,
      },
      include: {
        mainMedia: true,
        MediaPlace: {
          include: {
            media: true,
          },
        },
        Contact: true,
        MenuPlace: {
          include: {
            menu: true,
          },
        },
      },
    });

    if (!place) {
      return { success: false, error: "Place not found" };
    }

    return { success: true, place: place as unknown as PlaceWithRelations };
  } catch (error) {
    console.error("Error fetching place:", error);
    return { success: false, error: "Failed to fetch place" };
  }
}

export async function createMenu(name: string) {
  const menu = await prisma.menu.findFirst({
    where: { name },
  });
  if (!menu)
    return await prisma.menu.create({
      data: { name },
    });
  else return menu;
}


export async function migrateAllIdsToSlugs() {
  console.log('Début de la migration des slugs...');

  const existingSlugs = new Set<string>();

  // 1. D'abord créer un mapping des anciens IDs vers les nouveaux slugs pour les Places
  const places = await prisma.place.findMany();
  const placeSlugMap = new Map<string, string>();

  for (const place of places) {
    const slug = await buildUniqueSlug(place.title, existingSlugs);
    placeSlugMap.set(place.id, slug);
  }

  // Ensuite Places (en mettant à jour aussi les Users)
  for (const [oldId, newSlug] of placeSlugMap) {
    await prisma.$transaction([
      // Mettre à jour la Place elle-même
      prisma.place.update({
        where: { id: oldId },
        data: { id: newSlug },
      }),
      // Mettre à jour les références dans User
      ...(await updateUserPlaceReferences(oldId, newSlug)),
    ]);
  }

  // Enfin les Tops
  await migrateTopIdsToSlugs();

  console.log('Migration complète terminée');
}

async function updateUserPlaceReferences(oldPlaceId: string, newPlaceSlug: string) {
  // Trouver tous les users qui référencent cet ancien ID
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { TestedPlace: { has: oldPlaceId } },
        { BookmarkPlace: { has: oldPlaceId } },
      ],
    },
  });

  // Préparer les requêtes de mise à jour
  const updateQueries = users.map(user => {
    const updatedTested = user.TestedPlace.map(id => id === oldPlaceId ? newPlaceSlug : id);
    const updatedBookmark = user.BookmarkPlace.map(id => id === oldPlaceId ? newPlaceSlug : id);

    return prisma.user.update({
      where: { id: user.id },
      data: {
        TestedPlace: { set: updatedTested },
        BookmarkPlace: { set: updatedBookmark },
      },
    });
  });

  return updateQueries;
}

// Fonction buildUniqueSlug avec gestion des doublons
async function buildUniqueSlug(base: string, existingSlugs: Set<string>): Promise<string> {
  const slug = base
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 50);

  let uniqueSlug = slug;
  let counter = 1;

  while (existingSlugs.has(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  existingSlugs.add(uniqueSlug);
  return uniqueSlug;
}

async function migrateTopIdsToSlugs() {
  // 1. Récupérer tous les tops existants
  const tops = await prisma.top.findMany();

  // 2. Pour chaque top, créer un slug et mettre à jour
  for (const top of tops) {
    const slug = await buildUniqueSlug(top.title, new Set<string>());

    try {
      // 3. Mettre à jour le top avec le nouveau slug comme ID
      await prisma.top.update({
        where: { id: top.id },
        data: { id: slug },
      });

      console.log(`Migré ${top.title} (${top.id}) vers slug: ${slug}`);
    } catch (error) {
      console.error(`Erreur lors de la migration de ${top.title}:`, error);
    }
  }

  console.log('Migration des tops terminée');
}