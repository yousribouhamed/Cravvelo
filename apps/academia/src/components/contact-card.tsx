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
      <Card className="overflow-hidden border-2 shadow-lg bg-card/95 backdrop-blur-sm">
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
      </Card>
    </section>
  );
}
