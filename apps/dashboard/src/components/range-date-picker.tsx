"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import {
  addDays,
  endOfDay,
  startOfDay,
  startOfYear,
  startOfMonth,
  endOfMonth,
  endOfYear,
  addMonths,
  addYears,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays,
} from "date-fns";
import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import arLocale from "date-fns/locale/ar-DZ"; // Adjust the locale code based on your needs
import { DefinedRange } from "react-date-range";
import { Button } from "@ui/components/ui/button";

const RangeDatePicker: FC = ({}) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  // Custom translation function for sidebar labels
  const translateSidebarLabel = (labelKey: string) => {
    const translations = {
      "Start Date": "تاريخ البداية",
      "End Date": "تاريخ الانتهاء",
      "Date Range": "نطاق التاريخ",
      "Last 7 Days": "آخر 7 أيام",
      "Last 30 Days": "آخر 30 يومًا",
      "This Month": "هذا الشهر",
      "Last Month": "الشهر الماضي",
      "This Year": "هذا العام",
      "Last Year": "العام الماضي",
    };

    return translations[labelKey] || labelKey;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lg">
          <span>تاريخ التقرير</span>
          <div className="w-[200px] h-[40px] rounded-xl border-2 flex items-center justify-start gap-x-4">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.79785 9.02628C1.79785 7.0303 3.41592 5.41223 5.4119 5.41223H24.3857C26.3817 5.41223 27.9997 7.0303 27.9997 9.02628V24.386C27.9997 26.382 26.3817 28.0001 24.3857 28.0001H5.4119C3.41592 28.0001 1.79785 26.382 1.79785 24.386V9.02628Z"
                stroke="#43766C"
                stroke-width="2.62925"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.6709 1.79813V8.12272"
                stroke="#43766C"
                stroke-width="2.62925"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22.1272 1.79813V8.12272"
                stroke="#43766C"
                stroke-width="2.62925"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.21973 12.6403H22.5794"
                stroke="#43766C"
                stroke-width="2.62925"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span>29 ديسمبر 2023 - 04 يناير 2024</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[1000px] h-[500px] p-0 ">
        <div dir="ltr" className="w-full h-full relative  flex justify-center">
          <DateRangePicker
            editableDateInputs={false} // Set this to hide the input dates
            onChange={(item) => setState([item.selection])}
            showSelectionPreview={false}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={state}
            direction="horizontal"
            rangeColors={["#43766C"]}
            showDateDisplay={false}
            locale={arLocale} // Set the locale to Arabic
            disabledDates={[]}
            renderStaticRangeLabel={renderStaticRangeLabel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RangeDatePicker;

const renderStaticRangeLabel = () => (
  <CustomStaticRangeLabelContent text={"This is a custom label content: "} />
);

const CustomStaticRangeLabelContent = ({ text }: { text: string }) => {
  return (
    <span>
      <i>{text}</i>
      <span className={"random-date-string text-xl font-bold"}>
        <b>{text}</b>
      </span>
    </span>
  );
};
