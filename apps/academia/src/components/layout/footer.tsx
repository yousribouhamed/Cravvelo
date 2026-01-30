import Link from "next/link";
import { getTranslations } from "next-intl/server";

type LegalContent = {
  privacyPolicy?: unknown;
  termsOfService?: unknown;
  refundPolicy?: unknown;
};

function normalizeRichText(value: unknown): string {
  if (value == null) return "";

  // Prisma `Json?` fields sometimes come back as a stringified JSON string.
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "string") return parsed.trim();
    } catch {
      // ignore
    }

    // Fallback: remove wrapping quotes if they exist.
    return trimmed.replace(/^"+|"+$/g, "").trim();
  }

  // If the DB actually stores JSON, we only support string content for now.
  // (The editor saves HTML strings; dashboard currently JSON.stringifies them.)
  return "";
}

function isRichTextEmpty(html: string): boolean {
  const normalized = html
    .replace(/<[^>]*>/g, " ") // strip tags
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized.length === 0;
}

export default async function Footer({
  legal,
  brandName,
}: {
  legal: LegalContent;
  brandName?: string | null;
}) {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();
  const safeBrandName = brandName?.trim() || t("defaultBrandName");

  const privacy = normalizeRichText(legal.privacyPolicy);
  const terms = normalizeRichText(legal.termsOfService);
  const refund = normalizeRichText(legal.refundPolicy);

  const showPrivacy = !isRichTextEmpty(privacy);
  const showTerms = !isRichTextEmpty(terms);
  const showRefund = !isRichTextEmpty(refund);

  return (
    <footer className="w-full border-t border-border mt-10 py-6 text-sm text-muted-foreground">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="text-center">
          {t("rightsReserved", { year, name: safeBrandName })}
        </div>

        {(showPrivacy || showTerms || showRefund) && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {showPrivacy && (
              <Link
                href="/privacy-policy"
                className="hover:text-foreground transition-colors"
              >
                {t("privacyPolicy")}
              </Link>
            )}
            {showTerms && (
              <Link
                href="/terms-of-service"
                className="hover:text-foreground transition-colors"
              >
                {t("termsOfService")}
              </Link>
            )}
            {showRefund && (
              <Link
                href="/refund-policy"
                className="hover:text-foreground transition-colors"
              >
                {t("refundPolicy")}
              </Link>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}

