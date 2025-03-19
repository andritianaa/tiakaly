import { SA } from "@/lib/safe-ation";
import { prisma } from "@/prisma";
import { Actions } from "@prisma/client";

export const trackAction = SA(
  async (session, action: Actions, metadata: any = {}) => {
    try {
      if (!session) {
        throw new Error("Session is missing");
      }

      await prisma.activity.create({
        data: {
          userId: session.userId,
          sessionId: session.id,
          action,
          metadata,
        },
      });
    } catch (error) {
      console.error("Erreur de tracking :", error);
    }
  }
);
