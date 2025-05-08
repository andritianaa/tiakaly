/*
  Warnings:

  - You are about to drop the column `BookmarkPost` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `BookmarkTop` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "BookmarkPost",
DROP COLUMN "BookmarkTop",
ADD COLUMN     "TestedPlace" TEXT[] DEFAULT ARRAY[]::TEXT[];
