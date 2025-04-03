import { NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get("q") || ""

        const posts = await prisma.postInsta.findMany({
            where: query
                ? {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { url: { contains: query, mode: "insensitive" } },
                    ],
                }
                : undefined,
            include: {
                mainMedia: true,
                place: {
                    select: {
                        id: true,
                        title: true,
                        localisation: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error("Error fetching post instas:", error)
        return NextResponse.json({ error: "Failed to fetch post instas" }, { status: 500 })
    }
}

