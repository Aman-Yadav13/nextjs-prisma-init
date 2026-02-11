import axios from "axios";
import { signOut } from "next-auth/react";

const backendClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

backendClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: "/login" });
    }
    return Promise.reject(error);
  }
);

export const awsApi = {
  fetchCloudResources: (
    clusterName: string,
    accountId: string,
    region: string,
    forceRefresh: boolean = false,
    token: string
  ) =>
    backendClient.get("/api/fetchCloudResources", {
      params: {
        cluster_name: clusterName,
        account_id: accountId,
        region: region,
        force_refresh: forceRefresh,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
