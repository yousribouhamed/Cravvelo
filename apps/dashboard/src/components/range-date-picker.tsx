"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Calendar } from "@ui/components/ui/calendar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { ar } from "date-fns/locale";

function formatDayInArabic(day) {
  const formattedDate = format(day, "dd MMMM yyyy", { locale: ar });
  return formattedDate;
}

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange?: DateRange;
  dayCount?: number;
  align?: "center" | "start" | "end";
}

export function DatePickerWithRange({
  className,
  dateRange,
  dayCount,
  align = "start",

  ...props
}: DateRangePickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [from, to] = React.useMemo(() => {
    let fromDay: Date | undefined;
    let toDay: Date | undefined;

    if (dateRange) {
      fromDay = dateRange.from;
      toDay = dateRange.to;
    } else if (dayCount) {
      toDay = new Date();
      fromDay = addDays(toDay, -dayCount);
    }

    return [fromDay, toDay];
  }, [dateRange, dayCount]);

  const [date, setDate] = React.useState<DateRange | undefined>({ from, to });

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Update query string
  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        from: date?.from ? format(date.from, "yyyy-MM-dd") : null,
        to: date?.to ? format(date.to, "yyyy-MM-dd") : null,
      })}`,
      {
        scroll: false,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.from, date?.to]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"secondary"}
            className={cn(
              "w-[260px] justify-start text-left gap-x-4 font-normal bg-white rounded-xl border",
              !date && "text-muted-foreground"
            )}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.79785 9.02628C1.79785 7.0303 3.41592 5.41223 5.4119 5.41223H24.3857C26.3817 5.41223 27.9997 7.0303 27.9997 9.02628V24.386C27.9997 26.382 26.3817 28.0001 24.3857 28.0001H5.4119C3.41592 28.0001 1.79785 26.382 1.79785 24.386V9.02628Z"
                stroke="#FC6B00"
                stroke-width="2.62925"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.6709 1.79813V8.12272"
                stroke="#FC6B00"
                stroke-width="2.62925"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22.1272 1.79813V8.12272"
                stroke="#FC6B00"
                stroke-width="2.62925"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.21973 12.6403H22.5794"
                stroke="#FC6B00"
                stroke-width="2.62925"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            {date?.from ? (
              date.to ? (
                <>
                  {formatDayInArabic(date.from)} - {formatDayInArabic(date.to)}
                </>
              ) : (
                formatDayInArabic(date.from)
              )
            ) : (
              <span>تاريخ التقرير</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white shadow-lg" align="start">
          <div dir="ltr">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={ar} // Set the Arabic locale for the calendar
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
