import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import WebsiteSettingsHeader from "../../_compoents/website-settings-header";
import AddPrivicyPolicy from "../../_compoents/forms/add-privacy-policy";
import { prisma } from "database/src";

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
        <Header user={user} title="إعدادات القانوني" />
        <WebsiteSettingsHeader />
        <div className="w-full h-fit flex flex-col my-8 gap-y-4">
          <AddPrivicyPolicy policy={website?.privacy_policy} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
