import React from "react";
import LibraryNavigation from "../../_components/library-navigation";
import { authorization, getStudent } from "../../_actions/auth";
import { StudentBag } from "@/src/types";
import AcademyHeader from "../../_components/layout/academy-header";
import MaxWidthWrapper from "../../_components/max-width-wrapper";
import { getSubDomainValue } from "../../lib";
import { getSiteData } from "../../_actions";
import AcademiaFooter from "../../_components/layout/academy-footer";
import { notFound, redirect } from "next/navigation";
import { Progress } from "@ui/components/ui/progress";

import { BookMarked } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: { site: string };
}

function calculateProgress(episode: number, videos: number): number {
  if (episode < 0 || videos < 1 || episode > videos) {
    return 100;
  }

  const progressPercentage = (episode / videos) * 100;
  return parseFloat(progressPercentage.toFixed(0));
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
            {Array.isArray(bag?.courses) && bag?.courses?.length === 0 && (
              <div className="w-full h-[300px] flex flex-col gap-y-2 items-center justify-center">
                <Image
                  src="/academia/no-video.svg"
                  alt="this is the error page"
                  width={400}
                  height={400}
                />

                <p className="text-xl font-bold">لا يوجد اي كورسات</p>
              </div>
            )}
            {bag?.courses?.map((item, index) => {
              return (
                <Link
                  href={`/course-academy/${item.course.id}/course-player`}
                  key={item.course.title + index}
                >
                  <div className="w-[320px] min-h-[300px] h-fit p-0  border  flex flex-col shadow rounded-xl hover:shadow-xl  transition-all duration-700 bg-white cursor-pointer ">
                    <img
                      alt={item.course.title + "image"}
                      src={item.course.thumbnailUrl}
                      className="w-full h-[200px] rounded-t-xl object-cover "
                    />
                    <div className="w-full h-[50px] px-4 flex items-center justify-between my-4">
                      <h2 className="text-black  text-lg text-start ">
                        {item.course.title}
                      </h2>
                    </div>
                    {/* this will hold the stars */}
                    <div className="w-full h-[10px] flex items-center justify-between my-4 px-4">
                      <div className="w-[50%] h-[20px] flex items-center justify-start gap-x-2">
                        <BookMarked className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500  text-sm text-start ">
                          {item.course.nbrChapters} مادة
                        </span>
                      </div>
                    </div>

                    {/* this will hold the price */}

                    <div className="w-full h-[70px] px-4 flex items-center justify-center gap-x-4  p-2">
                      <span className="text-lg text-gray-600">
                        {calculateProgress(
                          item?.currentEpisode,
                          item.course?.nbrChapters
                        )}
                        %
                      </span>
                      <Progress
                        color={website?.color}
                        value={calculateProgress(
                          item?.currentEpisode,
                          item.course?.nbrChapters
                        )}
                      />
                    </div>
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
