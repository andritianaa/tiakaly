import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

import type { PlaceSummary } from "@/types/place";

export async function GET(req: NextRequest) {
  try {
    const places: PlaceSummary[] = await prisma.place.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        bio: true,
        title: true,
        isOpenSunday: true,
        localisation: true,
        longitude: true,
        latitude: true,
        priceMin: true,
        priceMax: true,
        priceInDollars: true,
        gmapLink: true,
        rating: true,
        keywords: true,
        Contact: true,
        content: true,
        type: true,
        MenuPlace: {
          include: {
            menu: true,
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
    console.error("Error fetching places:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
