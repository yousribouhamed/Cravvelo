import AppearanceView from "@/src/features/settings/appearance/appearance-view";
import useHaveAccess from "@/src/hooks/use-have-access";

export default async function Page({}) {
  const user = await useHaveAccess();

  return <AppearanceView defaultLang={user.lang as "en" | "ar"} />;
}
