import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

// Validation schema
const postInstaSchema = z.object({
    date: z.string().or(z.date()),
    url: z.string().url(),
    title: z.string().min(1),
    placeId: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate request body
        const validatedData = postInstaSchema.parse(body)

        // Convert string date to Date object if needed
        const date = typeof validatedData.date === "string" ? new Date(validatedData.date) : validatedData.date

        // Create the PostInsta record
        const postInsta = await prisma.postInsta.create({
            data: {
                date,
                url: validatedData.url,
                title: validatedData.title,
                placeId: validatedData.placeId || null,
            },
        })

        return NextResponse.json(postInsta, { status: 201 })
    } catch (error) {
        console.error("Error creating PostInsta:", error)

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
        }

        return NextResponse.json({ error: "Failed to create Instagram post" }, { status: 500 })
    }
}

