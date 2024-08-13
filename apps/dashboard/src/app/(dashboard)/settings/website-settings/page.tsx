import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import ChangeSubDomainForm from "../_compoents/forms/change-subdomain-form";
import AddCusotmDomainForm from "../_compoents/forms/AddCusotmDomainForm";
import WebsiteSettingsHeader from "../_compoents/website-settings-header";
import { prisma } from "database/src";

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

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title="إعدادات الموقع"
        />
        <WebsiteSettingsHeader />
        <div className="w-full h-fit grid grid-cols-2  my-8 gap-4">
          <ChangeSubDomainForm subdomain={user?.subdomain} />
          <AddCusotmDomainForm customDomain={user?.customDomain} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
