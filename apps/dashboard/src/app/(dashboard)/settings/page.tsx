import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";

const Page = async ({}) => {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header notifications={[]} user={user} title="الاعدادات العامة" />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
