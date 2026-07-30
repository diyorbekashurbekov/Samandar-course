/*
  Warnings:

  - You are about to drop the column `published` on the `Course` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('video', 'test');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "published",
ADD COLUMN     "level" "CourseLevel" NOT NULL DEFAULT 'Beginner',
ADD COLUMN     "priceKzt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "durationMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isFreePreview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "LessonType" NOT NULL DEFAULT 'video';
