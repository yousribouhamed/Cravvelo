import { prisma } from "database/src";
import ThemeCustomizationForm from "@/src/modules/settings/components/forms/theme-customization-form";
import { getMyUserAction } from "@/src/actions/user.actions";
import type { ThemeCustomization } from "database";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";

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
      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-base font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize theme, colors, and layout. Changes here control how your academy looks for visitors.
        </p>
      </div>

      <ThemeCustomizationForm
        initialTheme={(website?.themeCustomization as ThemeCustomization) ?? undefined}
      />
    </div>
  );
};

export default Page;
