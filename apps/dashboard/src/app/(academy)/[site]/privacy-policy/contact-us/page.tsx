import { notFound } from "next/navigation";
import { getSiteData } from "../../../_actions";
import { getSubDomainValue } from "../../../lib";
import AcademyHeader from "../../../_components/layout/academy-header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getStudent } from "../../../_actions/auth";
import ContactUsAcademiaForm from "../../../_components/forms/academy-contactus";
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
      <MaxWidthWrapper className="h-fit mt-[70px] min-h-[calc(100vh-110px)] ">
        <div className="w-full h-fit min-h-[300px] mt-[40px] grid grid-cols-1 ">
          <div className=" w-full max-w-[800px] h-full col-span-1 flex items-center justify-start p-8 pt-[80px]">
            <ContactUsAcademiaForm color={website?.color} />
          </div>
        </div>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
