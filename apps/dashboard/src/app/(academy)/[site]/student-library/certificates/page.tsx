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
import Link from "next/link";
import { prisma } from "database/src";
import Image from "next/image";

interface PageProps {
  params: Promise<{ site: string }>;
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
  const { site } = await params;
  const subdomain = getSubDomainValue({ value: site });

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
      <MaxWidthWrapper className="mt-[110px]">
        <div className="w-full  flex flex-col items-center h-fit min-h-[calc(100vh-110px)]">
          <div className="w-full h-[100px] flex items-center justify-start">
            <h1 className="text-3xl font-bold"> المكتبة الرقمية</h1>
          </div>
          <LibraryNavigation />
          <div className="w-full h-full flex flex-wrap gap-6 my-8">
            {Array.isArray(certificates) && certificates?.length === 0 && (
              <div className="w-full h-[300px] flex flex-col gap-y-2 items-center justify-center">
                <Image
                  src="/academia/notfound-taken.svg"
                  alt="this is the error page"
                  width={200}
                  height={200}
                />

                <p className="text-xl font-bold">لا يوجد اي كورسات</p>
              </div>
            )}
            {certificates?.map((item, index) => {
              return (
                <Link href={item.fileUrl} key={"huu" + index} target="_blank">
                  <div className="w-[200px] h-[150px] hover:shadow-2xl cursor-pointer  bg-slate-950  ">
                    <p className="text-white text-md">{item.studentName}</p>
                  </div>
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
