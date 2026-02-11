"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cloud,
  Building2,
  Users,
  Shield,
  Key,
  CheckCircle,
} from "lucide-react";

const DashboardPage = () => {
  const { stats, isLoading, error, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const tiles = [
    {
      title: "Total Environments",
      value: stats?.totalEnv || 0,
      icon: Cloud,
      color: "text-blue-600",
      subtitle: `AWS: ${stats?.totalAwsEnv || 0} | Azure: ${stats?.totalAzureEnv || 0}`,
    },
    {
      title: "Internal Environments",
      value: stats?.totalInternalEnv || 0,
      icon: Building2,
      color: "text-green-600",
      subtitle: `AWS: ${stats?.awsInternalEnv || 0} | Azure: ${stats?.azureInternalEnv || 0}`,
    },
    {
      title: "Customer Environments",
      value: stats?.totalCustomerEnv || 0,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Customer Prod",
      value: stats?.customerProdEnv || 0,
      icon: Shield,
      color: "text-red-600",
      subtitle: `AWS: ${stats?.awsCustomerProd || 0} | Azure: ${stats?.azureCustomerProd || 0}`,
    },
    {
      title: "Customer Non-Prod",
      value: stats?.customerNonProdEnv || 0,
      icon: CheckCircle,
      color: "text-orange-600",
      subtitle: `AWS: ${stats?.awsCustomerNonProd || 0} | Azure: ${stats?.azureCustomerNonProd || 0}`,
    },
    {
      title: "PAM Enabled",
      value: stats?.totalPamEnabled || 0,
      icon: Key,
      color: "text-indigo-600",
    },
    {
      title: "ISPM Enabled",
      value: stats?.totalIspmEnabled || 0,
      icon: Shield,
      color: "text-teal-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of cloud environments and configurations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Card key={tile.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {tile.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${tile.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tile.value}</div>
                {tile.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {tile.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
