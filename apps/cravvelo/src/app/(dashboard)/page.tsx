//@ts-nocheck

import { Button } from "@/components/ui/button";
import { getCurrentAdmin } from "@/modules/auth/actions/auth.action";
import { getAllWebsites } from "@/modules/websites/actions";
import WebsiteCard from "@/modules/websites/components/website-card";
import { redirect } from "next/navigation";
import { Search, Filter, SortAsc, Globe } from "lucide-react";

export default async function Home() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/sign-in");
  }

  const websitesResponse = await getAllWebsites();

  const websites = websitesResponse.success ? websitesResponse.data : [];

  return (
    <div className="w-full h-full flex flex-col p-6 bg-card rounded-2xl">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            All Websites
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Manage and monitor your website portfolio
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search websites..."
              className="pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none w-64"
            />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>

          {/* Sort Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <SortAsc className="w-4 h-4" />
            Sort by
          </Button>
        </div>
      </div>

      {/* Website Cards Grid */}
      <div className="w-full flex-1 overflow-auto">
        {websites?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Globe className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              No websites found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              There are no websites to display at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {websites?.data?.map((website) => (
              <WebsiteCard
                key={website.id}
                name={website.name}
                logo={website.logo}
                description={website.description}
                revenue={website.totalVisits}
                rating={website.rating}
                chartData={website.chartData}
                suspended={website.suspended}
                subdomain={website.subdomain}
                customDomain={website.customDomain}
                accountName={website.accountName}
                accountVerified={website.accountVerified}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
