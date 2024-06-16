"use client";

import React from "react";
import CountUp from "react-countup";
import { formatDZD } from "../lib/utils";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white  max-w-xs rounded-xl shadow">
        <div className="w-full h-[30px] flex items-center justify-end p-4 bg-gray-100 ">
          <p className="label">{`${label}`}</p>
        </div>
        <div className="w-full h-[100px] p-4 flex flex-col gap-y-2">
          {payload.map((entry: any, index: number) => (
            <div
              key={`item-${index}`}
              className="flex items-center justify-start gap-x-2 "
            >
              <p className="text-sm font-bold text-black">
                <CountUp
                  preserveValue
                  start={0}
                  end={entry.value}
                  decimals={2}
                  formattingFn={formatDZD}
                />
              </p>

              <div className="flex items-center justify-start ">
                <p className="text-xs text-gray-500"> {`: ${entry.name}`}</p>
                <div
                  className="w-3 h-3 rounded-full ml-2"
                  style={{ backgroundColor: entry.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
