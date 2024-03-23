import { AcademySignInForm } from "../../../_components/forms/sign-in-form-production";
import { getAllCourses, getSiteData } from "../../../_actions";
import { notFound, redirect } from "next/navigation";
import { getStudent } from "../../../_actions/auth";
import { getSubDomainValue } from "../../../lib";
import AcademiaFooter from "../../../_components/layout/academy-footer";
import AcademyHeader from "../../../_components/layout/academy-header";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain = getSubDomainValue({ value: params.site });

  const [student, website] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
  ]);

  if (!website) {
    notFound();
  }

  if (student) {
    redirect("/");
  }

  return (
    <>
      <AcademyHeader
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
      />
      <div className="w-full min-h-[500px] h-fit flex items-center justify-center mt-[70px]">
        <AcademySignInForm
          color={website?.color}
          accountId={website.accountId}
        />
      </div>
      <AcademiaFooter />
    </>
  );
};

export default Page;
