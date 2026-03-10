//@ts-nocheck

import { getCurrentAdmin } from "@/modules/auth/actions/auth.action";
import { getAllWebsites, getWebsiteAnalyticsSummary } from "@/modules/websites/actions";
import { getAccountCount } from "@/modules/users/actions/users.actions";
import WebsiteCard from "@/modules/websites/components/website-card";
import { redirect } from "next/navigation";
import { Globe, Users, Building2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/sign-in");
  }

  const [websitesResponse, analyticsResponse, usersCountResponse] = await Promise.all([
    getAllWebsites(),
    getWebsiteAnalyticsSummary(),
    getAccountCount(),
  ]);

  const websites = websitesResponse.success ? websitesResponse.data : [];
  const recentWebsites = Array.isArray(websites) ? websites.slice(0, 8) : [];
  const analytics = analyticsResponse.success ? analyticsResponse.data : null;
  const totalUsers = usersCountResponse.success ? usersCountResponse.data?.count ?? 0 : 0;

  return (
    <AdminPageShell
      title="Dashboard"
      description="Overview and recent websites. Use the table view for search and pagination."
    >
      <div className="w-full flex flex-col gap-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-zinc-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-zinc-100 p-2">
                  <Users className="h-5 w-5 text-zinc-700" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Total users</p>
                  <p className="text-2xl font-semibold text-zinc-900">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-zinc-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-zinc-100 p-2">
                  <Building2 className="h-5 w-5 text-zinc-700" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Total websites</p>
                  <p className="text-2xl font-semibold text-zinc-900">{analytics?.totalWebsites ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-zinc-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Active websites</p>
                  <p className="text-2xl font-semibold text-zinc-900">{analytics?.activeWebsites ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-zinc-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Suspended</p>
                  <p className="text-2xl font-semibold text-zinc-900">{analytics?.suspendedWebsites ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-900">Recent websites</h2>
          <Button variant="outline" asChild className="border-zinc-300 text-zinc-700 hover:bg-zinc-50">
            <Link href="/websites">View all websites</Link>
          </Button>
        </div>

        {recentWebsites?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50">
            <Globe className="w-16 h-16 text-zinc-400 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              No websites yet
            </h3>
            <p className="text-zinc-500 mb-4">
              There are no websites to display at the moment.
            </p>
            <Button asChild>
              <Link href="/websites">Go to Websites</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentWebsites.map((website) => (
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
    </AdminPageShell>
  );
}
