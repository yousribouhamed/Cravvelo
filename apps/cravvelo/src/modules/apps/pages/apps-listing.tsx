"use client";

import { DataTable } from "@/components/data-table";
import { AppColumns } from "../columns";
import { AppType } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getAllApps } from "../actions/apps.actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  data: AppType[];
}

export default function AppsListingPage({ data }: Props) {
  const [search, setSearch] = useState("");

  const {
    data: apps,
    isLoading,
    error,
    refetch,
  } = useQuery<AppType[]>({
    queryKey: ["apps", search],
    queryFn: async () => {
      const res = await getAllApps({
        search: search,
      });

      return res.data?.apps ?? [];
    },

    initialData: data,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Optional: prevent refetch on window focus
  });

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  if (error) {
    return (
      <div className="w-full h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Applications
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || "Failed to load applications"}
          </p>
          <Link href={"/applications/create"}>
            <Button>create app</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-4">
      <div className="w-full h-[100px] flex flex-col items-start justify-start gap-4">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold">Applications</h1>
          <Link href={"/applications/create"}>
            <Button>create app</Button>
          </Link>
        </div>
      </div>

      <div className="mb-4">
        {/* Search and Filter Controls */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-gray-600">Loading applications...</div>
          </div>
        )}
        <DataTable columns={AppColumns} data={apps || []} />
      </div>
    </div>
  );
}
