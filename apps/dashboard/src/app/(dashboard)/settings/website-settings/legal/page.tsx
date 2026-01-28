import AddPrivicyPolicy from "../../../../../modules/settings/components/forms/add-privacy-policy";
import TermsOfServiceForm from "../../../../../modules/settings/components/forms/terms-of-service-form";
import RefundPolicyForm from "../../../../../modules/settings/components/forms/refund-policy-form";
import { getMyUserAction, getWebsiteByAccountId } from "@/src/actions/user.actions";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";

const Page = async ({}) => {
  const user = await getMyUserAction();
  const website = await getWebsiteByAccountId(user.accountId);

  if (!user?.subdomain) {
    return <CreateAcademiaSection />;
  }

  return (
    <div className="w-full h-fit flex flex-col my-8 gap-y-4">
      <AddPrivicyPolicy policy={website?.privacy_policy} />
      <TermsOfServiceForm termsOfService={website?.terms_of_service} />
      <RefundPolicyForm refundPolicy={website?.refund_policy} />
    </div>
  );
};

export default Page;
