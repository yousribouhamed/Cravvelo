"use client";

import { Card, CardContent } from "@ui/components/ui/card";
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
    <Card className="col-span-3 w-full h-full p-0">
      <CardContent className="p-0  w-full h-full">
        <div
          dir="ltr"
          className="h-[70px]  w-full flex items-center justify-between px-2"
        >
          <span className="font-bold text-[#FC6B00] text-sm">
            (+5) more{" "}
            <span className="font-thin text-gray-500 text-xs">in 2021</span>
          </span>
          <div className="w-[300px] h-full flex flex-col items-end justify-center gap-y-2">
            <div className="w-[300px] flex items-center gap-x-4 justify-end">
              <span className="text-sm">الدورات التدريبية</span>
              <div className="w-[80px] h-1 bg-[#000000] rounded-full" />
            </div>
            <div className="w-[300px] flex items-center gap-x-4 justify-end">
              <span className="text-sm">المنتجات الرقمية</span>
              <div className="w-[80px] h-1 bg-[#FC6B00] rounded-full" />
            </div>
          </div>
        </div>
        <div dir="ltr" className="w-full h-[calc(100%-70px)] pr-2 ">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              width={730}
              height={250}
              data={aggregateSalesByMonth()}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FC6B00" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FC6B00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.8} />
                  {/* <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} /> */}
                  <stop offset="95%" stopColor="#000000" stopOpacity={0} />
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
              <Tooltip />
              <Area
                type="monotone"
                dataKey="المنتجات الرقمية"
                stroke="#FC6B00" // Adjusted stroke color for UV
                strokeWidth={2} // Increased stroke width for UV
                fillOpacity={1}
                fill="url(#colorUv)"
              />
              <Area
                type="monotone"
                dataKey="الدورات التدريبية"
                stroke="#000000" // Adjusted stroke color for PV
                strokeWidth={2} // Increased stroke width for PV
                fillOpacity={1}
                fill="url(#colorPv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChartOverview;
