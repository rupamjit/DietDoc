-- CreateEnum
CREATE TYPE "Category" AS ENUM ('NUTRITION', 'FITNESS', 'MENTAL_HEALTH', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "category" "Category" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "cookingTime" TEXT NOT NULL,
    "complexity" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "gender" TEXT NOT NULL,
    "allergies" TEXT[],
    "chronicDiseases" TEXT[],
    "dietaryPreferences" TEXT[],

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
