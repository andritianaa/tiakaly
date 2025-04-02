-- CreateTable
CREATE TABLE "PostInsta" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "placeId" TEXT,

    CONSTRAINT "PostInsta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Top" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "top1Id" TEXT NOT NULL,
    "top1Reason" TEXT NOT NULL,
    "top2Id" TEXT,
    "top2Reason" TEXT NOT NULL,
    "top3Id" TEXT,
    "top3Reason" TEXT NOT NULL,

    CONSTRAINT "Top_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostInsta" ADD CONSTRAINT "PostInsta_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Top" ADD CONSTRAINT "Top_top1Id_fkey" FOREIGN KEY ("top1Id") REFERENCES "PostInsta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Top" ADD CONSTRAINT "Top_top2Id_fkey" FOREIGN KEY ("top2Id") REFERENCES "PostInsta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Top" ADD CONSTRAINT "Top_top3Id_fkey" FOREIGN KEY ("top3Id") REFERENCES "PostInsta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
