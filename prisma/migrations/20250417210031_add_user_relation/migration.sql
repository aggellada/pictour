/*
  Warnings:

  - Added the required column `userId` to the `Marker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Marker" ADD COLUMN     "userId" TEXT NOT NULL;
