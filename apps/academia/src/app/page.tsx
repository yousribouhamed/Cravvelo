import { getTranslations } from "next-intl/server";

export default async function page() {
  const t = await getTranslations("common");
  
  return (
    <div>
      <h1>{t("mainDomain")}</h1>
    </div>
  );
}
