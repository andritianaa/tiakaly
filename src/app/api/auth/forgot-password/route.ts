import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { sendResetEmail } from "@/lib/mail";
import { prisma } from "@/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({
        message: "If this address exists, an email has been sent.",
      });
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 heure

    await prisma.passwordReset.deleteMany({
      where: { email },
    });

    await prisma.passwordReset.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // TO DO : Configurer envoie d'email
    await sendResetEmail(email, token);

    return NextResponse.json({
      message: "If this address exists, an email has been sent.",
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
