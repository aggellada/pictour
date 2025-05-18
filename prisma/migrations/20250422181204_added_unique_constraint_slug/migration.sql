/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Marker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Marker_slug_key" ON "Marker"("slug");
