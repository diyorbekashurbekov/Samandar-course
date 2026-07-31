-- CreateEnum
CREATE TYPE "VideoUploadStatus" AS ENUM ('NONE', 'UPLOADING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "videoDurationSeconds" INTEGER,
ADD COLUMN     "videoPublicId" TEXT,
ADD COLUMN     "videoSizeBytes" BIGINT,
ADD COLUMN     "videoUploadStatus" "VideoUploadStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "videoUploadedAt" TIMESTAMP(3);
