import { NextResponse } from "next/server";

import { currentSession, currentUser } from "@/lib/current-user";

export async function GET() {
  const user = await currentUser();
  const session = await currentSession();
  if (!user) {
    return NextResponse.json(
      { error: "user not authentified" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user, session });
}
