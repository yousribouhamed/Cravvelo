import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import AreaChartOverview from "@/src/components/area-chart";
import RangeDatePicker from "@/src/components/range-date-picker";
import { NotFoundCard } from "@/src/components/not-found-card";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col overflow-y-hidden h-fit  justify-start">
        <Header user={user} title="الرئيسية" />
        <div className="w-full h-[100px] flex justify-start items-center ">
          <RangeDatePicker />
        </div>
        <div className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col justify-between  min-h-[150px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold ">الطلبات </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-8 w-8 text-[#43766C]"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardFooter>
                <div className="text-2xl font-bold">DZD45,231.89</div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col justify-between  min-h-[150px] ">
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
                  className="h-8 w-8 text-[#43766C]"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardFooter>
                <div className="text-2xl font-bold">+2350</div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col justify-between  min-h-[150px] ">
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
                  className="h-8 w-8 text-[#43766C]"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardFooter>
                <div className="text-2xl font-bold">+12,234</div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col justify-between min-h-[150px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold ">التعليقات</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-8 w-8 text-[#43766C]"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardFooter>
                <div className="text-2xl  font-bold">+573</div>
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-3  my-8 h-[450px] w-full ">
            <AreaChartOverview />
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>لم نقرر بعد ما سنضعه هنا</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <NotFoundCard />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 my-8 h-[300px] w-full ">
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
                <NotFoundCard />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
