import clientApiClient from "@/lib/auth-client";

export const environmentApi = {
  getAll: () => clientApiClient.get("/api/environments"),
  
  getBySlug: (slug: string) => clientApiClient.get(`/api/environments/${slug}`),
};
