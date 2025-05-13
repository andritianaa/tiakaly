import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';
import { PlaceSummary } from '@/types/place';

export async function GET(req: NextRequest) {
  try {
    const places: PlaceSummary[] = await prisma.place.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        rating: "desc",
      },
      select: {
        id: true,
        bio: true,
        title: true,
        content: true,
        localisation: true,
        isOpenSunday: true,
        longitude: true,
        latitude: true,
        priceMin: true,
        priceMax: true,
        priceInDollars: true,
        gmapLink: true,
        rating: true,
        keywords: true,
        Contact: true,
        type: true,
        MenuPlace: {
          select: {
            id: true,
            menuId: true,
          },
        },
        mainMedia: {
          select: {
            url: true,
          },
        },
      },
    });
    return NextResponse.json(places);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
