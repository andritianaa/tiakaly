import { NextResponse } from "next/server";

import { prisma } from "@/prisma";
import { Status } from "@prisma/client";

export async function PATCH(request: Request, context: any) {
  try {
    const body = await request.json();
    const { status } = body;

    const { params } = context;
    const id = params.id.toString();
    if (!Object.values(Status).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const place = await prisma.place.update({
      where: {
        id: id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(place);
  } catch (error) {
    console.error("Error updating place status:", error);
    return NextResponse.json(
      { error: "Failed to update place status" },
      { status: 500 }
    );
  }
}
