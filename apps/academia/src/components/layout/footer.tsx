import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

type LegalContent = {
  privacyPolicy?: unknown;
  termsOfService?: unknown;
  refundPolicy?: unknown;
};

export type FooterSocialLinks = {
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
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

function isSocialUrlSet(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim().length > 0;
}

export default async function Footer({
  legal,
  brandName,
  social,
}: {
  legal: LegalContent;
  brandName?: string | null;
  social?: FooterSocialLinks;
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

  const hasSocial =
    social &&
    (isSocialUrlSet(social.facebookUrl) ||
      isSocialUrlSet(social.twitterUrl) ||
      isSocialUrlSet(social.instagramUrl) ||
      isSocialUrlSet(social.linkedinUrl) ||
      isSocialUrlSet(social.youtubeUrl));

  const iconClass = "h-5 w-5 shrink-0";

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

        {hasSocial && (
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              {t("followUs")}
            </span>
            <div className="flex items-center justify-center gap-4" role="list">
            {isSocialUrlSet(social?.facebookUrl) && (
              <Link
                href={social!.facebookUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className={iconClass} />
              </Link>
            )}
            {isSocialUrlSet(social?.twitterUrl) && (
              <Link
                href={social!.twitterUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className={iconClass} />
              </Link>
            )}
            {isSocialUrlSet(social?.instagramUrl) && (
              <Link
                href={social!.instagramUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className={iconClass} />
              </Link>
            )}
            {isSocialUrlSet(social?.linkedinUrl) && (
              <Link
                href={social!.linkedinUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className={iconClass} />
              </Link>
            )}
            {isSocialUrlSet(social?.youtubeUrl) && (
              <Link
                href={social!.youtubeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className={iconClass} />
              </Link>
            )}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

