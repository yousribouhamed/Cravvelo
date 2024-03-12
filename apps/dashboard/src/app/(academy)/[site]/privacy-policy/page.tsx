import { notFound } from "next/navigation";
import { getAllCourses, getSiteData } from "../../_actions";
import { getSubDomainValue } from "../../lib";
import AcademyHeader from "../../_components/layout/academy-header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getStudent } from "../../_actions/auth";
import DisplayPolicy from "../../_components/course-component/display-policy";

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

  // const blurData = await Promise.all(
  //   courses.map(async (item) => await getBase64(item?.thumnailUrl))
  // );

  return (
    <>
      <AcademyHeader
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
      />
      <MaxWidthWrapper className="h-fit mt-[70px] min-h-[calc(100vh-70px)] ">
        <main className="w-full h-fit min-h-full flex flex-col items-center justify-center ">
          <DisplayPolicy // @ts-ignore
            value={JSON.parse(website?.privacy_policy as string)}
          />
        </main>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
