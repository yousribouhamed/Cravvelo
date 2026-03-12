import { getMyUserAction, getWebsiteByAccountId } from "@/src/actions/user.actions";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";
import SocialLinksForm from "@/src/modules/settings/components/forms/social-links-form";
import CurrencySettingsForm from "@/src/modules/settings/components/forms/currency-settings-form";
import WebsiteLayoutForm from "@/src/modules/settings/components/forms/layout-form";

const Page = async () => {
  const user = await getMyUserAction();
  const website = await getWebsiteByAccountId(user.accountId);

  if (!user?.subdomain) {
    return <CreateAcademiaSection />;
  }

  return (
    <div className="w-full h-fit grid grid-cols-1 lg:grid-cols-2 my-8 gap-4">
      <WebsiteLayoutForm
        dCoursesHomeScreen={website?.dCoursesHomeScreen ?? true}
        dDigitalProductsHomeScreen={website?.dDigitalProductsHomeScreen ?? false}
        enableSalesBanner={website?.enableSalesBanner ?? false}
        enableWelcomeBanner={website?.enableWelcomeBanner ?? true}
        itemsAlignment={website?.itemsAlignment ?? false}
      />
      <SocialLinksForm
        facebookUrl={website?.facebookUrl ?? null}
        twitterUrl={website?.twitterUrl ?? null}
        instagramUrl={website?.instagramUrl ?? null}
        linkedinUrl={website?.linkedinUrl ?? null}
        youtubeUrl={website?.youtubeUrl ?? null}
      />
      <CurrencySettingsForm
        currency={website?.currency ?? null}
        currencySymbol={website?.currencySymbol ?? null}
        language={website?.language ?? null}
        timezone={website?.timezone ?? null}
      />
    </div>
  );
};

export default Page;
