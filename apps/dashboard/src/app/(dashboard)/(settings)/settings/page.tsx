import SettingsSidebarView from "@/src/features/settings/sidebar-view";
import useHaveAccess from "@/src/hooks/use-have-access";

export default async function Page() {
  const user = await useHaveAccess();

  return (
    <div className="w-full h-fit p-4">
      <SettingsSidebarView
        user={{
          academia_url: user.customDomain ?? user?.subdomain ?? "not url",
          image: user?.avatar,
          name: user?.firstName,
        }}
        lang={user.lang}
        force_display
      />
    </div>
  );
}
