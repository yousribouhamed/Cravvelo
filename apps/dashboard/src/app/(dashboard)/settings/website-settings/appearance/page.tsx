import { prisma } from "database/src";
import ThemeCustomizationForm from "@/src/modules/settings/components/forms/theme-customization-form";
import { getMyUserAction } from "@/src/actions/user.actions";
import type { ThemeCustomization } from "database";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";
import { AppearancePageHeader } from "./appearance-page-header";

const Page = async () => {
  const user = await getMyUserAction();

  if (!user?.subdomain) {
    return <CreateAcademiaSection />;
  }

  const website = await prisma.website.findFirst({
    where: { accountId: user.accountId },
  });

  return (
    <div className="w-full h-fit my-8 space-y-4">
      <AppearancePageHeader />

      <ThemeCustomizationForm
        initialTheme={(website?.themeCustomization as ThemeCustomization) ?? undefined}
      />
    </div>
  );
};

export default Page;
