import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserLocale } from "@/services/locale";

export default async function PaymentSuccessPage() {
  const t = await getTranslations("payments.success");
  const locale = await getUserLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12 sm:py-16 text-center"
      dir={dir}
    >
      <div className="flex flex-col items-center gap-6 max-w-md w-full">
        <div
          className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          aria-hidden
        >
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t("message")}
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/">{t("backHome")}</Link>
          </Button>
          <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
            <Link href="/profile/payments">{t("viewPayments")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
