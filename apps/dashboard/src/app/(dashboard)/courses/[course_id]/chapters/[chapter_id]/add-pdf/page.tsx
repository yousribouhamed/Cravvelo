import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import PathBuilder from "@/src/components/path-builder";
import AddPdfForm from "@/src/components/forms/course-forms/add-pdf-form";
import useHaveAccess from "@/src/hooks/use-have-access";

export default async function Home() {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header notifications={[]} goBack user={user} title="اظافة ملف" />

        <div className="w-full pt-8 min-h-[100px] ">
          <AddPdfForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
