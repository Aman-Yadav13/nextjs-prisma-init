"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import clientApiClient from "@/lib/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    const requestInterceptor = clientApiClient.interceptors.request.use(
      (config) => {
        if (session?.id_token) {
          config.headers.Authorization = `Bearer ${session.id_token}`;
        }
        return config;
      }
    );

    return () => {
      clientApiClient.interceptors.request.eject(requestInterceptor);
    };
  }, [session]);

  return <>{children}</>;
}
