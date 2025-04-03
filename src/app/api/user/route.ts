import { NextResponse } from 'next/server';
import { z } from 'zod';

import { currentUser } from '@/lib/current-user';
import { prisma } from '@/prisma';

// Schéma de validation pour la mise à jour du profil
const updateProfileSchema = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    image: z.string().optional(),
    theme: z.enum(["light", "dark", "system"]).optional(),
})

// GET: Récupérer les informations du profil de l'utilisateur connecté
export async function GET() {
    try {
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

// PUT: Mettre à jour les informations du profil
export async function PUT(request: Request) {
    try {
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
        }

        const userId = user.id
        const body = await request.json()

        // Valider les données
        const validatedData = updateProfileSchema.parse(body)

        // Vérifier si le nom d'utilisateur est déjà pris (si modifié)
        if (validatedData.username) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    username: validatedData.username,
                    id: { not: userId },
                },
            })

            if (existingUser) {
                return NextResponse.json({ error: "Ce nom d'utilisateur est déjà pris" }, { status: 400 })
            }
        }

        // Vérifier si l'email est déjà pris (si modifié)
        if (validatedData.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: validatedData.email,
                    id: { not: userId },
                },
            })

            if (existingUser) {
                return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
            }
        }

        // Mettre à jour le fullname si firstname ou lastname sont fournis
        let fullname: string = "";
        if (validatedData.firstname || validatedData.lastname) {
            const currentUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { firstname: true, lastname: true },
            })

            const newFirstname = validatedData.firstname ?? currentUser?.firstname ?? ""
            const newLastname = validatedData.lastname ?? currentUser?.lastname ?? ""

            if (newFirstname || newLastname) {
                fullname = `${newFirstname} ${newLastname}`.trim()
            }
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...validatedData,
                fullname,
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                fullname: true,
                username: true,
                email: true,
                image: true,
                theme: true,
                isEmailVerified: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Données invalides", details: error.errors }, { status: 400 })
        }

        console.error("Erreur lors de la mise à jour du profil:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

