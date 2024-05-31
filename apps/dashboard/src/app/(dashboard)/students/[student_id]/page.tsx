import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import useHaveAccess from "@/src/hooks/use-have-access";
import { StudentBag } from "@/src/types";
import { Progress } from "@ui/components/ui/progress";
import { prisma } from "database/src";
import { BookMarked } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: { student_id: string };
}

function calculateProgress(episode: number, videos: number): number {
  if (episode < 0 || videos < 1 || episode > videos) {
    // throw new Error(
    //   "Invalid input: Current video or total videos cannot be less than 1, and current video cannot be greater than total videos."
    // );

    return 0;
  }

  const progressPercentage = (episode / videos) * 100;
  return parseFloat(progressPercentage.toFixed(0));
}

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

export default async function Page({ params }: PageProps) {
  const user = await useHaveAccess();

  const [notifications, student] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
    prisma.student.findUnique({
      where: {
        id: params.student_id,
      },
    }),
  ]);

  const bag = JSON.parse(student?.bag as string) as StudentBag;

  if (!student) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header
          notifications={notifications}
          goBack
          user={user}
          title={student?.full_name}
        />
        <div className="w-full min-h-[400px]  mt-4 h-fit flex flex-col items-center justify-start border shadow rounded-xl bg-white p-4">
          <div className="w-full h-[50px] flex items-center justify-start my-2 p-4 px-0 ">
            <h2 className="text-xl font-bold text-black">المعلومات الشخصية</h2>
          </div>
          <div className="w-full h-[300px]  flex items-center justify-start gap-x-4">
            <div className="w-[300px] h-full relative rounded-xl border ">
              <Image
                src={student?.photo_url}
                alt={student?.full_name + "photo"}
                fill
                className="rounded-xl"
              />
            </div>

            <div className="w-[500px] h-full flex flex-col ">
              <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
                <p className="font-bold">اسم : </p>
                <p>{student?.full_name}</p>
              </div>
              <div className="w-full h-[50px] flex items-center justify-start  gap-x-4">
                <p className="font-bold">بريد إلكتروني : </p>
                <p>{student?.email}</p>
              </div>
              <div className="w-full h-[50px] flex items-center justify-start  gap-x-4 ">
                <p className="font-bold">هاتف : </p>
                <p>{student?.phone}</p>
              </div>
              <div className="w-full h-[50px] flex flex-col items-start justify-center gap-y-2  gap-x-4">
                <p className="font-bold">السيرة الذاتية : </p>
                <p>{student?.bio}</p>
              </div>
            </div>
          </div>

          {/* courses */}

          <div className="w-full h-[50px] flex items-center justify-start p-4 my-2 px-0 ">
            <h2 className="text-xl font-bold text-black"> الدورات التدريبية</h2>
          </div>
          <div className="w-full min-h-[300px] h-fit  flex flex-wrap items-center justify-start gap-4">
            {bag?.courses?.map((item, index) => {
              return (
                <div key={item.course.title + index}>
                  <div className="w-[320px] min-h-[300px] h-fit p-0  border  flex flex-col shadow rounded-xl hover:shadow-xl  transition-all duration-700 bg-white cursor-pointer ">
                    <img
                      alt={item.course.title + "image"}
                      src={item.course.thumnailUrl}
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
                          item.currentEpisode,
                          item.course.nbrChapters
                        )}
                        %
                      </span>
                      <Progress
                        color={"#FC6B00"}
                        value={calculateProgress(
                          item.currentEpisode,
                          item.course.nbrChapters
                        )}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* digital products */}
          {/* <div className="w-full h-[50px] flex items-center justify-start p-4 ">
            <h2 className="text-lg font-bold text-black"> المنتجات الرقمية</h2>
          </div>
          <div className="w-full h-[300px]  flex items-center justify-start gap-x-4">
            <div className="w-[300px] h-full "></div>

            <div className="w-[500px] h-full "></div>
          </div> */}

          {/* certificates */}
          {/* <div className="w-full h-[50px] flex items-center justify-start p-4 ">
            <h2 className="text-lg font-bold text-black">الشهادات المكتسبة</h2>
          </div>
          <div className="w-full h-[300px]  flex items-center justify-start gap-x-4">
            <div className="w-[300px] h-full "></div>

            <div className="w-[500px] h-full "></div>
          </div> */}
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
