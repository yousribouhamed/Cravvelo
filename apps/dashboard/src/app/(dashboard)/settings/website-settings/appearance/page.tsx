import AddColorFrom from "@/src/modules/settings/components/forms/add-color-fomr";
import { prisma } from "database/src";
import AddSeoForm from "@/src/modules/settings/components/forms/add-seo-form";
import WebsiteLayoutForm from "@/src/modules/settings/components/forms/layout-form";
import ThemeCustomizationForm from "@/src/modules/settings/components/forms/theme-customization-form";
import { getMyUserAction } from "@/src/actions/user.actions";
import type { ThemeCustomization } from "database";

const Page = async () => {
  const user = await getMyUserAction();

  const website = await prisma.website.findFirst({
    where: { accountId: user.accountId },
  });

  return (
    <div className="w-full h-fit my-8 space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-base font-semibold">Appearance studio</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update branding, layout, and theme in one place. Changes here control how your academy looks for visitors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <WebsiteLayoutForm
        dCoursesHomeScreen={website?.dCoursesHomeScreen ?? true}
        dDigitalProductsHomeScreen={website?.dDigitalProductsHomeScreen ?? false}
        enableSalesBanner={website?.enableSalesBanner ?? false}
        itemsAlignment={website?.itemsAlignment ?? false}
      />
      <AddSeoForm description={website?.description ?? null} title={website?.name ?? null} />
      <AddColorFrom
        darkPrimaryColor={website?.primaryColorDark ?? null}
        primaryColor={website?.primaryColor ?? null}
      />
      <div className="lg:col-span-2">
        <ThemeCustomizationForm
          initialTheme={(website?.themeCustomization as ThemeCustomization) ?? undefined}
        />
      </div>
      </div>
    </div>
  );
};

export default Page;
