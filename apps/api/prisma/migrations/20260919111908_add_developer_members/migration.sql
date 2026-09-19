-- CreateEnum
CREATE TYPE "DeveloperMemberRole" AS ENUM ('OWNER', 'MANAGER', 'STAFF');

-- CreateTable
CREATE TABLE "developer_members" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "DeveloperMemberRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "developer_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "developer_members_userId_idx" ON "developer_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "developer_members_developerId_userId_key" ON "developer_members"("developerId", "userId");

-- AddForeignKey
ALTER TABLE "developer_members" ADD CONSTRAINT "developer_members_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "developers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_members" ADD CONSTRAINT "developer_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
