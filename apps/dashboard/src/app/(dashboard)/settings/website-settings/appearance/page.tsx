import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import WebsiteSettingsHeader from "../../_compoents/website-settings-header";
import AddColorFrom from "../../_compoents/forms/add-color-fomr";
import { prisma } from "database/src";
import AddLogoForm from "../../_compoents/forms/add-logo-form";
import AddFavIconForm from "../../_compoents/forms/add-favicon-form";
import AddSeoForm from "../../_compoents/forms/add-seo-form";
import WebsiteLayoutForm from "../../_compoents/forms/layout-form";
import UploadStampForm from "../../_compoents/forms/upload-stamp-form";

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
    getAllNotifications({ accountId: user?.accountId }),
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
        <div className="w-full h-fit grid grid-cols-1 lg:grid-cols-2   my-8 gap-4">
          <AddLogoForm logoUrl={website?.logo} />
          <WebsiteLayoutForm
            dCoursesHomeScreen={website?.dCoursesHomeScreen}
            dDigitalProductsHomeScreen={website?.dDigitalProductsHomeScreen}
            enableSalesBanner={website?.enableSalesBanner}
            itemsAlignment={website?.itemsAlignment}
          />
          <AddFavIconForm logoUrl={website?.favicon} />
          <AddSeoForm
            description={website?.description}
            title={website?.name}
          />
          <AddColorFrom color={website?.color} />
          <UploadStampForm stempUrl={website?.stamp} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
