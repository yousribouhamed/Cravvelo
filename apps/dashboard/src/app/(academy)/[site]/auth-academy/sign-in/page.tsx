import { AcademySignInForm } from "../../../_components/forms/sign-in-form-production";
import { getSiteData } from "../../../_actions";
import { notFound, redirect } from "next/navigation";
import { getStudent } from "../../../_actions/auth";

export const fetchCache = "force-no-store";

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
    <div className="w-full min-h-[500px] h-fit flex items-center justify-center mt-[70px]">
      <AcademySignInForm accountId={website.accountId} />
    </div>
  );
};

export default Page;
