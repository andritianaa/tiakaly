import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    try {
        const places = await prisma.place.findMany({
            where: query
                ? {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { localisation: { contains: query, mode: "insensitive" } },
                    ],
                }
                : {},
            select: {
                id: true,
                title: true,
                localisation: true,
            },
            take: 10,
        })

        return NextResponse.json(places)
    } catch (error) {
        console.error("Error searching places:", error)
        return NextResponse.json({ error: "Failed to search places" }, { status: 500 })
    }
}

