import { prisma } from "database/src";
import DisableReferralForm from "../../_compoents/forms/disable-referral-form";
import { getMyUserAction } from "@/src/actions/user.actions";

const Page = async ({}) => {
  const user = await getMyUserAction();

  const [website] = await Promise.all([
    prisma.website.findFirst({
      where: {
        accountId: user.accountId,
      },
    }),
  ]);

  return (
    <div className="w-full h-fit flex flex-col  my-8 gap-4">
      <DisableReferralForm enabled={website.enableReferral} />
    </div>
  );
};

export default Page;
