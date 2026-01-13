/*
  Warnings:

  - You are about to drop the column `cognitoId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_cognitoId_key";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "endDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cognitoId";
