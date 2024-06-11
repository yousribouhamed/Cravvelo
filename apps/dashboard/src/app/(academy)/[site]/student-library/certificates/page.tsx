import React from "react";
import LibraryNavigation from "../../../_components/library-navigation";
import { getStudent } from "../../../_actions/auth";
import { StudentBag } from "@/src/types";
import AcademyHeader from "../../../_components/layout/academy-header";
import MaxWidthWrapper from "../../../_components/max-width-wrapper";
import { getSubDomainValue } from "../../../lib";
import { getSiteData } from "../../../_actions";
import AcademiaFooter from "../../../_components/layout/academy-footer";
import { notFound, redirect } from "next/navigation";
import { Progress } from "@ui/components/ui/progress";

import { BookMarked } from "lucide-react";
import Link from "next/link";
import { prisma } from "database/src";

interface PageProps {
  params: { site: string };
}

function calculateProgress(episode: number, videos: number): number {
  if (episode < 0 || videos < 1 || episode > videos) {
    throw new Error(
      "Invalid input: Current video or total videos cannot be less than 1, and current video cannot be greater than total videos."
    );
  }

  const progressPercentage = (episode / videos) * 100;
  return parseFloat(progressPercentage.toFixed(0));
}

const getStudentCertificates = async ({ studentId }: { studentId: string }) => {
  const certificates = await prisma.certificate.findMany({
    where: {
      studentId,
    },
  });

  return certificates;
};

const Page = async ({ params }: PageProps) => {
  const subdomain = getSubDomainValue({ value: params.site });

  const [student, website] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
  ]);

  const certificates = await getStudentCertificates({ studentId: student.id });
  if (!website) {
    notFound();
  }

  if (!student) {
    redirect("/");
  }

  const bag = JSON.parse(student.bag as string) as StudentBag;

  console.log(certificates);

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
      <MaxWidthWrapper className="mt-[110px]">
        <div className="w-full  flex flex-col items-center h-fit min-h-[calc(100vh-110px)]">
          <div className="w-full h-[100px] flex items-center justify-start">
            <h1 className="text-3xl font-bold"> المكتبة الرقمية</h1>
          </div>
          <LibraryNavigation />
          <div className="w-full h-full flex flex-wrap gap-6 my-8">
            {Array.isArray(certificates) && certificates?.length === 0 && (
              <div className="w-full h-[200px] flex items-center justify-center">
                <p className="text-xl font-bold"> حاليا لا تملك اي شهادة </p>
              </div>
            )}
            {certificates?.map((item, index) => {
              return (
                <Link
                  href={`/course-academy/999/course-player`}
                  key={"huu" + index}
                >
                  <div className="w-[200px] h-[150px] bg-pink-500 "></div>
                </Link>
              );
            })}
          </div>
        </div>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
