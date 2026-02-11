-- CreateTable
CREATE TABLE "azure_subscriptions" (
    "id" TEXT NOT NULL,
    "subscription_name" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "azure_subscriptions_pkey" PRIMARY KEY ("id")
);
