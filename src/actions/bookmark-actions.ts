"use server"

import { SA } from '@/lib/safe-ation';
import { prisma } from '@/prisma';
import { PlaceSummary } from '@/types/place';

export const getUserBookmarks = SA(async (session) => {
    try {
        const userId = session.user.id
        // Récupérer l'utilisateur avec ses bookmarks
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                TestedPlace: true,
                BookmarkPlace: true,
            },
        })

        if (!user) {
            return {
                error: "Utilisateur non trouvé",
                TestedPlace: [],
                bookmarkedPlaces: [],
            }
        }


        // Récupérer les places bookmarkées
        const bookmarkedPlaces: PlaceSummary[] = await prisma.place.findMany({
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
                isOpenSunday: true,
                content: true,
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
            orderBy: {
                createdAt: "desc",
            },
        })
        const testedPlaces: PlaceSummary[] = await prisma.place.findMany({
            where: {
                id: { in: user.TestedPlace },
                status: "published",
            },
            select: {
                id: true,
                bio: true,
                title: true,
                content: true,
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
            orderBy: {
                createdAt: "desc",
            },
        })
        return {
            testedPlaces,
            bookmarkedPlaces,
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error)
        return {
            error: "Échec de la récupération des favoris",
            testedPlaces: [],
            bookmarkedPlaces: [],
        }
    }
})

export const toggleBookmarkPlace = SA(async (session, PlaceId: string): Promise<null> => {
    const user = session.user
    if (user.BookmarkPlace.includes(PlaceId)) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                BookmarkPlace: {
                    set: user.BookmarkPlace.filter((id) => id !== PlaceId)
                }
            }
        })
    } else {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                BookmarkPlace: {
                    set: [...user.BookmarkPlace, PlaceId]
                }
            }
        })
    }
    return null
})

export const toggleTestedPlace = SA(async (session, placeId: string): Promise<null> => {
    const user = session.user
    if (user.TestedPlace.includes(placeId)) {
        // Remove from TestedPlace and add back to BookmarkPlace
        await prisma.user.update({
            where: { id: user.id },
            data: {
                TestedPlace: {
                    set: user.TestedPlace.filter((id) => id !== placeId)
                },
                BookmarkPlace: {
                    set: [...user.BookmarkPlace, placeId]
                }
            }
        })
    } else {
        // Add to TestedPlace and remove from BookmarkPlace
        await prisma.user.update({
            where: { id: user.id },
            data: {
                TestedPlace: {
                    set: [...user.TestedPlace, placeId]
                },
                BookmarkPlace: {
                    set: user.BookmarkPlace.filter((id) => id !== placeId)
                }
            }
        })
    }
    return null
})