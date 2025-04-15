"use server"

import { revalidatePath } from 'next/cache';

import { PrismaClient } from '@prisma/client';

import type { PostFacebookFormValues, PostInstaFormValues } from "@/components/post-insta/create-post-insta-form";

const prisma = new PrismaClient()

// Check if URL already exists
export async function checkUrlExists(url: string): Promise<boolean> {
    const post = await prisma.postInsta.findFirst({
        where: {
            url: url,
        },
    })

    return !!post
}

// Create a new PostInsta
export async function createPostInsta(data: PostInstaFormValues) {
    try {
        // Check if URL already exists
        const urlExists = await checkUrlExists(data.url)
        if (urlExists) {
            return { error: "Cette URL existe déjà" }
        }

        // Create the PostInsta record
        const postInsta = await prisma.postInsta.create({
            data: {
                date: data.date,
                url: data.url,
                title: data.title,
                placeId: data.placeId || null,
                mainMediaId: data.mainMediaId,
            },
            include: {
                mainMedia: true,
                place: true,
            },
        })

        revalidatePath("/admin/post-insta")
        return { data: postInsta }
    } catch (error) {
        console.error("Error creating PostInsta:", error)
        return { error: "Échec de la création du post Instagram" }
    }
}
export async function createPostFb(data: PostFacebookFormValues) {
    try {
        // Check if URL already exists
        const urlExists = await checkUrlExists(data.url)
        if (urlExists) {
            return { error: "Cette URL existe déjà" }
        }

        const media = await prisma.media.findFirst()

        // Create the PostInsta record
        const post = await prisma.postInsta.create({
            data: {
                date: new Date(),
                url: data.url,
                title: data.title,
                placeId: null,
                mainMediaId: media!.id,
                isFacebook: true
            },
            include: {
                mainMedia: true,
                place: true,
            },
        })

        revalidatePath("/admin/post-insta")
        return { data: post }
    } catch (error) {
        console.error("Error creating PostInsta:", error)
        return { error: "Échec de la création du post Instagram" }
    }
}

// Update an existing PostInsta
export async function updatePostInsta(id: string, data: PostInstaFormValues) {
    try {
        // If URL has changed, check if the new URL already exists
        if (data.url) {
            const existingPost = await prisma.postInsta.findFirst({
                where: {
                    url: data.url,
                    NOT: {
                        id: id,
                    },
                },
            })

            if (existingPost) {
                return { error: "Cette URL existe déjà" }
            }
        }

        // Update the PostInsta record
        const postInsta = await prisma.postInsta.update({
            where: { id },
            data: {
                date: data.date,
                url: data.url,
                title: data.title,
                placeId: data.placeId || null,
                mainMediaId: data.mainMediaId,
            },
            include: {
                mainMedia: true,
                place: true,
            },
        })

        revalidatePath("/admin/post-insta")
        return { data: postInsta }
    } catch (error) {
        console.error("Error updating PostInsta:", error)
        return { error: "Échec de la mise à jour du post Instagram" }
    }
}

// Delete a PostInsta
export async function deletePostInsta(id: string) {
    try {
        await prisma.postInsta.delete({
            where: { id },
        })

        revalidatePath("/admin/post-insta")
        return { success: true }
    } catch (error) {
        console.error("Error deleting PostInsta:", error)
        return { error: "Échec de la suppression du post Instagram" }
    }
}

// Get all PostInsta entries
export async function getPostInsta(query = "") {
    try {
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
            orderBy: {
                date: "desc",
            },
        })

        return { data: posts }
    } catch (error) {
        console.error("Error fetching PostInsta entries:", error)
        return { error: "Échec de la récupération des posts Instagram" }
    }
}

// Get a single PostInsta by ID
export async function getPostInstaById(id: string) {
    try {
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
            return { error: "Post Instagram non trouvé" }
        }

        return { data: post }
    } catch (error) {
        console.error("Error fetching PostInsta:", error)
        return { error: "Échec de la récupération du post Instagram" }
    }
}

