import DisableReferralForm from "../../../../../modules/settings/components/forms/disable-referral-form";
import AnalyticsForm from "../../../../../modules/settings/components/forms/analytics-form";
import { getMyUserAction, getWebsiteByAccountId } from "@/src/actions/user.actions";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";

const Page = async ({}) => {
  const user = await getMyUserAction();
  const website = await getWebsiteByAccountId(user.accountId);

  if (!user?.subdomain) {
    return <CreateAcademiaSection />;
  }

  return (
    <div className="w-full h-fit flex flex-col my-8 gap-4">
      <DisableReferralForm enabled={website.enableReferral} />
      <AnalyticsForm
        googleAnalyticsId={website?.googleAnalyticsId ?? null}
        facebookPixelId={website?.facebookPixelId ?? null}
      />
    </div>
  );
};

export default Page;
