import { NextResponse } from 'next/server';

import { prisma } from '@/prisma';
import { TopWithMain } from '@/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get("q") || ""
        const tops: TopWithMain[] = await prisma.top.findMany({
            where: query
                ? {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                }
                : undefined,
            include: {
                mainMedia: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(tops)
    } catch (error) {
        console.error("Error fetching tops:", error)
        return NextResponse.json({ error: "Failed to fetch tops" }, { status: 500 })
    }
}

