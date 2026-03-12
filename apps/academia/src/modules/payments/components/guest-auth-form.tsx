"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createUser } from "@/modules/auth/actions/user";
import { loginUser } from "@/modules/auth/actions/auth";

interface GuestAuthFormData {
  fullName: string;
  email: string;
  password: string;
}

const PASSWORD_POLICY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

function isExistingUserError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes("already exists");
}

function hasValidPassword(password: string) {
  return password.length >= 8 && PASSWORD_POLICY_REGEX.test(password);
}

export function GuestAuthForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("payments.guestAuth");
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [formData, setFormData] = useState<GuestAuthFormData>({
    fullName: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof GuestAuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const payload = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      remember: true,
    };

    if (!payload.full_name || !payload.email || !payload.password) {
      toast.error(t("toastMissingFields"));
      return;
    }

    if (!hasValidPassword(payload.password)) {
      toast.error(t("toastWeakPassword"));
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser(payload);
      toast.success(t("toastAccountCreated"));
      router.refresh();
      setIsSubmitting(false);
      return;
    } catch (error) {
      if (!isExistingUserError(error)) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : t("toastGenericError");
        toast.error(message);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await loginUser({
        email: payload.email,
        password: payload.password,
        remember: true,
      });
      toast.success(t("toastLoggedIn"));
      router.refresh();
    } catch {
      toast.error(t("toastInvalidCredentials"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-1" dir={dir}>
          <h4 className="text-lg font-semibold text-foreground">{t("title")}</h4>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" dir={dir}>
          <div className="space-y-2">
            <Label htmlFor="guest-full-name">{t("fullNameLabel")}</Label>
            <Input
              id="guest-full-name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder={t("fullNamePlaceholder")}
              autoComplete="name"
              className="bg-background min-h-11 md:min-h-0"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-email">{t("emailLabel")}</Label>
            <Input
              id="guest-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              className="bg-background min-h-11 md:min-h-0"
              dir="ltr"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-password">{t("passwordLabel")}</Label>
            <Input
              id="guest-password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder={t("passwordPlaceholder")}
              autoComplete="current-password"
              className="bg-background min-h-11 md:min-h-0"
              dir="ltr"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">{t("passwordHint")}</p>
          </div>

          <Button
            type="submit"
            className="w-full min-h-11 sm:h-10"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {t("submitButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
