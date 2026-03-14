import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getMyReferral } from "@/modules/profile/actions/affiliates.actions";
import AffiliatesContent from "@/modules/profile/components/affiliates-content";
import { getTranslations } from "next-intl/server";

export default async function AffiliatesPage() {
  const result = await getMyReferral();
  const t = await getTranslations("profile.affiliates");

  if (!result.enableReferral) {
    redirect("/profile");
  }

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "";
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const baseUrl = host ? `${protocol}://${host}` : "";

  return (
    <div className="bg-card h-full rounded-2xl flex flex-col gap-y-4 p-4 border">
      <h2 className="font-bold text-xl">{t("title")}</h2>
      <AffiliatesContent
        referral={result.referral}
        baseUrl={baseUrl}
      />
    </div>
  );
}
