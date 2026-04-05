-- DropForeignKey
ALTER TABLE "GeneratedAsset" DROP CONSTRAINT "GeneratedAsset_userId_fkey";

-- AlterTable
ALTER TABLE "GeneratedAsset" ADD COLUMN     "guestToken" TEXT,
ADD COLUMN     "logoSvg" TEXT,
ADD COLUMN     "wordmarkSvg" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "imageUrl" SET DEFAULT '';

-- CreateIndex
CREATE INDEX "GeneratedAsset_guestToken_idx" ON "GeneratedAsset"("guestToken");

-- AddForeignKey
ALTER TABLE "GeneratedAsset" ADD CONSTRAINT "GeneratedAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
