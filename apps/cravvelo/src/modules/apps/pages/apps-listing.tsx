"use client";

import { DataTable } from "@/components/data-table";
import { AppColumns } from "../columns";
import { AppType } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getAllApps } from "../actions/apps.actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusSquare, Search } from "lucide-react";
import { AdminPageShell } from "@/components/admin-page-shell";

interface Props {
  data: AppType[];
}

export default function AppsListingPage({ data }: Props) {
  const [search, setSearch] = useState("");

  const {
    data: apps,
    isLoading,
    error,
  } = useQuery<AppType[]>({
    queryKey: ["apps", search],
    queryFn: async () => {
      const res = await getAllApps({
        search: search,
      });
      return res.data?.apps ?? [];
    },
    initialData: data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  if (error) {
    return (
      <AdminPageShell title="Applications">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error Loading Applications
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {error.message || "Failed to load applications"}
            </p>
            <Link href="/applications/create">
              <Button>create app</Button>
            </Link>
          </div>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell title="Applications" description="Manage apps available in the store.">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-10 pl-10 pr-4 py-2 w-72 rounded-lg border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 focus:bg-white dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-500 dark:focus:border-zinc-500 dark:focus:bg-zinc-800 transition-colors"
            />
          </div>
          <Link href="/applications/create">
            <Button className="cursor-pointer h-10">
              <PlusSquare className="h-4 w-4 mr-2" />
              create app
            </Button>
          </Link>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex items-center justify-center z-10 rounded-lg">
              <div className="text-zinc-600 dark:text-zinc-400">Loading applications...</div>
            </div>
          )}
          <DataTable columns={AppColumns} data={apps || []} />
        </div>
      </div>
    </AdminPageShell>
  );
}
