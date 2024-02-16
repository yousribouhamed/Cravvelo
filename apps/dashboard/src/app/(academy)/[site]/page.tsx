import CoursesReel from "../_components/courses-reel";
import { getAllCourses, getPage } from "../actions";
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

  const courses = await getAllCourses({ subdomain: subdomain_value });

  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-y-8 pt-12">
      <h1 className="text-4xl font-bold text-center ">
        مرحبا بكم في اكادمية شهري عبدالله
      </h1>
      <CoursesReel courses={courses} />;
    </main>
  );
};

export default Page;
