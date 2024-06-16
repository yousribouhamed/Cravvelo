"use client";

import {
  CardFooter,
  CardHeader,
  CardTitle,
  Card,
} from "@ui/components/ui/card";
import CountUp from "react-countup";
import { Badge } from "@ui/components/ui/badge";
import Link from "next/link";
import type { FC } from "react";
import { formatDZD } from "../lib/utils";

interface DashboardCardsProps {
  salesNumber: number;
  studentsNumber: number;
  profits: number;
  commentsNumber: number;

  percentageChange: {
    salesPercentageChange: {
      percentage: number;
      isPositive: boolean;
    };
    studentsPercentageChange: {
      percentage: number;
      isPositive: boolean;
    };
    commentsPercentageChange: {
      percentage: number;
      isPositive: boolean;
    };
    profitsPercentageChange: {
      percentage: number;
      isPositive: boolean;
    };
  };
}

const DashboardCards: FC<DashboardCardsProps> = ({
  commentsNumber,
  profits,
  salesNumber,
  studentsNumber,
  percentageChange,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Link href="/orders">
        <Card
          key={"card1"}
          className="flex flex-col justify-between  min-h-[150px]"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold ">المبيعات </CardTitle>
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
          <CardFooter className="flex flex-col  items-start justify-center gap-y-1 ">
            <div className="text-lg  font-bold">
              <CountUp preserveValue start={0} end={salesNumber} />
            </div>
            <div className="flex  justify-between items-center gap-x-2">
              <Badge className="bg-[#2ECA8B] text-xs rounded-full text-white">
                {percentageChange.salesPercentageChange.percentage}%
              </Badge>
              <span className="text-gray-500 text-xs">
                أكثر من الشهر الماضي
              </span>
            </div>
          </CardFooter>
        </Card>
      </Link>
      <Link href="/students">
        <Card
          key={"card2"}
          className="flex flex-col justify-between  min-h-[150px] "
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold ">الطلاب</CardTitle>
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
          <CardFooter className="flex flex-col  items-start justify-center gap-y-1 ">
            <div className="text-lg font-bold ">
              <CountUp preserveValue start={0} end={studentsNumber} />
            </div>
            <div className="flex  justify-between items-center gap-x-2">
              <Badge className="bg-[#2ECA8B] text-xs rounded-full text-white">
                {percentageChange.studentsPercentageChange.percentage}%
              </Badge>
              <span className="text-gray-500 text-xs">
                أكثر من الشهر الماضي
              </span>
            </div>
          </CardFooter>
        </Card>
      </Link>

      <Card
        key={"card3"}
        className="flex flex-col justify-between  min-h-[150px] "
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg  font-semibold ">
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
        <CardFooter className="flex flex-col  items-start justify-center gap-y-1 ">
          <div className="text-lg  font-bold">
            <CountUp
              preserveValue
              start={0}
              duration={5}
              end={profits}
              decimals={2}
              formattingFn={formatDZD}
            />
          </div>
          <div className="flex  justify-between items-center gap-x-2">
            <Badge className="bg-[#2ECA8B] text-xs rounded-full text-white">
              {percentageChange.profitsPercentageChange.percentage}%
            </Badge>
            <span className="text-gray-500 text-xs">أكثر من الشهر الماضي</span>
          </div>
        </CardFooter>
      </Card>
      <Card
        key={"card4"}
        className="flex flex-col justify-between min-h-[150px]"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold ">التعليقات</CardTitle>
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
        <CardFooter className="flex flex-col  items-start justify-center gap-y-1 ">
          <div className="text-lg  font-bold">
            <CountUp preserveValue start={0} end={commentsNumber} />
          </div>

          <div className="flex  justify-between items-center gap-x-2">
            <Badge className="bg-[#2ECA8B] text-xs rounded-full text-white">
              {percentageChange.commentsPercentageChange.percentage}%
            </Badge>
            <span className="text-gray-500 text-xs">أكثر من الشهر الماضي</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardCards;
