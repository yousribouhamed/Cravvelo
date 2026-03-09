import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function TenantNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <div
          className="flex items-center justify-center w-20 h-20 rounded-full bg-muted text-muted-foreground"
          aria-hidden
        >
          <FileQuestion className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild variant="default" size="lg">
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
