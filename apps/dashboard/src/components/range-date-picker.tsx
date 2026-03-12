"use client";

import * as React from "react";
import { addDays, addWeeks, addMonths, format, startOfDay, endOfDay } from "date-fns";
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
import { ar, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";
import { CalendarIcon } from "lucide-react";

function formatDayInArabic(day: Date) {
  const formattedDate = format(day, "dd MMMM yyyy", { locale: ar });
  return formattedDate;
}

function formatDayInEnglish(day: Date) {
  const formattedDate = format(day, "MMM dd, yyyy", { locale: enUS });
  return formattedDate;
}

// Preset date ranges
type PresetKey = "today" | "7days" | "4weeks" | "3months" | "12months" | "allTime";

interface DatePreset {
  key: PresetKey;
  getRange: () => DateRange;
}

const getPresets = (): DatePreset[] => {
  const today = new Date();
  
  return [
    {
      key: "today",
      getRange: () => ({
        from: startOfDay(today),
        to: endOfDay(today),
      }),
    },
    {
      key: "7days",
      getRange: () => ({
        from: startOfDay(addDays(today, -6)),
        to: endOfDay(today),
      }),
    },
    {
      key: "4weeks",
      getRange: () => ({
        from: startOfDay(addWeeks(today, -4)),
        to: endOfDay(today),
      }),
    },
    {
      key: "3months",
      getRange: () => ({
        from: startOfDay(addMonths(today, -3)),
        to: endOfDay(today),
      }),
    },
    {
      key: "12months",
      getRange: () => ({
        from: startOfDay(addMonths(today, -12)),
        to: endOfDay(today),
      }),
    },
    {
      key: "allTime",
      getRange: () => ({
        from: undefined,
        to: undefined,
      }),
    },
  ];
};

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange?: DateRange;
  dayCount?: number;
  align?: "center" | "start" | "end";
  showPresets?: boolean;
}

