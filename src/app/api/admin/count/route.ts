// app/api/admin/count/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const count = await prisma.user.count();
        return NextResponse.json(count);
    } catch (error) {
        return NextResponse.json(
            { error: "Error moderating task" },
            { status: 500 }
        );
    }
}
