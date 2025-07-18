import { AcademySignInForm } from "../../../_components/forms/sign-in-form-production";
import { getAllCourses, getSiteData } from "../../../_actions";
import { notFound, redirect } from "next/navigation";
import { getStudent } from "../../../_actions/auth";
import { getSubDomainValue } from "../../../lib";
import AcademiaFooter from "../../../_components/layout/academy-footer";
import AcademyHeader from "../../../_components/layout/academy-header";

interface PageProps {
  params: Promise<{ site: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { site } = await params;
  const subdomain = getSubDomainValue({ value: site });

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
        referralEnabled={false}
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
        displaySalesBanner={website?.enableSalesBanner}
      />
      <div className="w-full h-screen mt-[110px]  flex items-center justify-center p-4 ">
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
