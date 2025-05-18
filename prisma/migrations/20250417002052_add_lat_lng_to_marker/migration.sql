/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Marker` table. All the data in the column will be lost.
  - Added the required column `lat` to the `Marker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Marker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Marker" DROP COLUMN "coordinates",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
