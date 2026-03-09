"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BrandButton from "@/components/brand-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  updateStudentSettings,
  getStudentSettings,
} from "../actions/settings.actions";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface SettingsData {
  preferredLanguage: string | null;
  timezone: string | null;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function SettingsForm() {
  const t = useTranslations("profile.settings");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formValues, setFormValues] = useState<SettingsData>({
    preferredLanguage: "ARABIC",
    timezone: "",
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getStudentSettings();
        if (res.data) {
          setFormValues({
            preferredLanguage: res.data.preferredLanguage || "ARABIC",
            timezone: res.data.timezone || "",
            emailNotifications: res.data.emailNotifications ?? true,
            smsNotifications: res.data.smsNotifications ?? false,
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (
    field: keyof SettingsData,
    value: string | boolean
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const result = await updateStudentSettings({
        preferredLanguage: formValues.preferredLanguage as
          | "ARABIC"
          | "ENGLISH"
          | "FRENCH",
        timezone: formValues.timezone || undefined,
        emailNotifications: formValues.emailNotifications,
        smsNotifications: formValues.smsNotifications,
      });

      if (result.success) {
        toast.success(t("saveSuccess"));
      } else {
        throw new Error(result.message || "Failed to update settings");
      }
    } catch (error) {
      console.error(t("saveError"), error);
      toast.error(t("saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">{t("loading")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Preferences Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("preferences")}</h3>

          {/* Preferred Language */}
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">{t("language")}</Label>
            <select
              id="preferredLanguage"
              value={formValues.preferredLanguage || "ARABIC"}
              onChange={(e) =>
                handleChange(
                  "preferredLanguage",
                  e.target.value as "ARABIC" | "ENGLISH" | "FRENCH"
                )
              }
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ARABIC">{t("languageArabic")}</option>
              <option value="ENGLISH">{t("languageEnglish")}</option>
              <option value="FRENCH">{t("languageFrench")}</option>
            </select>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone">{t("timezone")}</Label>
            <Input
              id="timezone"
              value={formValues.timezone || ""}
              onChange={(e) => handleChange("timezone", e.target.value)}
              placeholder={t("timezonePlaceholder")}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("notifications")}</h3>

          {/* Email Notifications */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailNotifications"
              checked={formValues.emailNotifications}
              onCheckedChange={(checked) =>
                handleChange("emailNotifications", checked === true)
              }
              disabled={isLoading}
            />
            <Label
              htmlFor="emailNotifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("emailNotifications")}
            </Label>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smsNotifications"
              checked={formValues.smsNotifications}
              onCheckedChange={(checked) =>
                handleChange("smsNotifications", checked === true)
              }
              disabled={isLoading}
            />
            <Label
              htmlFor="smsNotifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("smsNotifications")}
            </Label>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <BrandButton onClick={handleSave} disabled={isLoading}>
          {isLoading ? t("saving") : t("save")}
        </BrandButton>
      </CardFooter>
    </Card>
  );
}
