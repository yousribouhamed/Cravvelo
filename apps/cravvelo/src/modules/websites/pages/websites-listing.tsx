"use client";

import { DataTable } from "@/components/data-table";
import { WebsiteColumns } from "../columns/websites-columns";
import type { WebsiteListItem, WebsitesPagination } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getAllWebsitesPaginated } from "../actions";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { AdminPageShell } from "@/components/admin-page-shell";
import { downloadCSV } from "@/lib/export-csv";

export type WebsitesInitialData = {
  websites: WebsiteListItem[];
  pagination: WebsitesPagination;
};

interface Props {
  initialData: WebsitesInitialData;
}

export default function WebsitesListingPage({ initialData }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery<WebsitesInitialData>({
    queryKey: ["websites", page, search],
    queryFn: async () => {
      const res = await getAllWebsitesPaginated({
        page,
        limit: 10,
        search: search || undefined,
      });
      if (!res.success || !res.data) throw new Error(res.error ?? "Failed to load websites");
      return res.data;
    },
    initialData: page === 1 && !search ? initialData : undefined,
    placeholderData: page === 1 && !search ? initialData : undefined,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const websites = data?.websites ?? [];
  const pagination = data?.pagination;

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleExportCSV = useCallback(() => {
    const cols: { key: keyof WebsiteListItem; label: string }[] = [
      { key: "name", label: "Name" },
      { key: "subdomain", label: "Subdomain" },
      { key: "customDomain", label: "Custom domain" },
      { key: "ownerName", label: "Owner" },
      { key: "suspended", label: "Suspended" },
      { key: "createdAt", label: "Created" },
    ];
    downloadCSV(data?.websites ?? [], cols, "websites-export");
  }, [data?.websites]);

  if (error) {
    return (
      <AdminPageShell title="Websites">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error loading websites
            </h2>
            <p className="text-gray-600 mb-4">
              {error.message || "Failed to load websites. Please try again."}
            </p>
          </div>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="Websites"
      description="All creator websites on the platform."
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, subdomain, or owner..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-10 pl-10 pr-4 py-2 w-72 rounded-lg border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 focus:bg-white transition-colors"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950/30 h-10">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
              <div className="text-zinc-600">Loading websites...</div>
            </div>
          )}
          <DataTable columns={WebsiteColumns} data={websites} />
        </div>

        {pagination && pagination.totalCount > 0 && (
          <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} total)
            </p>
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 border-0"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 border-0"
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
    </AdminPageShell>
  );
}
