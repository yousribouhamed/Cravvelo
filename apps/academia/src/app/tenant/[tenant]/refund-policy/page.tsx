import { getTenantWebsite } from "@/actions/tanant";
import { CravveloEditor } from "@cravvelo/editor";
import { getTranslations } from "next-intl/server";

function normalizeRichText(value: unknown): string {
  if (value == null) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "string") return parsed.trim();
    } catch {
      // ignore
    }

    return trimmed.replace(/^"+|"+$/g, "").trim();
  }

  return "";
}

function isRichTextEmpty(html: string): boolean {
  const normalized = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return normalized.length === 0;
}

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function Page({ params }: PageProps) {
  const { tenant } = await params;
  const t = await getTranslations("legal");

  const website = await getTenantWebsite(`${tenant}.cravvelo.com`);
  const html = normalizeRichText((website as any)?.refund_policy);

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          {t("refundPolicy.title")}
        </h1>

        {isRichTextEmpty(html) ? (
          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden">
            <CravveloEditor readOnly value={html} />
          </div>
        )}
      </div>
    </div>
  );
}

