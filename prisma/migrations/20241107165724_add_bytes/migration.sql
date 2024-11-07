/*
  Warnings:

  - You are about to drop the column `size` on the `File` table. All the data in the column will be lost.
  - Added the required column `size_bytes` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "size",
ADD COLUMN     "size_bytes" INTEGER NOT NULL;
