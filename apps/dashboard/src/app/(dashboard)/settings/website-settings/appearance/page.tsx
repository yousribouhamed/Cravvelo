import AddColorFrom from "@/src/modules/settings/components/forms/add-color-fomr";
import { prisma } from "database/src";
import AddLogoForm from "@/src/modules/settings/components/forms/add-logo-form";
import AddFavIconForm from "@/src/modules/settings/components/forms/add-favicon-form";
import AddSeoForm from "@/src/modules/settings/components/forms/add-seo-form";
import WebsiteLayoutForm from "@/src/modules/settings/components/forms/layout-form";
import UploadStampForm from "@/src/modules/settings/components/forms/upload-stamp-form";
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
    <div className="w-full h-fit grid grid-cols-1 lg:grid-cols-2   my-8 gap-4">
      <AddLogoForm logoUrl={website?.logo} />
      <WebsiteLayoutForm
        dCoursesHomeScreen={website?.dCoursesHomeScreen}
        dDigitalProductsHomeScreen={website?.dDigitalProductsHomeScreen}
        enableSalesBanner={website?.enableSalesBanner}
        itemsAlignment={website?.itemsAlignment}
      />
      <AddFavIconForm logoUrl={website?.favicon} />
      <AddSeoForm description={website?.description} title={website?.name} />
      <AddColorFrom
        darkPrimaryColor={website.primaryColorDark}
        primaryColor={website?.primaryColor}
      />
      <UploadStampForm stempUrl={website?.stamp} />
    </div>
  );
};

export default Page;
