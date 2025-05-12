"use client";

import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import { UserDetailsDialog } from "@/components/admin/users/user-details-dialog";
import { UsersFilters } from "@/components/admin/users/users-filters";
import { UsersHeader } from "@/components/admin/users/users-header";
import { UsersPagination } from "@/components/admin/users/users-pagination";
import { UsersTable } from "@/components/admin/users/users-table";
import { UsersTitleSearch } from "@/components/admin/users/users-title-search";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/utils";

import type { AdminUsersResponse, UserFilters } from "@/types/admin-users";
import type { User } from "@/types/schema";

export default function AdminUserDashboard() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [filters, setFilters] = useState<UserFilters>({
    searchQuery: "",
    roleFilter: [],
    verificationFilter: null,
    statusFilter: null,
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortDirection: "desc",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);

  // Build query parameters for API call
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters.searchQuery) params.append("search", filters.searchQuery);
    filters.roleFilter.forEach((role) => params.append("role", role));
    if (filters.verificationFilter)
      params.append("verification", filters.verificationFilter);
    if (filters.statusFilter) params.append("status", filters.statusFilter);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    params.append("sortBy", filters.sortBy);
    params.append("sortDirection", filters.sortDirection);

    return params.toString();
  }, [page, limit, filters]);

  // Fetch users data
  const { data, error, isLoading, mutate } = useSWR<AdminUsersResponse>(
    `/api/admin/users?${buildQueryString()}`,
    fetcher
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    if (filterChanged) {
      setPage(1);
      setFilterChanged(false);
    }
  }, [filterChanged]);

  const handleFilterChange = () => {
    setFilterChanged(true);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      roleFilter: [],
      verificationFilter: null,
      statusFilter: null,
      startDate: "",
      endDate: "",
      sortBy: "createdAt",
      sortDirection: "desc",
    });
    // Call handleFilterChange in a setTimeout to break the render cycle
    setTimeout(() => {
      handleFilterChange();
    }, 0);
  }, []);

  // Handle view user details
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load users: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <UsersHeader />

      <div className="space-y-6 p-6 pt-0 flex-1">
        <UsersTitleSearch
          searchQuery={filters.searchQuery}
          setSearchQuery={(query) => updateFilters({ searchQuery: query })}
          handleFilterChange={handleFilterChange}
          refreshData={() => mutate()}
        />

        <UsersFilters
          filters={filters}
          setFilters={updateFilters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />

        <UsersTable
          users={data?.users || []}
          isLoading={isLoading}
          onViewUserDetails={handleViewUserDetails}
        />

        {data && data.pagination.totalPages > 1 && (
          <UsersPagination
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalCount={data.pagination.totalCount}
            totalPages={data.pagination.totalPages}
          />
        )}

        <UserDetailsDialog
          userId={selectedUser?.id}
          isOpen={isDetailsOpen}
          setIsOpen={setIsDetailsOpen}
          onUserUpdated={() => mutate()}
        />
      </div>
    </div>
  );
}
