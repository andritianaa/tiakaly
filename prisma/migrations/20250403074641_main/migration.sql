/*
  Warnings:

  - Added the required column `mainMediaId` to the `Top` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Top" ADD COLUMN     "mainMediaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Top" ADD CONSTRAINT "Top_mainMediaId_fkey" FOREIGN KEY ("mainMediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
