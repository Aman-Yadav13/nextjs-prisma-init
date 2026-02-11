"use client";

import { create } from "zustand";
import { environmentApi } from "@/api/environment";

interface Environment {
  slug: string;
  cloud_platform: string;
  region: string;
  account_id: string;
  customer_name: string;
  environment: string;
  type: string | null;
  web_url: string | null;
  ispm_enabled: boolean;
  pam_enabled: boolean;
}

interface EnvironmentStore {
  environments: Environment[];
  isLoading: boolean;
  error: string | null;
  fetchEnvironments: () => Promise<void>;
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environments: [],
  isLoading: false,
  error: null,
  fetchEnvironments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await environmentApi.getAll();
      set({ environments: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load environments", isLoading: false });
    }
  },
}));