export function DatePickerWithRange({
  className,
  dateRange,
  dayCount,
  align = "start",
  showPresets = true,
  ...props
}: DateRangePickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const isRTL = locale === "ar";

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

  // Use URL/props as single source of truth so chart and picker stay in sync when filter changes
  const date: DateRange | undefined = from !== undefined || to !== undefined ? { from, to } : undefined;

  const presets = React.useMemo(() => getPresets(), []);
  const activePreset = React.useMemo((): PresetKey | null => {
    if (from == null && to == null) return "allTime";
    const fromStr = from ? format(from, "yyyy-MM-dd") : null;
    const toStr = to ? format(to, "yyyy-MM-dd") : null;
    for (const preset of presets) {
      const r = preset.getRange();
      const pFrom = r.from ? format(r.from, "yyyy-MM-dd") : null;
      const pTo = r.to ? format(r.to, "yyyy-MM-dd") : null;
      if (fromStr === pFrom && toStr === pTo) return preset.key;
    }
    return null;
  }, [from?.getTime(), to?.getTime(), presets]);

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

  // On mount: if URL has no from/to but we have a range from props (e.g. default 12 months), write to URL so chart refetches
  React.useEffect(() => {
    if (!searchParams?.get("from") && !searchParams?.get("to") && (from || to)) {
      const fromStr = from ? format(from, "yyyy-MM-dd") : null;
      const toStr = to ? format(to, "yyyy-MM-dd") : null;
      router.replace(`${pathname}?${createQueryString({ from: fromStr, to: toStr })}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle preset click: update URL so chart refetches with new range
  const handlePresetClick = (preset: DatePreset) => {
    const range = preset.getRange();
    const fromStr = range.from ? format(range.from, "yyyy-MM-dd") : null;
    const toStr = range.to ? format(range.to, "yyyy-MM-dd") : null;
    router.replace(`${pathname}?${createQueryString({ from: fromStr, to: toStr })}`, { scroll: false });
  };

  // Preset labels
  const presetLabels: Record<PresetKey, string> = {
    today: t("presets.today"),
    "7days": t("presets.7days"),
    "4weeks": t("presets.4weeks"),
    "3months": t("presets.3months"),
    "12months": t("presets.12months"),
    allTime: t("presets.allTime"),
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-2", className)} {...props}>
      {/* Preset Buttons */}
      {showPresets && (
        <div className={cn(
          "flex flex-wrap gap-1",
          isRTL && "flex-row-reverse"
        )}>
          {presets.map((preset) => (
            <Button
              key={preset.key}
              variant={activePreset === preset.key ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className={cn(
                "h-8 px-3 text-xs font-medium transition-colors",
                activePreset === preset.key
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-white dark:bg-card border-gray-200 dark:border-border text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-accent"
              )}
            >
              {presetLabels[preset.key]}
            </Button>
          ))}
        </div>
      )}

      {/* Calendar Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-fit justify-start text-left gap-x-2 font-normal",
              "bg-white dark:bg-card border-gray-200 dark:border-border",
              "text-gray-700 dark:text-gray-300",
              "hover:bg-gray-100 dark:hover:bg-accent",
              "rounded-lg h-8 px-3",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4 text-orange-500" />
            <span className="hidden md:block text-xs" dir={isRTL ? "rtl" : "ltr"}>
              {date?.from ? (
                date.to ? (
                  <>
                    {isRTL
                      ? formatDayInArabic(date.from)
                      : formatDayInEnglish(date.from)}{" "}
                    -{" "}
                    {isRTL
                      ? formatDayInArabic(date.to)
                      : formatDayInEnglish(date.to)}
                  </>
                ) : (
                  isRTL
                    ? formatDayInArabic(date.from)
                    : formatDayInEnglish(date.from)
                )
              ) : (
                <>{t("dateRange")}</>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn(
            "w-auto p-0",
            "bg-white dark:bg-card",
            "border border-gray-200 dark:border-border",
            "shadow-lg"
          )} 
          align={isRTL ? "end" : "start"}
          side={isRTL ? "left" : "right"}
        >
          <div dir="ltr">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(newDate) => {
                if (newDate?.from) {
                  const fromStr = format(newDate.from, "yyyy-MM-dd");
                  const toStr = newDate.to ? format(newDate.to, "yyyy-MM-dd") : fromStr;
                  router.replace(`${pathname}?${createQueryString({ from: fromStr, to: toStr })}`, { scroll: false });
                }
              }}
              numberOfMonths={2}
              locale={isRTL ? ar : enUS}
              className={cn(
                "bg-white dark:bg-card",
                "[&_.rdp-day_selected]:bg-primary [&_.rdp-day_selected]:text-white [&_.rdp-day_selected:hover]:bg-primary/90",
                "[&_.rdp-day_range_middle]:bg-primary/15 [&_.rdp-day_range_middle]:text-foreground",
                "[&_.rdp-day_button]:dark:text-foreground",
                "[&_.rdp-day_button:hover]:dark:bg-accent",
                "[&_.rdp-day_button.rdp-day_selected]:dark:bg-primary",
                "[&_.rdp-caption_label]:dark:text-foreground",
                "[&_.rdp-head_cell]:dark:text-muted-foreground",
                "[&_.rdp-button]:dark:hover:bg-accent",
                "[&_.rdp-nav_button]:dark:text-foreground",
                "[&_.rdp-nav_button:hover]:dark:bg-accent"
              )}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Standalone preset buttons component for flexibility
interface DatePresetsProps {
  onPresetSelect: (range: DateRange) => void;
  activePreset?: PresetKey | null;
  className?: string;
}

export function DatePresets({ onPresetSelect, activePreset, className }: DatePresetsProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const presets = React.useMemo(() => getPresets(), []);

  const presetLabels: Record<PresetKey, string> = {
    today: t("presets.today"),
    "7days": t("presets.7days"),
    "4weeks": t("presets.4weeks"),
    "3months": t("presets.3months"),
    "12months": t("presets.12months"),
    allTime: t("presets.allTime"),
  };

  return (
    <div className={cn(
      "flex flex-wrap gap-1",
      isRTL && "flex-row-reverse",
      className
    )}>
      {presets.map((preset) => (
        <Button
          key={preset.key}
          variant={activePreset === preset.key ? "default" : "outline"}
          size="sm"
          onClick={() => onPresetSelect(preset.getRange())}
          className={cn(
            "h-8 px-3 text-xs font-medium transition-colors",
            activePreset === preset.key
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-white dark:bg-card border-gray-200 dark:border-border text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-accent"
          )}
        >
          {presetLabels[preset.key]}
        </Button>
      ))}
    </div>
  );
}
