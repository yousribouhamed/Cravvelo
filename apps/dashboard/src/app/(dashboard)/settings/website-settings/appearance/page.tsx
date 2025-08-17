import AddColorFrom from "../../_compoents/forms/add-color-fomr";
import { prisma } from "database/src";
import AddLogoForm from "../../_compoents/forms/add-logo-form";
import AddFavIconForm from "../../_compoents/forms/add-favicon-form";
import AddSeoForm from "../../_compoents/forms/add-seo-form";
import WebsiteLayoutForm from "../../_compoents/forms/layout-form";
import UploadStampForm from "../../_compoents/forms/upload-stamp-form";
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
        primaryColor={website?.primaryColor}
        darkPrimaryColor={website?.primaryColorDark ?? ""}
      />
      <UploadStampForm stempUrl={website?.stamp} />
    </div>
  );
};

export default Page;
