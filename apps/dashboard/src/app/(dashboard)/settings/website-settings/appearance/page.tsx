import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import WebsiteSettingsHeader from "../../_compoents/website-settings-header";
import AddColorFrom from "../../_compoents/forms/add-color-fomr";
import { prisma } from "database/src";
import AddLogoForm from "../../_compoents/forms/add-logo-form";
import AddFavIconForm from "../../_compoents/forms/add-favicon-form";
import AddSeoForm from "../../_compoents/forms/add-seo-form";

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
    getAllNotifications({ accountId: user.accountId }),
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
          title="إعدادات المظهر"
        />
        <WebsiteSettingsHeader />
        <div className="w-full h-fit grid grid-cols-2  my-8 gap-4">
          <AddColorFrom color={website.color} />
          <AddLogoForm logoUrl={website?.logo} />
          <AddFavIconForm logoUrl={"/"} />
          <AddSeoForm description={website.description} title={website.name} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
