import { getMyUserAction, getWebsiteByAccountId } from "@/src/actions/user.actions";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";
import LayoutPageForm from "@/src/modules/settings/components/forms/layout-page-form";

const Page = async () => {
  const user = await getMyUserAction();
  const website = await getWebsiteByAccountId(user.accountId);

  if (!user?.subdomain) {
    return <CreateAcademiaSection />;
  }

  return (
    <div className="w-full h-fit my-8">
      <LayoutPageForm
        website={{
          enableWelcomeBanner: website?.enableWelcomeBanner ?? true,
          dCoursesHomeScreen: website?.dCoursesHomeScreen ?? true,
          dDigitalProductsHomeScreen: website?.dDigitalProductsHomeScreen ?? false,
          enableSalesBanner: website?.enableSalesBanner ?? false,
          itemsAlignment: website?.itemsAlignment ?? false,
          enableTestimonials: website?.enableTestimonials ?? true,
          enableContactForm: website?.enableContactForm ?? true,
          themeCustomization: website?.themeCustomization ?? undefined,
        }}
      />
    </div>
  );
};

export default Page;
