import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/illustration";

interface AcademiaUnavailableProps {
  reason: "no-subscription" | "suspended";
}

export async function AcademiaUnavailable({ reason }: AcademiaUnavailableProps) {
  const t = await getTranslations("academiaUnavailable");

  const descriptionKey =
    reason === "suspended"
      ? "description.suspended"
      : "description.noSubscription";

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <Illustration
          name="error"
          className="w-full max-w-[280px] h-auto"
          alt=""
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t(descriptionKey)}</p>
        </div>
        <Button asChild variant="default" size="lg">
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}

