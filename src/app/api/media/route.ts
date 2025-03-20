import { NextResponse } from "next/server";

import { prisma } from "@/prisma";

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, type } = body;

    if (!url || !type) {
      return NextResponse.json(
        { error: "URL and type are required" },
        { status: 400 }
      );
    }

    const media = await prisma.media.create({
      data: {
        url,
        type,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 }
    );
  }
}
