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
import { formatDZD } from "../../lib/utils";
import { HOME_PAGE_DASHBOARD_AR, HOME_PAGE_DASHBOARD_EN } from "@cravvelo/i18n";

interface DashboardCardsProps {
  salesNumber: number;
  studentsNumber: number;
  profits: number;
  commentsNumber: number;

  lang: string;

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
  lang,
}) => {
  const HOME_PAGE_DASHBOARD =
    lang === "en" ? HOME_PAGE_DASHBOARD_EN : HOME_PAGE_DASHBOARD_AR;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Link href="/orders">
        <Card
          key={"card1"}
          className="flex flex-col justify-between  min-h-[150px]"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg text-[#303030] font-semibold ">
              {HOME_PAGE_DASHBOARD.cards.sales.title}
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-8 w-8 text-[#303030]"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardFooter className="flex flex-col  items-start justify-center gap-y-1 ">
            <div className="text-lg text-[#303030] font-bold">
              <CountUp preserveValue start={0} end={salesNumber} />
            </div>
            <div className="flex  justify-between items-center gap-x-2">
              <Badge className="bg-[#2ECA8B] text-xs rounded-full text-white">
                {percentageChange.salesPercentageChange.percentage}%
              </Badge>
              <span className="text-[#303030] text-xs">
                {HOME_PAGE_DASHBOARD.cards.label}
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
            <CardTitle className="text-lg text-[#303030] font-semibold ">
              {HOME_PAGE_DASHBOARD.cards.students.title}
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-8 w-8 text-[#303030]"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardFooter className="flex flex-col  items-start justify-center gap-y-1 ">
            <div className="text-lg text-[#303030] font-bold ">
              <CountUp preserveValue start={0} end={studentsNumber} />
            </div>
            <div className="flex  justify-between items-center gap-x-2">
              <Badge className="bg-[#2ECA8B] text-xs rounded-full text-white">
                {percentageChange.studentsPercentageChange.percentage}%
              </Badge>
              <span className="text-[#303030] text-xs">
                {HOME_PAGE_DASHBOARD.cards.label}
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
          <CardTitle className="text-lg text-[#303030]  font-semibold ">
            {HOME_PAGE_DASHBOARD.cards.profit.title}
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-8 w-8 text-[#303030]"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardFooter className="flex flex-col  items-start justify-center gap-y-1 ">
          <div className="text-lg text-[#303030]  font-bold">
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
            <span className="text-[#303030] text-xs">
              {HOME_PAGE_DASHBOARD.cards.label}
            </span>
          </div>
        </CardFooter>
      </Card>
      <Card
        key={"card4"}
        className="flex flex-col justify-between min-h-[150px]"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold ">
            {HOME_PAGE_DASHBOARD.cards.Comments.title}
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-8 w-8 text-[#303030]"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardFooter className="flex flex-col  items-start justify-center gap-y-1 ">
          <div className="text-lg text-[#303030]  font-bold">
            <CountUp preserveValue start={0} end={commentsNumber} />
          </div>

          <div className="flex  justify-between items-center gap-x-2">
            <Badge className="bg-[#2ECA8B] text-xs rounded-full text-white">
              {percentageChange.commentsPercentageChange.percentage}%
            </Badge>
            <span className="text-[#303030] text-xs">
              {HOME_PAGE_DASHBOARD.cards.label}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardCards;
