import { NextResponse } from "next/server";

import { prisma } from "@/prisma";
import { ContactType } from "@prisma/client";

export async function GET(request: Request, context: any) {
  try {
    const { params } = context;
    const id = params.id.toString();
    const place = await prisma.place.findUnique({
      where: {
        id: id,
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
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json(place);
  } catch (error) {
    console.error("Error fetching place:", error);
    return NextResponse.json(
      { error: "Failed to fetch place" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: any) {
  try {
    const body = await request.json();
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
    } = body;
    const { params } = context;
    const id = params.id.toString();
    // Vérifier si le lieu existe
    const existingPlace = await prisma.place.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingPlace) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // Mettre à jour le lieu
    const updatedPlace = await prisma.place.update({
      where: {
        id: id,
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
          contacts.map((contact: { type: string; value: string }) =>
            prisma.contact.create({
              data: {
                type: contact.type as ContactType,
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
          mediaIds.map((mediaId: string) =>
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
          menu.map((menuId: string) =>
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

    return NextResponse.json(updatedPlace);
  } catch (error) {
    console.error("Error updating place:", error);
    return NextResponse.json(
      { error: "Failed to update place" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { params } = context;
    const id = params.id.toString();
    // Vérifier si le lieu existe
    const existingPlace = await prisma.place.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingPlace) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
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
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting place:", error);
    return NextResponse.json(
      { error: "Failed to delete place" },
      { status: 500 }
    );
  }
}
