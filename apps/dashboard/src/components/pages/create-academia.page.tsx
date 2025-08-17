"use client";

import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";
import { UserData } from "@/src/types";

interface CreateAcademiaProps {
  user: UserData;
  notifications: any[];
}

export default function CreateAcademiaPage({
  notifications,
  user,
}: CreateAcademiaProps) {
  return (
    <MaxWidthWrapper>
      <main>
        <Header notifications={notifications} user={user} title="الرئيسية" />
        <CreateAcademiaSection />
      </main>
    </MaxWidthWrapper>
  );
}
