import { AcademySifnUpForm } from "../../../_components/forms/sign-up-form-production";
import { notFound, redirect } from "next/navigation";
import { getSiteData } from "../../../_actions";
import { getStudent } from "../../../_actions/auth";
import AcademiaFooter from "../../../_components/layout/academy-footer";
import AcademyHeader from "../../../_components/layout/academy-header";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain_value =
    process.env.NODE_ENV === "development"
      ? "abdullah.cravvelo.com"
      : decodeURIComponent(params?.site);

  const [student, website] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain: subdomain_value,
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
      <div className="w-full min-h-[700px] h-fit   flex items-center justify-center mt-[70px]">
        <AcademySifnUpForm
          color={website?.color}
          accountId={website.accountId}
        />
      </div>
      <AcademiaFooter />
    </>
  );
};

export default Page;
