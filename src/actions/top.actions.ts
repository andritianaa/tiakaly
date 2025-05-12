"use server"

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { buildSlug } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

// Schema for Top creation/update
const topSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    top1Id: z.string().min(1),
    top1Reason: z.string().min(1),
    top2Id: z.string().optional(),
    top2Reason: z.string().min(1),
    top3Id: z.string().optional(),
    top3Reason: z.string().min(1),
})

type TopFormValues = z.infer<typeof topSchema>

// Create a new Top
export async function createTop(data: any) {
    try {
        // Validate data
        topSchema.parse(data)

        let generatedId = buildSlug(data.title);
        let isUnique = false;

        while (!isUnique) {
            const existingPlace = await prisma.top.findUnique({
                where: { id: generatedId },
            });

            if (!existingPlace) {
                isUnique = true;
            } else {
                const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate 4 random digits
                generatedId = `${buildSlug(data.title)}-${randomNumbers}`;
            }
        }

        // Create the Top record
        const top = await prisma.top.create({
            data: {
                id: generatedId,
                title: data.title,
                description: data.description,
                top1Id: data.top1Id,
                top1Reason: data.top1Reason,
                top2Id: data.top2Id || null,
                top2Reason: data.top2Reason,
                top3Id: data.top3Id || null,
                top3Reason: data.top3Reason,
                mainMediaId: data.mainMediaId,
            },
            include: {
                mainMedia: true,
                top1: {
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
                },
                top2: {
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
                },
                top3: {
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
                },
            },
        })

        revalidatePath("/admin/top")
        return { data: top }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: "Validation error", details: error.errors }
        }
        console.error("Error creating Top:", error)
        return { error: "Failed to create Top list" }
    }
}

// Update an existing Top
export async function updateTop(id: string, data: any) {
    try {
        // Validate data
        topSchema.parse(data)

        // Update the Top record
        const top = await prisma.top.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                top1Id: data.top1Id,
                top1Reason: data.top1Reason,
                top2Id: data.top2Id || null,
                top2Reason: data.top2Reason,
                top3Id: data.top3Id || null,
                top3Reason: data.top3Reason,
                mainMediaId: data.mainMediaId,
            },
            include: {
                mainMedia: true,
                top1: {
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
                },
                top2: {
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
                },
                top3: {
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
                },
            },
        })

        revalidatePath("/admin/top")
        revalidatePath(`/admin/top/${id}`)
        return { data: top }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: "Validation error", details: error.errors }
        }
        console.error("Error updating Top:", error)
        return { error: "Failed to update Top list" }
    }
}

// Delete a Top
export async function deleteTop(id: string) {
    try {
        await prisma.top.delete({
            where: { id },
        })

        revalidatePath("/admin/top")
        return { success: true }
    } catch (error) {
        console.error("Error deleting Top:", error)
        return { error: "Failed to delete Top list" }
    }
}

// Get all Top entries
export async function getTops(query = "") {
    try {
        const tops = await prisma.top.findMany({
            where: query
                ? {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                }
                : undefined,
            include: {
                top1: {
                    select: {
                        id: true,
                        title: true,
                        url: true,
                    },
                },
                top2: {
                    select: {
                        id: true,
                        title: true,
                        url: true,
                    },
                },
                top3: {
                    select: {
                        id: true,
                        title: true,
                        url: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return { data: tops }
    } catch (error) {
        console.error("Error fetching Top entries:", error)
        return { error: "Failed to fetch Top lists" }
    }
}

// Get a single Top by ID
export async function getTopById(id: string) {
    try {
        const top = await prisma.top.findUnique({
            where: { id },
            include: {
                top1: {
                    select: {
                        id: true,
                        title: true,
                        url: true,
                        date: true,
                        isFacebook: true,
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
                        isFacebook: true,
                        date: true,
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
                        isFacebook: true,
                        date: true,
                        place: {
                            select: {
                                id: true,
                                title: true,
                                localisation: true,
                            },
                        },
                    },
                },
                mainMedia: true
            },
        })

        if (!top) {
            throw new Error("Top list not found")
        }

        return top
    } catch (error) {
        console.error("Error fetching Top:", error)
        throw new Error("Failed to fetch Top list")
    }
}

