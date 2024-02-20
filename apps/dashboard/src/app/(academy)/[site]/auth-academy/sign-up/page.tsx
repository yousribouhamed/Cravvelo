import { AcademySifnUpForm } from "../../../_components/forms/sign-up-form-production";
import { notFound } from "next/navigation";
import { getSiteData } from "../../../_actions";

export const fetchCache = "force-no-store";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain_value =
    process.env.NODE_ENV === "development"
      ? "abdullah.jadir.vercel.app"
      : decodeURIComponent(params?.site);
  const website = await getSiteData({
    subdomain: subdomain_value,
  });

  if (!website) {
    notFound();
  }

  return (
    <div className="w-full min-h-[700px] h-fit   flex items-center justify-center mt-[70px]">
      <AcademySifnUpForm accountId={website.accountId} />
    </div>
  );
};

export default Page;
