/*
  Warnings:

  - You are about to drop the column `linkCount` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "linkCount",
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;
