import { NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(request: Request, context: any) {
    try {
        const { params } = context
        const id = params.id.toString()

        const post = await prisma.postInsta.findUnique({
            where: { id },
            include: {
                place: {
                    select: {
                        id: true,
                        title: true,
                        localisation: true,
                    },
                },
                mainMedia: {
                    select: {
                        id: true,
                        url: true,
                        type: true,
                    },
                },
            },
        })

        if (!post) {
            return NextResponse.json({ error: "Post Instagram non trouvé" }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error("Error fetching post:", error)
        return NextResponse.json({ error: "Erreur lors de la récupération du post" }, { status: 500 })
    }
}

