-- CreateTable
CREATE TABLE "environments" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "type" TEXT,
    "cloud_platform" TEXT NOT NULL DEFAULT 'aws',
    "account_id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "created_at_git" TEXT,
    "updated_at_helm" TEXT,
    "web_url" TEXT,

    CONSTRAINT "environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infrastructure" (
    "id" SERIAL NOT NULL,
    "env_id" INTEGER NOT NULL,
    "vpc_id" TEXT,
    "vpc_cidr" TEXT,
    "subnet_app_1" TEXT,
    "subnet_app_2" TEXT,
    "subnet_app_3" TEXT,
    "instance_type" TEXT,
    "node_count" INTEGER,
    "is_multi_az" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "infrastructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clusters" (
    "id" SERIAL NOT NULL,
    "env_id" INTEGER NOT NULL,
    "cluster_name" TEXT NOT NULL,
    "helm_branch" TEXT,
    "api_endpoint" TEXT,
    "dashboard_url" TEXT,
    "ingress_host" TEXT,
    "has_ingress" BOOLEAN NOT NULL DEFAULT false,
    "has_autoscaler" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_stores" (
    "id" SERIAL NOT NULL,
    "env_id" INTEGER NOT NULL,
    "rds_endpoint" TEXT,
    "rds_class" TEXT,
    "rds_engine" TEXT,
    "rds_storage" TEXT,
    "es_endpoint" TEXT,
    "es_domain" TEXT,
    "es_version" TEXT,
    "es_instance" TEXT,
    "es_node_count" INTEGER,
    "redis_host" TEXT,
    "redis_cluster_id" TEXT,

    CONSTRAINT "data_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "env_id" INTEGER NOT NULL,
    "ecm_replicas" INTEGER,
    "ecm_cpu_limit" TEXT,
    "ecm_mem_limit" TEXT,
    "ecm_java_ops" TEXT,
    "userms_replicas" INTEGER,
    "pam_enabled" BOOLEAN NOT NULL DEFAULT false,
    "apm_enabled" BOOLEAN NOT NULL DEFAULT false,
    "apm_url" TEXT,
    "log_bucket" TEXT,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "environments_slug_key" ON "environments"("slug");

-- CreateIndex
CREATE INDEX "environments_customer_name_idx" ON "environments"("customer_name");

-- CreateIndex
CREATE INDEX "environments_account_id_idx" ON "environments"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "infrastructure_env_id_key" ON "infrastructure"("env_id");

-- CreateIndex
CREATE UNIQUE INDEX "clusters_env_id_key" ON "clusters"("env_id");

-- CreateIndex
CREATE UNIQUE INDEX "data_stores_env_id_key" ON "data_stores"("env_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_env_id_key" ON "applications"("env_id");

-- AddForeignKey
ALTER TABLE "infrastructure" ADD CONSTRAINT "infrastructure_env_id_fkey" FOREIGN KEY ("env_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clusters" ADD CONSTRAINT "clusters_env_id_fkey" FOREIGN KEY ("env_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_stores" ADD CONSTRAINT "data_stores_env_id_fkey" FOREIGN KEY ("env_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_env_id_fkey" FOREIGN KEY ("env_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
