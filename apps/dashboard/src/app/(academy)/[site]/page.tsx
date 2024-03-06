import { notFound } from "next/navigation";
import { getAllCourses, getSiteData } from "../_actions";
import CoursesReel from "../_components/courses-reel";

export const fetchCache = "force-no-store";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain_value =
    process.env.NODE_ENV === "development"
      ? "abdullah.cravvelo-dashboard.vercel.app"
      : decodeURIComponent(params?.site);

  const courses = await getAllCourses({ subdomain: subdomain_value });

  const website = await getSiteData({
    subdomain: subdomain_value,
  });

  if (!website) {
    notFound();
  }

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-y-8 pt-20">
      <h1 className="text-5xl font-bold text-center ">
        مرحبا بكم في اكادمية {website?.name}
      </h1>
      <CoursesReel courses={courses} />
    </main>
  );
};

export default Page;
