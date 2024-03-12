import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import WebsiteSettingsHeader from "../../_compoents/website-settings-header";
import AddColorFrom from "../../_compoents/forms/add-color-fomr";
import { prisma } from "database/src";
import AddLogoForm from "../../_compoents/forms/add-logo-form";
import AddFavIconForm from "../../_compoents/forms/add-favicon-form";
import AddSeoForm from "../../_compoents/forms/add-seo-form";

const Page = async ({}) => {
  const user = await useHaveAccess();

  const website = await prisma.website.findFirst({
    where: {
      accountId: user.accountId,
    },
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="إعدادات المظهر" />
        <WebsiteSettingsHeader />
        <div className="w-full h-fit flex flex-col my-8 gap-y-4">
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
