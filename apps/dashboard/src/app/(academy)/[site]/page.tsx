import { notFound } from "next/navigation";
import { getAllCourses, getSiteData } from "../_actions";
import CoursesReel from "../_components/courses-reel";
import { getSubDomainValue } from "../lib";
import AcademyHeader from "../_components/layout/academy-header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import getBase64 from "@/src/lib/getLocalBase64";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain = getSubDomainValue({ value: params.site });

  const [website, courses] = await Promise.all([
    getSiteData({
      subdomain,
    }),
    getAllCourses({ subdomain }),
  ]);

  if (!website) {
    notFound();
  }

  const blurData = await Promise.all(
    courses.map(async (item) => await getBase64(item?.thumnailUrl))
  );

  return (
    <>
      <AcademyHeader
        student={null}
        isAuthanticated={false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
      />
      <MaxWidthWrapper className="h-fit mt-[70px] min-h-[calc(100vh-70px)] ">
        <main className="w-full h-fit min-h-full flex flex-col items-center justify-center ">
          <div className="w-full h-[250px] bg-primary flex items-center justify-center my-10">
            <h1 className="text-5xl font-bold text-center text-white ">
              مرحبا بكم في اكادمية {website?.name}
            </h1>
          </div>
          <CoursesReel blurData={blurData} courses={courses} />
        </main>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
