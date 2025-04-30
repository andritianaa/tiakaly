-- AlterTable
ALTER TABLE "User" ADD COLUMN     "BookmarkPost" TEXT[] DEFAULT ARRAY[]::TEXT[];
