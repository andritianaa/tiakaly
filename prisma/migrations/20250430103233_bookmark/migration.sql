-- AlterTable
ALTER TABLE "User" ADD COLUMN     "BookmarkPlace" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "BookmarkTop" TEXT[] DEFAULT ARRAY[]::TEXT[];
