"use server"

import { SA } from '@/lib/safe-ation';
import { prisma } from '@/prisma';
import { TopWithMain } from '@/types';
import { PlaceSummary } from '@/types/place';

export const getUserBookmarks = SA(async (session) => {
    try {


        const userId = session.user.id

        // Récupérer l'utilisateur avec ses bookmarks
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                BookmarkPost: true,
                BookmarkPlace: true,
                BookmarkTop: true,
            },
        })

        if (!user) {
            return {
                error: "Utilisateur non trouvé",
                bookmarkedPosts: [],
                bookmarkedPlaces: [],
                bookmarkedTops: []
            }
        }

        // Récupérer les posts bookmarkés
        const bookmarkedPosts = await prisma.postInsta.findMany({
            where: {
                id: { in: user.BookmarkPost },
            },
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

        // Récupérer les tops bookmarkés
        const bookmarkedTops: TopWithMain[] = await prisma.top.findMany({
            where: {
                id: { in: user.BookmarkTop },
            },
            include: {
                mainMedia: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return {
            bookmarkedPosts,
            bookmarkedPlaces,
            bookmarkedTops,
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error)
        return {
            error: "Échec de la récupération des favoris",
            bookmarkedPosts: [],
            bookmarkedPlaces: [],
            bookmarkedTops: []
        }
    }
})

export const toggleBookmarkPost = SA(async (session, postId: string): Promise<null> => {
    const user = session.user
    if (user.BookmarkPost.includes(postId)) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                BookmarkPost: {
                    set: user.BookmarkPost.filter((id) => id !== postId)
                }
            }
        })
    } else {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                BookmarkPost: {
                    set: [...user.BookmarkPost, postId]
                }
            }
        })
    }
    return null
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
export const toggleBookmarkTop = SA(async (session, TopId: string): Promise<null> => {
    const user = session.user
    if (user.BookmarkTop.includes(TopId)) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                BookmarkTop: {
                    set: user.BookmarkTop.filter((id) => id !== TopId)
                }
            }
        })
    } else {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                BookmarkTop: {
                    set: [...user.BookmarkTop, TopId]
                }
            }
        })
    }
    return null
})