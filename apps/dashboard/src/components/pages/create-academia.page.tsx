"use client";

import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";
import { UserData } from "@/src/types";
import { useTranslations } from "next-intl";

interface CreateAcademiaProps {
  user: UserData;
  notifications: any[];
}

export default function CreateAcademiaPage({
  notifications,
  user,
}: CreateAcademiaProps) {
  const t = useTranslations("pages");

  return (
    <MaxWidthWrapper>
      <main>
        <Header notifications={notifications} user={user} title={t("home")} />
        <CreateAcademiaSection />
      </main>
    </MaxWidthWrapper>
  );
}
