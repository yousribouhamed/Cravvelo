import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/layout/header";
import AddTextForm from "@/src/components/forms/course-forms/add-text-form";
import PathBuilder from "@/src/components/path-builder";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import useHaveAccess from "@/src/hooks/use-have-access";

export default async function Home() {
  const user = await useHaveAccess();

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
          <AddTextForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
