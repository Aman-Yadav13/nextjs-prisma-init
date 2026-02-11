import axios from "axios";
import { auth } from "@/auth";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const session = await auth();
  if (session?.id_token) {
    config.headers.Authorization = `Bearer ${session.id_token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Token expired or invalid");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
