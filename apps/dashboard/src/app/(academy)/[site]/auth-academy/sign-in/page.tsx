import { AcademySignIpForm } from "../../../_components/forms/sign-in-form-production";
import { getSiteData } from "../../../actions";
import { notFound } from "next/navigation";

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
    <div className="w-full min-h-[700px] h-fit flex items-center justify-center mt-[70px]">
      <AcademySignIpForm accountId={website.accountId} />
    </div>
  );
};

export default Page;
