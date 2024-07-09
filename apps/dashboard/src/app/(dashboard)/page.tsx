import MaxWidthWrapper from "../../components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import { Card, CardContent, CardHeader } from "@ui/components/ui/card";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import AreaChartOverview from "@/src/components/area-chart";
import { DatePickerWithRange } from "@/src/components/range-date-picker";
import { NotFoundCard } from "@/src/components/not-found-card";
import useHaveAccess from "@/src/hooks/use-have-access";
import { buttonVariants } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import PublishWebsite from "@/src/components/models/editor/publish-website";
import { dashboardProductsSearchParamsSchema } from "@/src/lib/validators/cart";
import CreateAcademiaSection from "@/src/components/create-academia-section";
import ConfirmeAccount from "@/src/components/confirme-account";
import {
  getAllSales,
  getAllCommets,
  getAllCourses,
  getAllNotifications,
  getAllstudents,
  getPreviousPeriodComments,
  getPreviousPeriodSales,
  getPreviousPeriodStudents,
} from "./actions";
import DashboardCards from "@/src/components/dashboard-cards";

const calculatePercentageChange = (current, previous) => {
  if (previous === 0)
    return { percentage: current * 100, isPositive: current >= 0 };
  const percentageChange = ((current - previous) / previous) * 100;
  return { percentage: percentageChange, isPositive: percentageChange >= 0 };
};

async function Page({ searchParams }) {
  const { from, to } = dashboardProductsSearchParamsSchema.parse(searchParams);

  const fromDay = from ? new Date(from) : undefined;
  const toDay = to ? new Date(to) : undefined;

  // Calculate previous period dates
  const previousFromDay = fromDay ? new Date(fromDay) : new Date();
  const previousToDay = toDay ? new Date(toDay) : new Date();

  if (previousFromDay) previousFromDay.setMonth(previousFromDay.getMonth() - 1);
  if (previousToDay) previousToDay.setMonth(previousToDay.getMonth() - 1);

  const user = await useHaveAccess();

  const [
    sales,
    students,
    comments,
    notifications,
    courses,
    previousSales,
    previousStudents,
    previousComments,
  ] = await Promise.all([
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
    getAllCourses({ accountId: user.accountId }),
    getPreviousPeriodSales({
      accountId: user.accountId,
      start_date: previousFromDay,
      end_date: previousToDay,
    }),
    getPreviousPeriodStudents({
      accountId: user.accountId,
      start_date: previousFromDay,
      end_date: previousToDay,
    }),
    getPreviousPeriodComments({
      accountId: user.accountId,
      start_date: previousFromDay,
      end_date: previousToDay,
    }),
  ]);

  const currentProfits =
    sales.length > 0
      ? sales.map((item) => Number(item.price)).reduce((a, b) => a + b, 0)
      : 0;
  const previousProfits =
    previousSales.length > 0
      ? previousSales
          .map((item) => Number(item.price))
          .reduce((a, b) => a + b, 0)
      : 0;

  const profitsPercentageChange = calculatePercentageChange(
    currentProfits,
    previousProfits
  );

  const salesPercentageChange = calculatePercentageChange(
    sales.length,
    previousSales.length
  );
  const studentsPercentageChange = calculatePercentageChange(
    students.length,
    previousStudents.length
  );
  const commentsPercentageChange = calculatePercentageChange(
    comments.length,
    previousComments.length
  );

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col overflow-y-hidden h-fit mb-10 justify-start ">
        <Header notifications={notifications} user={user} title="الرئيسية" />
        {!user.verified && <ConfirmeAccount />}
        {!user?.subdomain ? (
          <CreateAcademiaSection />
        ) : (
          <>
            <div className="w-full h-[30px] flex  justify-start md:justify-between items-center mt-10 ">
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
                  <span className="hidden md:block">معاينة الأكاديمية</span>

                  <Eye className=" h-4 w-4" />
                </Link>
              ) : (
                <PublishWebsite />
              )}
            </div>
            <div className="space-y-4 pt-4">
              <DashboardCards
                percentageChange={{
                  commentsPercentageChange,
                  salesPercentageChange,
                  studentsPercentageChange,
                  profitsPercentageChange,
                }}
                commentsNumber={comments?.length}
                profits={
                  sales.length > 0
                    ? sales
                        .map((item) => Number(item.price))
                        .reduce((current, next) => current + next)
                    : 0
                }
                salesNumber={sales?.length}
                studentsNumber={students?.length}
              />
              <div className="grid gap-4 md:grid-cols-3  my-8 h-[450px] w-full ">
                <AreaChartOverview sales={sales} />
              </div>
              <div className="grid gap-4 md:grid-cols-2 my-8 min-h-[450px] h-fit w-full mb-10 ">
                <Card className="col-span-1">
                  <CardHeader>
                    <p>الدورات الآكثر مبيعاً</p>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center overflow-x-auto">
                    <div className="w-full h-[50px] bg-primary flex items-center justify-between px-4">
                      <p className="text-white text-md">اسم الدورة </p>
                      <p className="text-white text-md"> عدد الطلاب</p>
                      <p className="text-white text-md">سعر الدورة</p>
                    </div>
                    {courses.length === 0 ? (
                      <NotFoundCard />
                    ) : (
                      <ScrollArea className="w-full h-[300px]">
                        <div className="w-full h-fit   flex flex-col ">
                          {courses.map((item) => (
                            <div
                              key={item.id}
                              className="w-full flex items-center  justify-between  px-4 border  p-4"
                            >
                              <span className="text-sm">
                                {" "}
                                DZD {item.price ?? 0.0}
                              </span>
                              <span>{item.studentsNbr ?? 0}</span>
                              <span>{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <p>الطلبات الجديدة</p>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center overflow-x-auto">
                    <div className="w-full h-[50px] bg-primary flex items-center justify-between px-4">
                      <p className="text-white text-md">نوع الطلبية</p>
                      <p className="text-white text-md">مبلغ الطلبية</p>
                    </div>
                    {sales.length === 0 ? (
                      <NotFoundCard />
                    ) : (
                      <ScrollArea className="w-full h-[300px]">
                        <div className="w-full h-fit   flex flex-col ">
                          {sales.map((item) => (
                            <div
                              key={item.id}
                              className="w-full flex items-center justify-between px-4 border p-4"
                            >
                              <span> DZD {item.price}</span>
                              <span>
                                {" "}
                                {item.itemType === "COURSE" ? "دورة" : "منتج"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
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
