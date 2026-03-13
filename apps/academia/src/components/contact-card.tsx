"use client";

import { useTenantBranding, useTenantSettings } from "@/hooks/use-tenant";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

function ContactIllustration() {
  return (
    <div
      className="flex items-center justify-center p-6 md:p-8 lg:p-10 bg-primary/5 border-e border-b md:border-b-0 md:border-e border-border/50"
      aria-hidden
    >
      <svg
        viewBox="0 0 200 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[180px] h-auto text-primary/40"
      >
        {/* Envelope */}
        <rect
          x="25"
          y="35"
          width="150"
          height="95"
          rx="6"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M25 42l75 52 75-52"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Message / contact lines */}
        <path
          d="M55 75h90M55 88h60M55 101h45"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

export function ContactCard() {
  const { name } = useTenantBranding();
  const { supportEmail, phoneNumber, address } = useTenantSettings();
  const t = useTranslations("home.sections");

  const hasContact = supportEmail || phoneNumber || address;

  return (
    <section className="mt-12">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{t("contactForm")}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t("contactFormSubtitle")}</p>
      </div>
      <Card className="overflow-hidden border-2 shadow-lg bg-card/95 backdrop-blur-sm flex flex-col md:flex-row">
        <ContactIllustration />
        <div className="flex-1 min-w-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{name || "Academy"}</CardTitle>
          <CardDescription>{t("contactFormSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasContact ? (
            <p className="text-muted-foreground text-sm">{t("noContactConfigured")}</p>
          ) : (
            <>
              {supportEmail && (
                <a
                  href={`mailto:${supportEmail}`}
                  className="flex items-center gap-3 rounded-lg border bg-background/50 p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">{t("contactEmail")}</p>
                    <p className="truncate font-medium text-foreground">{supportEmail}</p>
                  </div>
                </a>
              )}
              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 rounded-lg border bg-background/50 p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">{t("contactPhone")}</p>
                    <p className="truncate font-medium text-foreground">{phoneNumber}</p>
                  </div>
                </a>
              )}
              {address && (
                <div className="flex items-center gap-3 rounded-lg border bg-background/50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">{t("contactAddress")}</p>
                    <p className="text-sm font-medium text-foreground whitespace-pre-wrap">{address}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        </div>
      </Card>
    </section>
  );
}
