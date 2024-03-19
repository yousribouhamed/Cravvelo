import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { DatePickerWithRange } from "@/src/components/range-date-picker";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import AreaChartOverview from "@/src/components/area-chart";
import { buttonVariants } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import { ArrowUpLeft } from "lucide-react";
import { prisma } from "database/src";
import Header from "@/src/components/layout/header";

export default function page() {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col overflow-y-hidden h-fit mb-10 justify-start">
        <Header title="الرئيسية" />
        <div className="w-full h-[30px] flex justify-between items-center mt-10 ">
          <DatePickerWithRange />
        </div>
        <div className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col justify-between  min-h-[150px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold ">المبيعات </CardTitle>
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
                <div className="text-2xl font-bold">{0}</div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col justify-between  min-h-[150px] ">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold ">
                  عدد المستخدمين
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardFooter>
                <div className="text-2xl font-bold">{0}</div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col justify-between  min-h-[150px] ">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold ">عدد الطلاب</CardTitle>
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
                <div className="text-2xl font-bold">{0}</div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col justify-between min-h-[150px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold ">
                  عدد الدورات
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
                <div className="text-2xl  font-bold">0</div>
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-3  my-8 h-[450px] w-full ">
            <AreaChartOverview sales={[]} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 my-8 h-[300px] w-full mb-10 ">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>الدورات الآكثر مبيعاً</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center"></CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>الطلبات الجديدة</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center"></CardContent>
            </Card>
          </div>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
