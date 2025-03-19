import { useEffect } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";
import { User } from "@/types/schema";
import { Session } from "@prisma/client";

interface ErrorResponse {
  error: string;
}
interface Data {
  user: User;
  session: Session;
}
export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<Data | ErrorResponse>(
    "/api/auth/session",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  useEffect(() => {
    if (data && "user" in data) {
      localStorage.setItem("lang", data.user.language);
    }
  }, [data]);

  const isUnauthorized =
    data && "error" in data && data.error === "Non autorisé";
  const user = data && !isUnauthorized && !("error" in data) ? data.user : null;
  const session =
    data && !isUnauthorized && !("error" in data) ? data.session : null;

  return {
    user,
    session,
    isLoading,
    isError:
      !data || isUnauthorized || error ? new Error("User not found") : null,
    mutate,
  } as const;
}
