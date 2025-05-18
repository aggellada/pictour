-- CreateTable
CREATE TABLE "Marker" (
    "id" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "coordinates" INTEGER[],

    CONSTRAINT "Marker_pkey" PRIMARY KEY ("id")
);
