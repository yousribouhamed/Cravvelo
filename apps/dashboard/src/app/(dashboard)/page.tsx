import MaxWidthWrapper from "../../components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";

import AreaChartOverview from "@/src/components/area-chart";
import { DatePickerWithRange } from "@/src/components/range-date-picker";
import { NotFoundCard } from "@/src/components/not-found-card";
import useHaveAccess from "@/src/hooks/use-have-access";
import { buttonVariants } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import { ArrowUpLeft, Eye } from "lucide-react";
import Link from "next/link";
import PublishWebsite from "@/src/components/models/editor/publish-website";
import { prisma } from "database/src";
import { dashboardProductsSearchParamsSchema } from "@/src/lib/validators/cart";
import CreateAcademiaSection from "@/src/components/create-academia-section";

const getAllSales = async ({
  accountId,
  end_date,
  start_date,
}: {
  accountId: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}) => {
  const sales = await prisma.sale.findMany({
    where: {
      accountId,
      createdAt:
        start_date && end_date
          ? {
              gte: start_date,
              lte: end_date,
            }
          : {},
    },
  });

  return sales;
};

const getAllstudents = async ({
  accountId,
  end_date,
  start_date,
}: {
  accountId: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}) => {
  const students = await prisma.student.findMany({
    where: {
      accountId,
      createdAt:
        start_date && end_date
          ? {
              gte: start_date, // Start of date range
              lte: end_date, // End of date range
            }
          : {},
    },
  });

  return students;
};
const getAllCommets = async ({
  accountId,
  end_date,
  start_date,
}: {
  accountId: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}) => {
  const comments = await prisma.comment.findMany({
    where: {
      accountId,
      createdAt:
        start_date && end_date
          ? {
              gte: start_date, // Start of date range
              lte: end_date, // End of date range
            }
          : {},
    },
  });

  return comments;
};

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

async function Page({ searchParams }) {
  // Parse search params using zod schema
  const { from, to } = dashboardProductsSearchParamsSchema.parse(searchParams);

  const fromDay = from ? new Date(from) : undefined;
  const toDay = to ? new Date(to) : undefined;

  const user = await useHaveAccess();

  const [sales, studnets, comments, notifications] = await Promise.all([
    getAllSales({
      accountId: user.accountId,
      start_date: fromDay,
      end_date: toDay,
    }),
    getAllstudents({
      accountId: user.accountId,
      start_date: fromDay,
      end_date: toDay,
    }),
    getAllCommets({
      accountId: user.accountId,
      start_date: fromDay,
      end_date: toDay,
    }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col overflow-y-hidden h-fit mb-10 justify-start">
        <Header notifications={notifications} user={user} title="الرئيسية" />
        {/* <ConfirmeAccount /> */}
        {!user?.subdomain ? (
          <CreateAcademiaSection />
        ) : (
          <>
            <div className="w-full h-[30px] flex justify-between items-center mt-10 ">
              <DatePickerWithRange />
              {user?.subdomain ? (
                <Link
                  target="_blank"
                  className={cn(
                    buttonVariants(),
                    "font-bold gap-x-4  hover:scale-100 transition-all duration-300"
                  )}
                  href={`https://${user?.subdomain}`}
                >
                  <span>معاينة الأكاديمية</span>

                  <Eye className=" h-4 w-4" />
                </Link>
              ) : (
                <PublishWebsite />
              )}
            </div>
            <div className="space-y-4 pt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card
                  key={"card1"}
                  className="flex flex-col justify-between  min-h-[150px]"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold ">
                      المبيعات{" "}
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-8 w-8 text-[#FC6B00]"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardFooter>
                    <div className="text-2xl font-bold">{sales.length}</div>
                  </CardFooter>
                </Card>
                <Card
                  key={"card2"}
                  className="flex flex-col justify-between  min-h-[150px] "
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold ">الطلاب</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-8 w-8 text-[#FC6B00]"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardFooter>
                    <div className="text-2xl font-bold">{studnets?.length}</div>
                  </CardFooter>
                </Card>
                <Card
                  key={"card3"}
                  className="flex flex-col justify-between  min-h-[150px] "
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold ">
                      صافي الآرباح
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-8 w-8 text-[#FC6B00]"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardFooter>
                    <div className="text-2xl font-bold">
                      DZD{" "}
                      {sales.length > 0
                        ? sales
                            .map((item) => Number(item.price))
                            .reduce((current, next) => current + next)
                        : 0}
                    </div>
                  </CardFooter>
                </Card>
                <Card
                  key={"card4"}
                  className="flex flex-col justify-between min-h-[150px]"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold ">
                      التعليقات
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-8 w-8 text-[#FC6B00]"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardFooter>
                    <div className="text-2xl  font-bold">{comments.length}</div>
                  </CardFooter>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-3  my-8 h-[450px] w-full ">
                <AreaChartOverview sales={sales} />
              </div>
              <div className="grid gap-4 md:grid-cols-2 my-8 h-[300px] w-full mb-10 ">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>الدورات الآكثر مبيعاً</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <NotFoundCard />
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>الطلبات الجديدة</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    {sales.length === 0 ? (
                      <NotFoundCard />
                    ) : (
                      <div className="w-full h-full flex flex-col gap-y-2">
                        {sales.map((item) => (
                          <div
                            key={item.id}
                            className="w-full flex items-center justify-between px-4 border-b p-4"
                          >
                            <span> DZD {item.price}</span>
                            <span>عنوان المنتج</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </MaxWidthWrapper>
  );
}

export default Page;
