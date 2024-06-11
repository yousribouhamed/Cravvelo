import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";

import WebsiteSettingsHeader from "../../_compoents/website-settings-header";
import { prisma } from "database/src";
import DisableReferralForm from "../../_compoents/forms/disable-referral-form";

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

const Page = async ({}) => {
  const user = await useHaveAccess();

  const [notifications, website] = await Promise.all([
    getAllNotifications({
      accountId: user.accountId,
    }),

    prisma.website.findFirst({
      where: {
        accountId: user.accountId,
      },
    }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title="التسويق بالعمولة"
        />
        <WebsiteSettingsHeader />
        <div className="w-full h-fit flex flex-col my-8 gap-y-4">
          <DisableReferralForm enabled={website.enableReferral} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
