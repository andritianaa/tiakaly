import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("q") || "";
    const priceMin = Number.parseInt(searchParams.get("priceMin") || "0");
    const priceMax = Number.parseInt(searchParams.get("priceMax") || "1000000");
    const priceInDollars = Number.parseInt(
      searchParams.get("priceInDollars") || "0"
    );
    const menus = searchParams.get("menus")?.split(",") || [];

    // Build the where clause for the search
    const where: any = {
      status: "published",
      priceMin: { gte: priceMin },
      priceMax: { lte: priceMax },
    };

    // Add text search if provided
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { localisation: { contains: searchTerm, mode: "insensitive" } },
        { bio: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
        { keywords: { has: searchTerm } },
      ];
    }

    // Add price in dollars filter if provided
    if (priceInDollars > 0) {
      where.priceInDollars = { gte: priceInDollars };
    }

    // Add menus filter if provided
    if (menus.length > 0) {
      where.MenuPlace = {
        some: {
          menuId: { in: menus },
        },
      };
    }

    const places = await prisma.place.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        bio: true,
        title: true,
        localisation: true,
        longitude: true,
        latitude: true,
        priceMin: true,
        priceMax: true,
        priceInDollars: true,
        gmapLink: true,
        rating: true,
        Contact: true,
        mainMedia: {
          select: {
            url: true,
          },
        },
      },
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
