import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import HeaderLoading from "@/src/components/layout/header-loading";
import GeneralSettingsHeader from "@/src/modules/settings/components/general-settings-header";

export default function SettingsLoading() {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <HeaderLoading />
        <GeneralSettingsHeader />
      </main>
    </MaxWidthWrapper>
  );
}
