import type { Top } from "@/types"
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useTops(query = "") {
    const { data, error, isLoading, mutate } = useSWR<Top[]>(
        `/api/tops${query ? `?q=${encodeURIComponent(query)}` : ""}`,
        fetcher,
    )

    return {
        tops: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}

