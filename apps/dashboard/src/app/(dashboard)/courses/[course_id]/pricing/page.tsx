import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import CourseHeader from "@/src/components/course-header";
import { User } from "@clerk/nextjs/dist/types/server";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import AddPricingForm from "@/src/components/forms/course-forms/add-pricing-form";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header user={{ user } as unknown as User} title="ui ux" />
        <CourseHeader />
        <AddPricingForm />
      </main>
    </MaxWidthWrapper>
  );
}
