"use client";

import { create } from "zustand";
import { dashboardApi } from "@/api/dashboard";

interface DashboardStats {
  totalEnv: number;
  totalAwsEnv: number;
  totalAzureEnv: number;
  totalInternalEnv: number;
  awsInternalEnv: number;
  azureInternalEnv: number;
  totalCustomerEnv: number;
  customerProdEnv: number;
  awsCustomerProd: number;
  azureCustomerProd: number;
  customerNonProdEnv: number;
  awsCustomerNonProd: number;
  azureCustomerNonProd: number;
  totalPamEnabled: number;
  totalIspmEnabled: number;
}

interface DashboardStore {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  isLoading: false,
  error: null,
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getStats();
      set({ stats: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load dashboard stats", isLoading: false });
    }
  },
}));