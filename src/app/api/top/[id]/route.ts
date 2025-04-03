import { NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(request: Request, context: any) {
    try {
        const { params } = context
        const id = params.id.toString()

        const top = await prisma.top.findUnique({
            where: { id },
            include: {
                top1: {
                    select: {
                        id: true,
                        title: true,
                        url: true,
                        date: true,
                        mainMedia: {
                            select: {
                                id: true,
                                url: true,
                            },
                        },
                        place: {
                            select: {
                                id: true,
                                title: true,
                                localisation: true,
                            },
                        },
                    },
                },
                top2: {
                    select: {
                        id: true,
                        title: true,
                        url: true,
                        date: true,
                        mainMedia: {
                            select: {
                                id: true,
                                url: true,
                            },
                        },
                        place: {
                            select: {
                                id: true,
                                title: true,
                                localisation: true,
                            },
                        },
                    },
                },
                top3: {
                    select: {
                        id: true,
                        title: true,
                        url: true,
                        date: true,
                        mainMedia: {
                            select: {
                                id: true,
                                url: true,
                            },
                        },
                        place: {
                            select: {
                                id: true,
                                title: true,
                                localisation: true,
                            },
                        },
                    },
                },
            },
        })

        if (!top) {
            return NextResponse.json({ error: "Top non trouvé" }, { status: 404 })
        }

        return NextResponse.json(top)
    } catch (error) {
        console.error("Error fetching top:", error)
        return NextResponse.json({ error: "Erreur lors de la récupération du top" }, { status: 500 })
    }
}

