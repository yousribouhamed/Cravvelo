import { prisma } from "database/src";
import DisableReferralForm from "../../../../../modules/settings/components/forms/disable-referral-form";
import { getMyUserAction } from "@/src/actions/user.actions";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";

const Page = async ({}) => {
  const user = await getMyUserAction();

  const [website] = await Promise.all([
    prisma.website.findFirst({
      where: {
        accountId: user.accountId,
      },
    }),
  ]);

  if (!user?.subdomain) {
    return <CreateAcademiaSection />;
  }

  return (
    <div className="w-full h-fit flex flex-col  my-8 gap-4">
      <DisableReferralForm enabled={website.enableReferral} />
    </div>
  );
};

export default Page;
