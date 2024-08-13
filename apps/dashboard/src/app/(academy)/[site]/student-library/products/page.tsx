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
import DonwloadButton from "./donwload-button";
import { ArrowBigDownDash } from "lucide-react";
import Image from "next/image";

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
      />
      <MaxWidthWrapper className="mt-[110px]">
        <div className="w-full  flex flex-col items-center h-fit min-h-[calc(100vh-110px)]">
          <div className="w-full h-[100px] flex items-center justify-start">
            <h1 className="text-3xl font-bold"> المكتبة الرقمية</h1>
          </div>
          <LibraryNavigation />
          <div className="w-full h-full flex flex-wrap gap-6 my-8">
            {Array.isArray(bag?.products) && bag?.products?.length === 0 && (
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
            {bag?.products?.map((item, index) => {
              return (
                <div key={item.title + index}>
                  <div className="w-[320px] min-h-[300px] h-fit p-0  border  flex flex-col shadow rounded-xl hover:shadow-xl  transition-all duration-700 bg-white cursor-pointer ">
                    <img
                      alt={item.title + "image"}
                      src={item.thumbnailUrl}
                      className="w-full h-[200px] rounded-t-xl object-cover "
                    />
                    <div className="w-full h-[25px] px-4 flex items-center justify-between my-2">
                      <h2 className="text-black  text-lg text-start ">
                        {item.title}
                      </h2>
                    </div>
                    {/* this will hold the stars */}
                    <div className="w-full h-[20px] flex items-center justify-between my-2 px-4">
                      <div className="w-[50%] h-[20px] flex items-center justify-start gap-x-2">
                        <ArrowBigDownDash className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500  text-sm text-start ">
                          {item.numberOfDownloads} عدد المشترين
                        </span>
                      </div>
                    </div>

                    <DonwloadButton fileUrl={item.fileUrl} />
                  </div>
                </div>
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
