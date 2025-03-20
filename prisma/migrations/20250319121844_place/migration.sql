/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `MediaPlace` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `MenuPlace` table. All the data in the column will be lost.
  - You are about to drop the column `menu` on the `Place` table. All the data in the column will be lost.
  - Added the required column `value` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_placeId_fkey";

-- DropForeignKey
ALTER TABLE "MediaPlace" DROP CONSTRAINT "MediaPlace_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MediaPlace" DROP CONSTRAINT "MediaPlace_placeId_fkey";

-- DropForeignKey
ALTER TABLE "MenuPlace" DROP CONSTRAINT "MenuPlace_menuId_fkey";

-- DropForeignKey
ALTER TABLE "MenuPlace" DROP CONSTRAINT "MenuPlace_placeId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "createdAt",
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MediaPlace" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "MenuPlace" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "menu",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'draft',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "MediaPlace" ADD CONSTRAINT "MediaPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaPlace" ADD CONSTRAINT "MediaPlace_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPlace" ADD CONSTRAINT "MenuPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPlace" ADD CONSTRAINT "MenuPlace_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
