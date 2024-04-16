import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import PathBuilder from "@/src/components/path-builder";
import AddVedioForm from "@/src/components/forms/course-forms/add-vedio-form";
import useHaveAccess from "@/src/hooks/use-have-access";

export default async function Home() {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header notifications={[]}  goBack user={user} title="اضافة فيديو" />
        <div className="w-full pt-8 min-h-[100px] h-fit mb-10 ">
          <AddVedioForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
