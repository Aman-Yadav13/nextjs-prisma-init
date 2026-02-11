"use client";

import { create } from "zustand";
import { environmentApi } from "@/api/environment";

interface Infrastructure {
  vpc_id: string | null;
  vpc_cidr: string | null;
  subnet_app_1: string | null;
  subnet_app_2: string | null;
  subnet_app_3: string | null;
  instance_type: string | null;
  is_multi_az: boolean;
  resource_group: string | null;
}

interface Cluster {
  cluster_name: string;
  helm_branch: string | null;
  dashboard_url: string | null;
  ingress_host: string | null;
  has_ingress: boolean;
  has_autoscaler: boolean;
}

interface DataStore {
  rds_endpoint: string | null;
  rds_class: string | null;
  es_endpoint: string | null;
  es_instance: string | null;
  redis_host: string | null;
  redis_cluster_id: string | null;
}

interface Application {
  ecm_replicas: number | null;
  ecm_cpu_limit: string | null;
  ecm_mem_limit: string | null;
  ecm_java_ops: string | null;
  userms_replicas: number | null;
  pam_enabled: boolean;
  ispm_enabled: boolean;
  apm_enabled: boolean;
  apm_url: string | null;
  log_bucket: string | null;
}

interface EnvironmentDetail {
  id: number;
  slug: string;
  customer_name: string;
  environment: string;
  type: string | null;
  cloud_platform: string;
  account_id: string;
  region: string;
  created_at_git: string | null;
  updated_at_helm: string | null;
  web_url: string | null;
  infrastructure: Infrastructure | null;
  cluster: Cluster | null;
  data_store: DataStore | null;
  application: Application | null;
}

interface EnvironmentDetailStore {
  environment: EnvironmentDetail | null;
  isLoading: boolean;
  error: string | null;
  fetchEnvironment: (slug: string) => Promise<void>;
}

export const useEnvironmentDetailStore = create<EnvironmentDetailStore>(
  (set) => ({
    environment: null,
    isLoading: false,
    error: null,
    fetchEnvironment: async (slug: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await environmentApi.getBySlug(slug);
        set({ environment: response.data, isLoading: false });
      } catch (error) {
        set({ error: "Failed to load environment", isLoading: false });
      }
    },
  })
);
