import { auth } from "@/auth";

// Helper to make secure calls from SERVER Components
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await auth();

  if (!session?.id_token) {
    throw new Error("Unauthorized: No session found");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.id_token}`,
      "Content-Type": "application/json",
    },
  });

  // Handle 401s centrally (optional)
  if (res.status === 401) {
    // You might want to redirect to login or throw specific error
    console.error("Token expired or invalid");
  }

  return res;
}
