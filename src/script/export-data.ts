import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { PrismaClient } from "@prisma/client";

const sourceDb = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL
    },
  },
});

const OUTPUT_DIR = "./data-export";

async function exportData() {
  console.log("📤 Export des données...\n");

  try {
    mkdirSync(OUTPUT_DIR, { recursive: true });

    const models = [
      "Activity",
      "ErrorLog",
      "PostInsta",
      "Media",
      "MediaPlace",
      "Contact",
      "Menu",
      "MenuPlace",
      "PlaceType",
      "Task",
      "TaskStatus",
      "TaskComment",
      "Attachment",
      "TaskHistory",
      "Top",
      "User",
      "Session",
      "PasswordReset",
    ];

    for (const model of models) {
      try {
        console.log(`📦 Export ${model}...`);
        const data = (await sourceDb.$queryRawUnsafe(
          `SELECT * FROM "${model}"`
        )) as any[];

        const filePath = join(OUTPUT_DIR, `${model}.json`);
        writeFileSync(filePath, JSON.stringify(data, null, 2));

        console.log(`✅ ${data.length} enregistrements → ${filePath}\n`);
      } catch (error: any) {
        console.log(`⚠️  ${model}: ${error.message}\n`);
      }
    }

    console.log("✨ Export terminé !");
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  } finally {
    await sourceDb.$disconnect();
  }
}

exportData().catch(console.error);
