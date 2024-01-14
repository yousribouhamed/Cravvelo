import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@ui/components/ui/button";
import CourseHeader from "@/src/components/course-header";
import Chapter from "@/src/components/chapter";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  console.log(user);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header user={user} title="ui ux" />
        <CourseHeader />
        <div className="w-full min-h-[500px] grid grid-cols-3">
          <Chapter />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
