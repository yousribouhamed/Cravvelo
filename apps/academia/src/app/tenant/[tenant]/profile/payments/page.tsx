import { getStudentPayments } from "@/modules/profile/actions/payments.actions";
import { PaymentsTable } from "@/modules/profile/components/payments-table";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const res = await getStudentPayments();
  const t = await getTranslations("profile.payments");

  if (res.data && res.data.length > 0) {
    return (
      <div className="bg-card h-full rounded-2xl flex flex-col gap-y-4 p-4 border">
        <h2 className="font-bold text-xl">{t("title")}</h2>
        <PaymentsTable data={res.data} />
      </div>
    );
  }

  return (
    <div className="bg-card h-full rounded-2xl flex flex-col gap-y-4 p-4 border">
      <h2 className="font-bold text-xl">{t("title")}</h2>
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">{t("empty")}</p>
      </div>
    </div>
  );
}
