import React from "react";
import ProfileForm from "../../../_components/forms/profile-form";
import { getStudent } from "../../../_actions/auth";
import { getSubDomainValue } from "../../../lib";
import { getSiteData } from "../../../_actions";
import { notFound, redirect } from "next/navigation";
import MaxWidthWrapper from "../../../_components/max-width-wrapper";
import AcademyHeader from "../../../_components/layout/academy-header";
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

  if (!student) {
    redirect("/");
  }

  return (
    <>
      <AcademyHeader
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
      />
      <MaxWidthWrapper className="h-fit mt-[110px] min-h-[calc(100vh-110px)] ">
        <div className="w-full h-full flex flex-col items-center py-4">
          <div className="w-full h-[50px] flex items-center justify-start">
            <h1 className="text-xl font-bold">الملف الشخصي</h1>
          </div>
          <ProfileForm color={website?.color} studnet={student} />
        </div>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
