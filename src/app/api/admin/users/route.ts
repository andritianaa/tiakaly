import { NextRequest, NextResponse } from 'next/server';

import { currentSession } from '@/lib/current-user';
import { prisma } from '@/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {

    try {
        // Check authentication and admin permissions
        const session = await currentSession()
        if (
            !session ||
            !session.user ||
            !session.user.permissions.some((role) => ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(role))
        ) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get("query") || ""
        const userId = searchParams.get("userId")
        const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
        const page = Number.parseInt(searchParams.get("page") || "1", 10)
        const skip = (page - 1) * limit

        // If userId is provided, fetch that specific user
        if (userId) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullname: true,
                    image: true,
                },
            })

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            }

            return NextResponse.json({
                users: [user],
                pagination: {
                    total: 1,
                    pages: 1,
                    page: 1,
                    limit: 1,
                },
            })
        }

        // If no userId but query is provided, search users
        let whereCondition: Prisma.UserWhereInput = {}

        if (query) {
            whereCondition = {
                OR: [
                    { username: { contains: query, mode: Prisma.QueryMode.insensitive } },
                    { email: { contains: query, mode: Prisma.QueryMode.insensitive } },
                    { fullname: { contains: query, mode: Prisma.QueryMode.insensitive } },
                ],
            }
        }

        // Search users
        const users = await prisma.user.findMany({
            where: whereCondition,

            take: limit,
            skip: skip,
            include: {
                Session: true,
            },
            orderBy: {
                username: "asc",
            },
        })

        // Get total count for pagination
        const totalCount = await prisma.user.count({ where: whereCondition })

        return NextResponse.json({
            users,
            pagination: {
                total: totalCount,
                pages: Math.ceil(totalCount / limit),
                page,
                limit,
            },
        })
    } catch (error) {
        console.error("Error searching users:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
