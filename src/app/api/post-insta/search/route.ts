import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""

    try {
        const posts = await prisma.postInsta.findMany({
            where: query
                ? {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { url: { contains: query, mode: "insensitive" } },
                    ],
                }
                : {},
            select: {
                id: true,
                title: true,
                url: true,
                date: true,
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
            take: 50,
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error("Error searching posts:", error)
        return NextResponse.json({ error: "Failed to search posts" }, { status: 500 })
    }
}

