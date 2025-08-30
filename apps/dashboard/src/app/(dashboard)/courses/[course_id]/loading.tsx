import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import LoadingForm from "@/src/components/forms/form-loading";
import useHaveAccess from "@/src/hooks/use-have-access";

export default async function Home() {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header notifications={[]} goBack user={user} title="جاري التحميل" />

        <div className="w-full pt-8 min-h-[100px] ">
          <LoadingForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
