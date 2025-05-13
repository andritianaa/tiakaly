import { NextResponse } from 'next/server';

import { buildSlug } from '@/lib/utils';
import { prisma } from '@/prisma';
import { ContactType, Status } from '@prisma/client';

export async function GET() {
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

    return NextResponse.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
      isOpenSunday
    } = body;

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
        isOpenSunday,
        status: status || Status.draft,
        mainMediaId,
      },
    });

    // Ajouter les contacts
    if (contacts && contacts.length > 0) {
      await Promise.all(
        contacts.map((contact: { type: string; value: string }) =>
          prisma.contact.create({
            data: {
              type: contact.type as ContactType,
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
        mediaIds.map((mediaId: string) =>
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
      await Promise.all(
        menu.map((menuId: string) =>
          prisma.menuPlace.create({
            data: {
              placeId: place.id,
              menuId,
            },
          })
        )
      );
    }

    return NextResponse.json(place);
  } catch (error) {
    console.error("Error creating place:", error);
    return NextResponse.json(
      { error: "Failed to create place" },
      { status: 500 }
    );
  }
}
