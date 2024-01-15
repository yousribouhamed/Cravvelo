"use client";

import { Card, CardContent } from "@ui/components/ui/card";
import { AreaChart } from "@ui/lib/tremor";
import type { FC } from "react";

const chartdata = [
  {
    date: "Jan 22",
    "الدورات التدريبية": 2890,
    "المنتجات الرقمية": 2338,
  },
  {
    date: "Feb 22",
    "الدورات التدريبية": 2756,
    "المنتجات الرقمية": 2103,
  },
  {
    date: "Mar 22",
    "الدورات التدريبية": 3322,
    "المنتجات الرقمية": 2194,
  },
  {
    date: "Apr 22",
    "الدورات التدريبية": 3470,
    "المنتجات الرقمية": 2108,
  },
  {
    date: "May 22",
    "الدورات التدريبية": 3475,
    "المنتجات الرقمية": 1812,
  },
  {
    date: "Jun 22",
    "الدورات التدريبية": 3129,
    "المنتجات الرقمية": 1726,
  },
];

interface AreaChartAbdullahProps {}

const AreaChartOverview: FC = ({}) => {
  return (
    <Card className="col-span-2 w-full h-full p-0">
      <CardContent className="p-0 w-full h-full">
        <AreaChart
          className="h-full"
          data={chartdata}
          index="date"
          yAxisWidth={65}
          categories={["الدورات التدريبية", "المنتجات الرقمية"]}
          colors={["teal", "yellow"]}
        />
      </CardContent>
    </Card>
  );
};

export default AreaChartOverview;
