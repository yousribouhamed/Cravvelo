import { notFound } from "next/navigation";
import { getSiteData } from "../../_actions";
import { getSubDomainValue } from "../../lib";
import AcademyHeader from "../../_components/layout/academy-header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getStudent } from "../../_actions/auth";
import DisplayPolicy from "../../_components/course-component/display-policy";
import AcademiaFooter from "../../_components/layout/academy-footer";

interface PageProps {
  params: Promise<{ site: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { site } = await params;
  const subdomain = getSubDomainValue({ value: site });

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
        referralEnabled={website.enableReferral}
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
        displaySalesBanner={website?.enableSalesBanner}
      />
      <MaxWidthWrapper className="h-fit mt-[110px] min-h-[calc(100vh-110px)] ">
        <main className="w-full h-fit min-h-full flex flex-col items-center justify-center ">
          <DisplayPolicy // @ts-ignore
            value={JSON.parse(website?.privacy_policy as string)}
          />
        </main>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
