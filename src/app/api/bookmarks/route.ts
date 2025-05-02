import { NextResponse } from 'next/server';

import { currentSession } from '@/lib/current-user';
import { prisma } from '@/prisma';

export async function GET() {
    try {
        const session = await currentSession()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour voir vos favoris" },
                { status: 401 }
            )
        }

        const userId = session.user.id

        // Récupérer l'utilisateur avec ses bookmarks
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                BookmarkPlace: true,
                TestedPlace: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
        }

        // Récupérer les places bookmarkées
        const bookmarkedPlaces = await prisma.place.findMany({
            where: {
                id: { in: user.BookmarkPlace },
                status: "published",
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
            orderBy: {
                createdAt: "desc",
            },
        })

        // Récupérer les places testées
        const testedPlaces = await prisma.place.findMany({
            where: {
                id: { in: user.TestedPlace },
                status: "published",
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
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json({
            bookmarkedPlaces,
            testedPlaces,
        })
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error)
        return NextResponse.json(
            { error: "Échec de la récupération des favoris" },
            { status: 500 }
        )
    }
}
