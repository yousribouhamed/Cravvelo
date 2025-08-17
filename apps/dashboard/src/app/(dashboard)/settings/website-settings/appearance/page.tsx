import AddColorFrom from "../../../../../modules/settings/components/forms/add-color-fomr";
import { prisma } from "database/src";
import AddLogoForm from "../../../../../modules/settings/components/forms/add-logo-form";
import AddFavIconForm from "../../../../../modules/settings/components/forms/add-favicon-form";
import AddSeoForm from "../../../../../modules/settings/components/forms/add-seo-form";
import WebsiteLayoutForm from "../../../../../modules/settings/components/forms/layout-form";
import UploadStampForm from "../../../../../modules/settings/components/forms/upload-stamp-form";
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
        primaryColor={website?.primaryColor}
        darkPrimaryColor={website?.primaryColorDark ?? ""}
      />
      <UploadStampForm stempUrl={website?.stamp} />
    </div>
  );
};

export default Page;
