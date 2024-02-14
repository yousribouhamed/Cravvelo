import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import ChangeSubDomainForm from "../_compoents/forms/change-subdomain-form";
import AddCusotmDomainForm from "../_compoents/forms/AddCusotmDomainForm";

const Page = async ({}) => {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="إعدادات الموقع" />

        <div className="w-full h-fit flex flex-col my-8 gap-y-4">
          <ChangeSubDomainForm subdomain={user.subdomain} />
          <AddCusotmDomainForm customDomain={user.cutomDomain} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
