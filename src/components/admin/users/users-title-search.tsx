"use client";

import { RefreshCw } from "lucide-react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/utils";

interface UsersTitleSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleFilterChange: () => void;
  refreshData: () => void;
}

export function UsersTitleSearch({
  searchQuery,
  setSearchQuery,
  handleFilterChange,
  refreshData,
}: UsersTitleSearchProps) {
  const { data: count } = useSWR<number>("/api/admin/count", fetcher);

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0 px-6 pt-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          User Management ({count})
        </h2>
        <p className="text-muted-foreground">
          Manage users, permissions, and account settings
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleFilterChange();
          }}
          className="w-64"
        />
        <Button variant="outline" size="icon" onClick={refreshData}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
