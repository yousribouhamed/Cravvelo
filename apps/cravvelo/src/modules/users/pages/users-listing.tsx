"use client";

import { DataTable } from "@/components/data-table";
import { UserColumns } from "../columns/users-columns";
import type { UserListItem, UsersPagination } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../actions/users.actions";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type UsersInitialData = {
  accounts: UserListItem[];
  pagination: UsersPagination;
};

interface Props {
  initialData: UsersInitialData;
}

export default function UsersListingPage({ initialData }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery<UsersInitialData>({
    queryKey: ["users", page, search],
    queryFn: async () => {
      const res = await getAllUsers({ page, limit: 10, search: search || undefined });
      if (!res.success || !res.data) throw new Error(res.error ?? "Failed to load users");
      return res.data;
    },
    initialData: page === 1 && !search ? initialData : undefined,
    placeholderData: page === 1 && !search ? initialData : undefined,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const accounts = data?.accounts ?? [];
  const pagination = data?.pagination;

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  if (error) {
    return (
      <div className="w-full h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error loading users
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || "Failed to load users. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-4">
      <div className="w-full flex flex-col items-start justify-start gap-4 mb-4">
        <h1 className="text-2xl">Users</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-950 bg-opacity-75 flex items-center justify-center z-10 rounded-md">
            <div className="text-gray-600 dark:text-gray-400">Loading users...</div>
          </div>
        )}
        <DataTable columns={UserColumns} data={accounts} />
      </div>

      {pagination && pagination.totalCount > 0 && (
        <div className="flex items-center justify-between gap-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} total)
          </p>
          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
