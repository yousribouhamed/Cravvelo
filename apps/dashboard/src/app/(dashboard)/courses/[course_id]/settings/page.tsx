import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import CourseHeader from "@/src/components/course-header";
import { User } from "@clerk/nextjs/dist/types/server";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "database/src";
import ChaptersBoard from "@/src/components/chapters-board";
import { CourseSettingsForm } from "@/src/components/forms/course-forms/course-settings";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <MaxWidthWrapper className="h-fit">
      <main className="w-full flex flex-col h-fit justify-start">
        <Header user={{ user } as unknown as User} title="ui ux" />
        <CourseHeader />
        <CourseSettingsForm />
      </main>
    </MaxWidthWrapper>
  );
}
