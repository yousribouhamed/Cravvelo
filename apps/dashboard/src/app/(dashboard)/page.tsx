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
  getAllComments,
  getAllCourses,
  getAllNotifications,
  getAllStudents,
  getSalesAnalytics,
  getStudentsAnalytics,
  getDashboardSummary,
} from "./actions";
import DashboardCards from "@/src/components/dashboard-cards";

// Helper function to calculate date ranges
const calculatePreviousPeriod = (fromDay?: Date, toDay?: Date) => {
  if (!fromDay || !toDay) {
    // If no dates provided, use last 30 days vs previous 30 days
    const currentEnd = new Date();
    const currentStart = new Date();
    currentStart.setDate(currentStart.getDate() - 30);

    const previousEnd = new Date(currentStart);
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 30);

    return {
      current: { start: currentStart, end: currentEnd },
      previous: { start: previousStart, end: previousEnd },
    };
  }

  const daysDiff =
    Math.abs(toDay.getTime() - fromDay.getTime()) / (1000 * 60 * 60 * 24);
  const previousEnd = new Date(fromDay);
  previousEnd.setDate(previousEnd.getDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - Math.floor(daysDiff));

  return {
    current: { start: fromDay, end: toDay },
    previous: { start: previousStart, end: previousEnd },
  };
};

