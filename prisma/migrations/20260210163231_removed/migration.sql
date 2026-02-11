/*
  Warnings:

  - You are about to drop the `load_balancer_listeners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `load_balancers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `public_ips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `target_groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "load_balancer_listeners" DROP CONSTRAINT "load_balancer_listeners_load_balancer_id_fkey";

-- DropForeignKey
ALTER TABLE "load_balancers" DROP CONSTRAINT "load_balancers_aws_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "public_ips" DROP CONSTRAINT "public_ips_aws_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "target_groups" DROP CONSTRAINT "target_groups_load_balancer_id_fkey";

-- DropTable
DROP TABLE "load_balancer_listeners";

-- DropTable
DROP TABLE "load_balancers";

-- DropTable
DROP TABLE "public_ips";

-- DropTable
DROP TABLE "target_groups";
