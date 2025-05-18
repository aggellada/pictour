/*
  Warnings:

  - Added the required column `link` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Marker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Marker" ADD COLUMN     "slug" TEXT NOT NULL;
