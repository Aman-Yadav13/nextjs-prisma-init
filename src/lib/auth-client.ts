import axios from "axios";
import { useSession } from "next-auth/react";

const clientApiClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export function useAuthToken() {
  const { data: session } = useSession();
  return session?.id_token;
}

clientApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default clientApiClient;
