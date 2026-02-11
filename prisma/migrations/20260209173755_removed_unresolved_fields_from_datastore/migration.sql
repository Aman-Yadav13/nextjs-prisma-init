/*
  Warnings:

  - You are about to drop the column `api_endpoint` on the `clusters` table. All the data in the column will be lost.
  - You are about to drop the column `es_domain` on the `data_stores` table. All the data in the column will be lost.
  - You are about to drop the column `es_node_count` on the `data_stores` table. All the data in the column will be lost.
  - You are about to drop the column `es_version` on the `data_stores` table. All the data in the column will be lost.
  - You are about to drop the column `rds_engine` on the `data_stores` table. All the data in the column will be lost.
  - You are about to drop the column `rds_storage` on the `data_stores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clusters" DROP COLUMN "api_endpoint";

-- AlterTable
ALTER TABLE "data_stores" DROP COLUMN "es_domain",
DROP COLUMN "es_node_count",
DROP COLUMN "es_version",
DROP COLUMN "rds_engine",
DROP COLUMN "rds_storage";
