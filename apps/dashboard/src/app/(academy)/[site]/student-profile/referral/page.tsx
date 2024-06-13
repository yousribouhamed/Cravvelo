import React from "react";
import { getStudent } from "../../../_actions/auth";
import { getSubDomainValue } from "../../../lib";
import { getSiteData } from "../../../_actions";
import { notFound, redirect } from "next/navigation";
import MaxWidthWrapper from "../../../_components/max-width-wrapper";
import AcademyHeader from "../../../_components/layout/academy-header";
import AcademiaFooter from "../../../_components/layout/academy-footer";
import ReferralSubscribtionForm from "../../../_components/forms/referral-subscribe-form";
import { prisma } from "database/src";
import ReferralUnSubscribtionForm from "../../../_components/forms/referral-unsbscribe-form";

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

  const referrals = await prisma.referral.findMany({
    where: {
      accountId: website.accountId,
    },
  });

  const referral = referrals.find((item) => item.studentId === student.id);

  if (!website) {
    notFound();
  }

  if (!student) {
    redirect("/");
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
      <MaxWidthWrapper className="h-fit mt-[110px] min-h-[calc(100vh-110px)] ">
        <div className="w-full h-full flex flex-col items-center py-4">
          <div className="w-full h-[50px] flex items-center justify-start">
            <h1 className="text-xl font-bold">التسويق بالعمولة</h1>
          </div>
          {referral ? (
            <ReferralUnSubscribtionForm
              referralId={referral.id}
              referredPeople={referral.numberOfReferredStudents}
              color={website?.color}
              subdomain={website.subdomain}
            />
          ) : (
            <ReferralSubscribtionForm
              accountId={website.accountId}
              color={website?.color}
              studnet={student}
            />
          )}
        </div>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
