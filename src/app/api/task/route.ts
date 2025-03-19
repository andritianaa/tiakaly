// app/api/task/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { currentSession } from '@/lib/current-user';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const session = await currentSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: session.userId },
      include: {
        user: true,
        comments: true,
        attachments: true,
        moderator: true,
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}
