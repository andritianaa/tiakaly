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
        createdAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        bio: true,
        title: true,
        localisation: true,
        longitude: true,
        latitude: true,
        priceMin: true,
        priceMax: true,
        rating: true,
        Contact: true,
        priceInDollars: true,
        gmapLink: true,
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
