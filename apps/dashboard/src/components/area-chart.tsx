"use client";

import { Card, CardContent } from "@ui/components/ui/card";
import { useState } from "react";
import { Sale } from "database";
import type { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDateInArabic } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Button } from "@ui/components/ui/button";
import CustomTooltip from "./custom-tooltip";

const data = [
  {
    name: "Jan",
    "الدورات التدريبية": 4000,
    "المنتجات الرقمية": 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    "الدورات التدريبية": 3000,
    "المنتجات الرقمية": 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    "الدورات التدريبية": 2000,
    "المنتجات الرقمية": 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    "الدورات التدريبية": 2780,
    "المنتجات الرقمية": 3908,
    amt: 2000,
  },
  {
    name: "May",
    "الدورات التدريبية": 1890,
    "المنتجات الرقمية": 4800,
    amt: 2181,
  },
  {
    name: "Jun",
    "الدورات التدريبية": 2390,
    "المنتجات الرقمية": 3800,
    amt: 2500,
  },
  {
    name: "Jul",
    "الدورات التدريبية": 3490,
    "المنتجات الرقمية": 4300,
    amt: 2100,
  },
];

interface AreaChartProps {
  sales: Sale[];
}

const AreaChartOverview: FC<AreaChartProps> = ({ sales }: AreaChartProps) => {
  const [showCourses, setShowCourses] = useState(true);
  const [showProducts, setShowProducts] = useState(true);

  // Aggregate sales data by month
  const aggregateSalesByMonth = () => {
    const aggregatedData = {};

    sales.forEach((sale) => {
      const month = new Date(sale.createdAt).toLocaleString("default", {
        month: "short",
      });
      if (!aggregatedData[month]) {
        aggregatedData[month] = {
          name: month,
          "الدورات التدريبية": 0,
          "المنتجات الرقمية": 0,
        };
      }

      if (sale.itemType === "PRODUCT") {
        aggregatedData[month]["المنتجات الرقمية"] += sale.price;
      } else if (sale.itemType === "COURSE") {
        aggregatedData[month]["الدورات التدريبية"] += sale.price;
      }
    });

    return Object.values(aggregatedData);
  };

  return (
    <Card className="col-span-3  w-full h-full p-0">
      <CardContent className="p-0   w-full h-full">
        <div
          dir="ltr"
          className="h-[70px]   w-full flex items-center justify-end px-2"
        >
          <div className="w-[300px] h-full flex  justify-end items-center gap-y-2 px-4">
            <button
              className="w-[300px] flex items-center gap-x-2 justify-end cursor-pointer"
              onClick={() => setShowCourses(!showCourses)}
            >
              <span className="text-xs">الدورات التدريبية</span>

              {showCourses ? (
                <div className="w-3 h-3 rounded-[50%] bg-[#008FFB]" />
              ) : (
                <div className="w-3 h-3 rounded-[50%] bg-gray-500" />
              )}
            </button>
            <button
              className="w-[300px] flex items-center gap-x-2 justify-end cursor-pointer"
              onClick={() => setShowProducts(!showProducts)}
            >
              <span className="text-xs">المنتجات الرقمية</span>
              {showProducts ? (
                <div className="w-3 h-3 rounded-[50%] bg-[#2ECA8B]" />
              ) : (
                <div className="w-3 h-3 rounded-[50%] bg-gray-500" />
              )}
            </button>
          </div>
        </div>
        <div dir="ltr" className="w-full h-[calc(100%-70px)] pr-2 ">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              width={730}
              height={250}
              // aggregateSalesByMonth()
              data={data}
              // data={aggregateSalesByMonth()}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2ECA8B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2ECA8B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008FFB" stopOpacity={0.8} />
                  {/* <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} /> */}
                  <stop offset="95%" stopColor="#008FFB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tick={{ fill: "gray", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "gray", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <CartesianGrid
                horizontal={true}
                vertical={false}
                strokeDasharray="3 "
              />
              <Tooltip content={<CustomTooltip />} />
              {showProducts && (
                <Area
                  type="monotone"
                  dataKey="المنتجات الرقمية"
                  stroke="#2ECA8B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              )}
              {showCourses && (
                <Area
                  type="monotone"
                  dataKey="الدورات التدريبية"
                  stroke="#008FFB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChartOverview;

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      size="sm"
      variant="secondary"
      className=" w-10 p-0 bg-white rounded-xl border"
    >
      بالأشهر
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuItem className="w-full h-full flex justify-between items-center px-2">
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.2413 3.49125L12.366 2.36592C12.6005 2.13147 12.9184 1.99976 13.25 1.99976C13.5816 1.99976 13.8995 2.13147 14.134 2.36592C14.3685 2.60037 14.5002 2.91836 14.5002 3.24992C14.5002 3.58149 14.3685 3.89947 14.134 4.13392L7.05467 11.2133C6.70222 11.5655 6.26758 11.8244 5.79 11.9666L4 12.4999L4.53333 10.7099C4.67552 10.2323 4.93442 9.7977 5.28667 9.44525L11.2413 3.49125ZM11.2413 3.49125L13 5.24992M12 9.83325V12.9999C12 13.3977 11.842 13.7793 11.5607 14.0606C11.2794 14.3419 10.8978 14.4999 10.5 14.4999H3.5C3.10218 14.4999 2.72064 14.3419 2.43934 14.0606C2.15804 13.7793 2 13.3977 2 12.9999V5.99992C2 5.6021 2.15804 5.22057 2.43934 4.93926C2.72064 4.65796 3.10218 4.49992 3.5 4.49992H6.66667"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      بالأشهر
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem className="w-full h-full flex justify-between items-center px-2">
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.2413 3.49125L12.366 2.36592C12.6005 2.13147 12.9184 1.99976 13.25 1.99976C13.5816 1.99976 13.8995 2.13147 14.134 2.36592C14.3685 2.60037 14.5002 2.91836 14.5002 3.24992C14.5002 3.58149 14.3685 3.89947 14.134 4.13392L7.05467 11.2133C6.70222 11.5655 6.26758 11.8244 5.79 11.9666L4 12.4999L4.53333 10.7099C4.67552 10.2323 4.93442 9.7977 5.28667 9.44525L11.2413 3.49125ZM11.2413 3.49125L13 5.24992M12 9.83325V12.9999C12 13.3977 11.842 13.7793 11.5607 14.0606C11.2794 14.3419 10.8978 14.4999 10.5 14.4999H3.5C3.10218 14.4999 2.72064 14.3419 2.43934 14.0606C2.15804 13.7793 2 13.3977 2 12.9999V5.99992C2 5.6021 2.15804 5.22057 2.43934 4.93926C2.72064 4.65796 3.10218 4.49992 3.5 4.49992H6.66667"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      بالاسابيع
    </DropdownMenuItem>

    <DropdownMenuSeparator />
  </DropdownMenuContent>
</DropdownMenu>;
