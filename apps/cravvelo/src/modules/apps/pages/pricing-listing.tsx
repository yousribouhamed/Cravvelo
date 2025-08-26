"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Trash } from "lucide-react";
import {
  getAppPricing,
  removeAppPricing,
} from "../actions/app-pricing.actions";
import { pricingPlanType } from "../types/pricing";
import AddAppPricingSheet from "../components/add-pricing";
import { useConfirmation } from "@/hooks/use-confirmation";

interface PricingListingProps {
  appId: string;
  initialData: pricingPlanType[];
}

export default function PricingListing({
  appId,
  initialData,
}: PricingListingProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery<pricingPlanType[]>({
    queryKey: ["app-pricing", appId],
    queryFn: async () => {
      const data = await getAppPricing({ appId });
      return data.data?.data as unknown as pricingPlanType[];
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useConfirmation(
    async ({ pricingPlanId }: { pricingPlanId: string }) => {
      await removeAppPricing({ appId, pricingPlanId });
    },
    {
      onSuccess: () => {
        refetch();
      },
      confirmationConfig: {
        title: "Delete Pricing Plan",
        description: "Are you sure you want to delete this pricing plan?",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    }
  );

  const formatPrice = (price: number | null, currency: string) => {
    if (!price) return "Free";
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const formatRecurringDays = (days: number | null) => {
    if (!days) return "";
    if (days === 30) return "/month";
    if (days === 365) return "/year";
    if (days === 7) return "/week";
    return `/${days} days`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-fit min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-fit min-h-[400px]">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load pricing plans. Please try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-fit min-h-[400px] flex items-center justify-center">
        <div className="text-center flex flex-col gap-y-2">
          <p className="text-gray-500 text-xl mb-4">
            No pricing plans found for this app.
          </p>
          <p className="text-sm text-gray-400">
            Create your first pricing plan to get started.
          </p>
          <AddAppPricingSheet refetch={refetch} appId={appId} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit min-h-[400px]">
      <div className="w-full h-[70px] flex items-center justify-between">
        <h2>listing</h2>
        <AddAppPricingSheet refetch={refetch} appId={appId} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((appPlan) => {
          const isDefaultPlan = appPlan.isDefault;

          return (
            <Card
              key={appPlan.pricingPlanId}
              className={`relative transition-all duration-200 ${
                isDefaultPlan ? "border-green-200 bg-green-50" : ""
              }`}
            >
              <CardHeader className="pb-4 flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  {appPlan.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isDefaultPlan && (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Default
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      deleteMutation.mutateWithConfirmation({
                        pricingPlanId: appPlan.pricingPlanId,
                      })
                    }
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {formatPrice(appPlan.price, appPlan.currency)}
                    </span>
                    <span className="text-gray-500">
                      {formatRecurringDays(appPlan.recurringDays)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {appPlan.description}
                </p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(appPlan.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
