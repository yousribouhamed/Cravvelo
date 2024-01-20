import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import { User } from "@clerk/nextjs/dist/types/server";
import AddTextForm from "@/src/components/forms/course-forms/add-text-form";
import PathBuilder from "@/src/components/path-builder";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import AddVoiceForm from "@/src/components/forms/course-forms/add-voice-form";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header goBack user={user} title="ui ux" />

        <div className="w-full pt-8 min-h-[100px] ">
          <PathBuilder
            links={[
              {
                name: "الرئيسية",
                url: "/",
              },

              {
                name: "الدورات التدريبية",
                url: "/courses",
              },
              {
                name: "ui ux",
                url: "/courses/iihh",
              },
            ]}
          />
          <AddVoiceForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
