/*
  Warnings:

  - Added the required column `mainMediaId` to the `PostInsta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostInsta" ADD COLUMN     "mainMediaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PostInsta" ADD CONSTRAINT "PostInsta_mainMediaId_fkey" FOREIGN KEY ("mainMediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
