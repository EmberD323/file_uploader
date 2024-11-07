/*
  Warnings:

  - A unique constraint covering the columns `[file_path]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_path` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "file_path" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_file_path_key" ON "File"("file_path");
