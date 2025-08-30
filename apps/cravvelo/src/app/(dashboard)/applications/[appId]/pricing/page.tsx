import Header from "@/components/header";
import { getAppPricing } from "@/modules/apps/actions/app-pricing.actions";
import PricingListing from "@/modules/apps/pages/pricing-listing";
import type { pricingPlanType } from "@/modules/apps/types/pricing";

export default async function AppPricingPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const pricings = await getAppPricing({ appId });

  console.log("this is the app pricngs");
  console.log(pricings.data?.data);

  const pricingOptions = pricings.data?.data as unknown as pricingPlanType[];

  return (
    <div>
      <Header
        backTo="/applications"
        title="Update App"
        navigations={[
          {
            href: `/applications/${appId}`,
            label: "general",
          },
          {
            href: `/applications/${appId}/pricing`,
            label: "pricing",
          },
        ]}
      />
      <div className="p-4 ">
        <PricingListing appId={appId} initialData={pricingOptions ?? []} />
      </div>
    </div>
  );
}
