import { AcademySifnUpForm } from "../../../_components/forms/sign-up-form-production";
import { notFound, redirect } from "next/navigation";
import { getSiteData } from "../../../_actions";
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
    <div className="w-full min-h-[700px] h-fit   flex items-center justify-center mt-[70px]">
      <AcademySifnUpForm color={website?.color} accountId={website.accountId} />
    </div>
  );
};

export default Page;
