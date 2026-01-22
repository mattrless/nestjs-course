/*
  Warnings:

  - You are about to alter the column `cover_image` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "cover_image" TEXT,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "cover_image" SET DATA TYPE VARCHAR(2048);