// Helper function to get top courses by sales
const getTopCoursesBySales = (sales: any[], courses: any[]) => {
  const courseSales = sales
    .filter((sale) => sale.itemType === "COURSE")
    .reduce((acc, sale) => {
      acc[sale.itemId] = (acc[sale.itemId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return courses
    .map((course) => ({
      ...course,
      actualSales: courseSales[course.id] || 0,
    }))
    .sort((a, b) => b.actualSales - a.actualSales)
    .slice(0, 10);
};

interface PageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
}

async function Page({ searchParams }: PageProps) {
  // Await the searchParams
  const resolvedSearchParams = await searchParams;
  const { from, to } =
    dashboardProductsSearchParamsSchema.parse(resolvedSearchParams);

  const fromDay = from ? new Date(from) : undefined;
  const toDay = to ? new Date(to) : undefined;

  // Calculate date ranges for comparison
  const dateRanges = calculatePreviousPeriod(fromDay, toDay);

  const user = await useHaveAccess();

  try {
    // Fetch all data concurrently
    const [
      salesData,
      studentsData,
      commentsData,
      notificationsData,
      coursesData,
      salesAnalytics,
      studentsAnalytics,
      dashboardSummary,
    ] = await Promise.all([
      getAllSales({
        accountId: user.accountId,
        start_date: dateRanges.current.start,
        end_date: dateRanges.current.end,
        limit: 100, // Get more for analytics
      }),
      getAllStudents({
        accountId: user.accountId,
        start_date: dateRanges.current.start,
        end_date: dateRanges.current.end,
        limit: 100,
      }),
      getAllComments({
        accountId: user.accountId,
        start_date: dateRanges.current.start,
        end_date: dateRanges.current.end,
        limit: 100,
      }),
      getAllNotifications({
        accountId: user.accountId,
        limit: 10,
      }),
      getAllCourses({
        accountId: user.accountId,
        limit: 50,
      }),
      getSalesAnalytics({
        accountId: user.accountId,
        current_start: dateRanges.current.start,
        current_end: dateRanges.current.end,
        previous_start: dateRanges.previous.start,
        previous_end: dateRanges.previous.end,
      }),
      getStudentsAnalytics({
        accountId: user.accountId,
        current_start: dateRanges.current.start,
        current_end: dateRanges.current.end,
        previous_start: dateRanges.previous.start,
        previous_end: dateRanges.previous.end,
      }),
      getDashboardSummary({
        accountId: user.accountId,
        start_date: dateRanges.current.start,
        end_date: dateRanges.current.end,
      }),
    ]);

    // Extract data from paginated responses
    const sales = salesData.data;
    const students = studentsData.data;
    const comments = commentsData.data;
    const notifications = notificationsData.data;
    const courses = coursesData.data;

    // Get top courses by actual sales
    const topCourses = getTopCoursesBySales(sales, courses);

    // Calculate percentage changes using the analytics data
    const profitsPercentageChange = {
      percentage: salesAnalytics.changes.revenueChange,
      isPositive: salesAnalytics.changes.revenueChange >= 0,
    };

    const salesPercentageChange = {
      percentage: salesAnalytics.changes.salesChange,
      isPositive: salesAnalytics.changes.salesChange >= 0,
    };

    const studentsPercentageChange = {
      percentage: studentsAnalytics.change,
      isPositive: studentsAnalytics.change >= 0,
    };

    // For comments, calculate manually since we don't have analytics function yet
    const commentsPercentageChange = {
      percentage: 0, // You could add this to analytics functions
      isPositive: true,
    };

    // Get recent sales for the "New Orders" section
    const recentSales = sales.slice(0, 20);

    return (
      <MaxWidthWrapper>
        <main className="w-full flex flex-col overflow-y-hidden h-fit mb-10 justify-start">
          <Header notifications={notifications} user={user} title="الرئيسية" />

          {!user.verified && <ConfirmeAccount />}

          {!user?.subdomain ? (
            <CreateAcademiaSection />
          ) : (
            <>
              <div className="w-full h-[30px] gap-x-4 flex justify-between items-center mt-10">
                <DatePickerWithRange />

                {user?.subdomain ? (
                  <Link
                    target="_blank"
                    className={cn(
                      buttonVariants(),
                      "font-bold gap-x-4 hover:scale-100 transition-all duration-300"
                    )}
                    href={`https://${user?.subdomain}`}
                  >
                    <span>معاينة الأكاديمية</span>
                    <Eye className="h-4 w-4" />
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
                  commentsNumber={comments?.length || 0}
                  profits={salesAnalytics.current.revenue}
                  salesNumber={sales?.length || 0}
                  studentsNumber={students?.length || 0}
                />

                <div className="grid gap-4 md:grid-cols-3 my-8 h-[450px] w-full">
                  <AreaChartOverview sales={sales} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 my-8 min-h-[200px] h-fit w-full mb-10">
                  {/* Top Selling Courses */}
                  <Card className="col-span-1">
                    <CardHeader>
                      <p>الدورات الأكثر مبيعاً</p>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center overflow-x-auto">
                      <div className="w-full h-[50px] bg-primary flex items-center justify-between px-4 rounded-t-2xl">
                        <p className="text-white text-md">اسم الدورة</p>
                        <p className="text-white text-md">عدد المبيعات</p>
                        <p className="text-white text-md">سعر الدورة</p>
                      </div>

                      {topCourses.length === 0 ? (
                        <NotFoundCard />
                      ) : (
                        <ScrollArea className="w-full h-[150px]">
                          <div className="w-full h-fit flex flex-col rounded-b-2xl shadow">
                            {topCourses.map((course) => (
                              <div
                                key={course.id}
                                className="w-full flex items-center justify-between px-4 border p-4"
                              >
                                <span className="text-sm">
                                  DZD {course.price?.toFixed(2) || "0.00"}
                                </span>
                                <span className="font-medium">
                                  {course.actualSales}
                                </span>
                                <span className="truncate max-w-[150px]">
                                  {course.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Sales */}
                  <Card className="col-span-1">
                    <CardHeader>
                      <p>الطلبات الجديدة</p>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center overflow-x-auto">
                      <div className="w-full h-[50px] bg-primary flex items-center justify-between px-4 rounded-t-2xl">
                        <p className="text-white text-md">نوع الطلبية</p>
                        <p className="text-white text-md">مبلغ الطلبية</p>
                        <p className="text-white text-md">الحالة</p>
                      </div>

                      {recentSales.length === 0 ? (
                        <NotFoundCard />
                      ) : (
                        <ScrollArea className="w-full h-[150px]">
                          <div className="w-full h-fit flex flex-col rounded-b-2xl shadow">
                            {recentSales.map((sale) => (
                              <div
                                key={sale.id}
                                className="w-full flex items-center justify-between px-4 border p-4"
                              >
                                <span className="text-sm">
                                  DZD {sale.price?.toFixed(2) || "0.00"}
                                </span>
                                <span>
                                  {sale.itemType === "COURSE" ? "دورة" : "منتج"}
                                </span>
                                <span
                                  className={cn(
                                    "px-2 py-1 rounded-full text-xs",
                                    sale.status === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : sale.status === "PROCESSING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : sale.status === "CANCELLED"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  )}
                                >
                                  {sale.status === "COMPLETED"
                                    ? "مكتمل"
                                    : sale.status === "PROCESSING"
                                    ? "معالج"
                                    : sale.status === "CANCELLED"
                                    ? "ملغي"
                                    : "جديد"}
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
  } catch (error) {
    console.error("Dashboard loading error:", error);

    // Return error state
    return (
      <MaxWidthWrapper>
        <main className="w-full flex flex-col overflow-y-hidden h-fit mb-10 justify-start">
          <Header notifications={[]} user={user} title="الرئيسية" />

          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <p className="text-center text-red-600">
                  خطأ في تحميل البيانات
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  حدث خطأ أثناء تحميل بيانات لوحة التحكم. يرجى المحاولة مرة
                  أخرى.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </MaxWidthWrapper>
    );
  }
}

export default Page;
