"use client";

import { create } from "zustand";
import { awsApi } from "@/api/aws";

interface EKSNodeGroup {
  name: string;
  instance_types: string[];
  desired_size: number;
  min_size: number;
  max_size: number;
  status: string;
}

interface EKSCluster {
  name: string;
  status: string;
  kubernetes_version: string;
  endpoint: string;
  arn: string;
  vpc_id: string;
  subnet_ids: string[];
  nat_gateway_ips: string[];
  total_nodes: number;
  node_groups: EKSNodeGroup[];
}

interface RDSPerformance {
  cpu_percent: number | null;
  free_storage_gb: number | null;
  connections: number | null;
}

interface RDSInstance {
  identifier: string;
  endpoint: string;
  status: string;
  engine: string;
  engine_version: string;
  instance_class: string;
  allocated_storage_gb: number;
  multi_az: boolean;
  storage_encrypted: boolean;
  performance: RDSPerformance;
}

interface ElasticSearch {
  domain_name: string;
  status: string;
  version: string;
  endpoint: string | null;
  instance_type: string;
  instance_count: number;
  volume_size_gb: number;
}

interface AWSResources {
  cluster_name: string;
  region: string;
  timestamp: string;
  eks: EKSCluster | null;
  rds: RDSInstance | null;
  elasticsearch: ElasticSearch | null;
}

interface AWSResourcesStore {
  resources: AWSResources | null;
  isLoading: boolean;
  error: string | null;
  fetchResources: (
    clusterName: string,
    accountId: string,
    region: string,
    forceRefresh: boolean,
    token: string
  ) => Promise<void>;
  clearResources: () => void;
}

export const useAWSResourcesStore = create<AWSResourcesStore>((set, get) => ({
  resources: null,
  isLoading: false,
  error: null,
  fetchResources: async (
    clusterName: string,
    accountId: string,
    region: string,
    forceRefresh: boolean,
    token: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await awsApi.fetchCloudResources(
        clusterName,
        accountId,
        region,
        forceRefresh,
        token
      );
      console.log("AWS Resources:", response.data);
      set({ resources: response.data.resources, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch AWS resources:", error);
      set({ error: "Failed to fetch AWS resources", isLoading: false });
    }
  },
  clearResources: () => set({ resources: null, error: null }),
}));
