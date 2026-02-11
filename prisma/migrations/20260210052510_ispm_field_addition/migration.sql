/*
  Warnings:

  - You are about to drop the column `node_count` on the `infrastructure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "ispm_enabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "infrastructure" DROP COLUMN "node_count";
