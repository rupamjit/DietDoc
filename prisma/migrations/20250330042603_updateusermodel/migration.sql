/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- RenameForeignKey
ALTER TABLE "Recipe" RENAME CONSTRAINT "Recipe_userAuthor_fkey" TO "Recipe_userSavedBy_fkey";

-- RenameForeignKey
ALTER TABLE "Recipe" RENAME CONSTRAINT "Recipe_userSavedBy_fkey" TO "Recipe_userAuthor_fkey";
