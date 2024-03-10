import { AcademySignInForm } from "../../../_components/forms/sign-in-form-production";
import { getAllCourses, getSiteData } from "../../../_actions";
import { notFound, redirect } from "next/navigation";
import { getStudent } from "../../../_actions/auth";
import { getSubDomainValue } from "../../../lib";

export const fetchCache = "force-no-store";

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
    <div className="w-full min-h-[500px] h-fit flex items-center justify-center mt-[70px]">
      <AcademySignInForm accountId={website.accountId} />
    </div>
  );
};

export default Page;
