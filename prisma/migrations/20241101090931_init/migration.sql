/*
  Warnings:

  - You are about to drop the column `userStatus` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "userStatus",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
