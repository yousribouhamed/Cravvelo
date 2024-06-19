import { notFound } from "next/navigation";
import { getSiteData } from "../../../_actions";
import { getSubDomainValue } from "../../../lib";
import AcademyHeader from "../../../_components/layout/academy-header";
import MaxWidthWrapper from "../../../_components/max-width-wrapper";
import { getStudent } from "../../../_actions/auth";
import AcademiaFooter from "../../../_components/layout/academy-footer";

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

  return (
    <>
      <AcademyHeader
        referralEnabled={website.enableReferral}
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
      />
      <MaxWidthWrapper className="h-fit mt-[160px] min-h-[calc(100vh-110px)] ">
        <div className="w-full h-fit min-h-[300px] mt-[40px] grid grid-cols-1 ">
          <div className="w-full h-[100px] flex items-center justify-start">
            <h1 className="text-3xl  font-bold text-start text-black my-4">
              يمكنك التواصل مع مشرف الأكاديمية بكل حرية عبر الوسائل ادناه 😹
            </h1>
          </div>

          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <span className="text-xl font-bold">
              {" "}
              📪 mahdi.chahri55@gaml.com{" "}
            </span>
          </div>
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <span className="text-xl font-bold"> 🤳 0988877654 </span>
          </div>
        </div>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
