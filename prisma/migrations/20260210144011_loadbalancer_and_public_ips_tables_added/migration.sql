-- CreateTable
CREATE TABLE "aws_resources" (
    "id" SERIAL NOT NULL,
    "env_id" INTEGER NOT NULL,
    "last_synced" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aws_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eks_clusters" (
    "id" SERIAL NOT NULL,
    "aws_resource_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT,
    "kubernetes_version" TEXT,
    "endpoint" TEXT,
    "arn" TEXT,
    "vpc_id" TEXT,
    "subnet_ids" JSONB,
    "nat_gateway_ips" JSONB,
    "total_nodes" INTEGER,

    CONSTRAINT "eks_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eks_node_groups" (
    "id" SERIAL NOT NULL,
    "eks_cluster_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "instance_types" JSONB,
    "desired_size" INTEGER,
    "min_size" INTEGER,
    "max_size" INTEGER,
    "status" TEXT,

    CONSTRAINT "eks_node_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rds_instances" (
    "id" SERIAL NOT NULL,
    "aws_resource_id" INTEGER NOT NULL,
    "identifier" TEXT NOT NULL,
    "endpoint" TEXT,
    "status" TEXT,
    "engine" TEXT,
    "engine_version" TEXT,
    "instance_class" TEXT,
    "allocated_storage_gb" INTEGER,
    "multi_az" BOOLEAN NOT NULL DEFAULT false,
    "storage_encrypted" BOOLEAN NOT NULL DEFAULT false,
    "cpu_percent" DOUBLE PRECISION,
    "free_storage_gb" DOUBLE PRECISION,
    "connections" INTEGER,

    CONSTRAINT "rds_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elasticsearch_domains" (
    "id" SERIAL NOT NULL,
    "aws_resource_id" INTEGER NOT NULL,
    "domain_name" TEXT NOT NULL,
    "status" TEXT,
    "version" TEXT,
    "endpoint" TEXT,
    "instance_type" TEXT,
    "instance_count" INTEGER,
    "volume_size_gb" INTEGER,

    CONSTRAINT "elasticsearch_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "load_balancers" (
    "id" SERIAL NOT NULL,
    "aws_resource_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "arn" TEXT NOT NULL,
    "dns_name" TEXT,
    "type" TEXT NOT NULL,
    "scheme" TEXT,
    "state" TEXT,
    "vpc_id" TEXT,
    "availability_zones" JSONB,
    "security_groups" JSONB,
    "ip_address_type" TEXT,
    "canonical_hosted_zone_id" TEXT,
    "created_time" TIMESTAMP(3),
    "load_balancer_attributes" JSONB,

    CONSTRAINT "load_balancers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "target_groups" (
    "id" SERIAL NOT NULL,
    "load_balancer_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "arn" TEXT NOT NULL,
    "protocol" TEXT,
    "port" INTEGER,
    "vpc_id" TEXT,
    "health_check_path" TEXT,
    "health_check_protocol" TEXT,
    "health_check_port" TEXT,
    "healthy_threshold_count" INTEGER,
    "unhealthy_threshold_count" INTEGER,
    "health_check_timeout_seconds" INTEGER,
    "health_check_interval_seconds" INTEGER,
    "target_type" TEXT,

    CONSTRAINT "target_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "load_balancer_listeners" (
    "id" SERIAL NOT NULL,
    "load_balancer_id" INTEGER NOT NULL,
    "arn" TEXT NOT NULL,
    "protocol" TEXT,
    "port" INTEGER,
    "ssl_policy" TEXT,
    "certificates" JSONB,
    "default_actions" JSONB,

    CONSTRAINT "load_balancer_listeners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_ips" (
    "id" SERIAL NOT NULL,
    "aws_resource_id" INTEGER NOT NULL,
    "public_ip" TEXT NOT NULL,
    "allocation_id" TEXT,
    "association_id" TEXT,
    "instance_id" TEXT,
    "network_interface_id" TEXT,
    "private_ip_address" TEXT,
    "domain" TEXT,
    "network_border_group" TEXT,
    "public_ipv4_pool" TEXT,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT,
    "source_name" TEXT,
    "tags" JSONB,

    CONSTRAINT "public_ips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aws_resources_env_id_key" ON "aws_resources"("env_id");

-- CreateIndex
CREATE UNIQUE INDEX "eks_clusters_aws_resource_id_key" ON "eks_clusters"("aws_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "rds_instances_aws_resource_id_key" ON "rds_instances"("aws_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "elasticsearch_domains_aws_resource_id_key" ON "elasticsearch_domains"("aws_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "load_balancers_arn_key" ON "load_balancers"("arn");

-- CreateIndex
CREATE UNIQUE INDEX "target_groups_arn_key" ON "target_groups"("arn");

-- CreateIndex
CREATE UNIQUE INDEX "load_balancer_listeners_arn_key" ON "load_balancer_listeners"("arn");

-- CreateIndex
CREATE UNIQUE INDEX "public_ips_allocation_id_key" ON "public_ips"("allocation_id");

-- AddForeignKey
ALTER TABLE "aws_resources" ADD CONSTRAINT "aws_resources_env_id_fkey" FOREIGN KEY ("env_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eks_clusters" ADD CONSTRAINT "eks_clusters_aws_resource_id_fkey" FOREIGN KEY ("aws_resource_id") REFERENCES "aws_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eks_node_groups" ADD CONSTRAINT "eks_node_groups_eks_cluster_id_fkey" FOREIGN KEY ("eks_cluster_id") REFERENCES "eks_clusters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rds_instances" ADD CONSTRAINT "rds_instances_aws_resource_id_fkey" FOREIGN KEY ("aws_resource_id") REFERENCES "aws_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elasticsearch_domains" ADD CONSTRAINT "elasticsearch_domains_aws_resource_id_fkey" FOREIGN KEY ("aws_resource_id") REFERENCES "aws_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "load_balancers" ADD CONSTRAINT "load_balancers_aws_resource_id_fkey" FOREIGN KEY ("aws_resource_id") REFERENCES "aws_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target_groups" ADD CONSTRAINT "target_groups_load_balancer_id_fkey" FOREIGN KEY ("load_balancer_id") REFERENCES "load_balancers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "load_balancer_listeners" ADD CONSTRAINT "load_balancer_listeners_load_balancer_id_fkey" FOREIGN KEY ("load_balancer_id") REFERENCES "load_balancers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_ips" ADD CONSTRAINT "public_ips_aws_resource_id_fkey" FOREIGN KEY ("aws_resource_id") REFERENCES "aws_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
