import { notFound } from "next/navigation";
import { getAllCourses, getSiteData } from "../_actions";
import CoursesReel from "../_components/courses-reel";
import { getSubDomainValue } from "../lib";
import AcademyHeader from "../_components/layout/academy-header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getStudent } from "../_actions/auth";
import AcademiaFooter from "../_components/layout/academy-footer";
import Banner from "../_components/banner";
import Suspanded from "../_components/suspanded";
import Image from "next/image";

interface PageProps {
  params: Promise<{ site: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { site } = await params;

  console.log("this is the site");
  console.log({ site });
  const subdomain = getSubDomainValue({ value: site });

  const [student, website, courses] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
    getAllCourses({ subdomain }),
  ]);

  console.log("this is the data we are looking for");
  console.log(subdomain);
  console.log(website);

  if (!website) {
    notFound();
  }
  if (website.suspended) {
    return <Suspanded />;
  }

  return (
    <>
      <AcademyHeader
        referralEnabled={website.enableReferral}
        color={website?.primaryColor}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
        displaySalesBanner={website?.enableSalesBanner}
      />
      <MaxWidthWrapper
        className={` h-fit  min-h-[calc(100vh-70px)] ${
          website?.enableSalesBanner ? "mt-[110px]" : "mt-[70px]"
        }`}
      >
        <main className="w-full h-fit min-h-full flex flex-col items-center justify-center  p-4 sm:p-0s">
          <Banner websiteName={website?.name} color={website?.primaryColor} />
          {courses.length === 0 && website?.dCoursesHomeScreen ? (
            <div className="w-full h-fit min-h-[250px] flex items-center flex-col gap-y-1 justify-center">
              <Image
                src="/academia/welcome.svg"
                alt="this is the error page"
                width={400}
                height={400}
              />

              <p className="font-bold text-2xl text-black">
                اهلا بك في الأكاديمية لا توجد اي دورة حاليا 👋
              </p>
            </div>
          ) : (
            <CoursesReel
              inCenter={website?.itemsAlignment}
              color={website?.primaryColor}
              courses={courses}
            />
          )}
        </main>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
