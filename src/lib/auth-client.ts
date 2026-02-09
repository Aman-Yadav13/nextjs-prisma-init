import { useSession } from "next-auth/react";

// Custom hook to get the token in Client Components
export function useAuthToken() {
  const { data: session } = useSession();
  return session?.id_token;
}

// Helper to make API calls from Client Components
export async function clientApiFetch(
  endpoint: string,
  token: string | undefined,
  options: RequestInit = {},
) {
  if (!token) {
    throw new Error("No auth token available");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    // Handle token expiry
    window.location.href = "/login";
  }

  return res;
}
