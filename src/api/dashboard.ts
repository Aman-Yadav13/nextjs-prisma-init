import clientApiClient from "@/lib/auth-client";

export const dashboardApi = {
  getStats: () => clientApiClient.get("/api/dashboard/stats"),
};