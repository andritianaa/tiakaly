import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma";

export const GET = async (req: NextRequest, context: any) => {
  const { params } = context;
  const email = params.username.toString();
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email as string,
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
