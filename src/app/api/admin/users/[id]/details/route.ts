import { NextResponse } from 'next/server';

import { currentSession } from '@/lib/current-user';
import { prisma } from '@/prisma';

export async function GET(request: Request, context: any) {
    try {
        const { params } = context
        const userId = params.id.toString()
        // Check authentication and admin permissions
        const session = await currentSession()
        if (
            !session ||
            !session.user ||
            !session.user.permissions.some((role) => ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(role))
        ) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }


        // Get user details with sessions, activities, and media
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                Session: {
                    orderBy: {
                        lastActive: "desc",
                    },
                },
                Activity: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 20,
                    include: {
                        session: true,
                    },
                },

            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error fetching user details:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
