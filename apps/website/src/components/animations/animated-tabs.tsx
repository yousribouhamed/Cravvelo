"use client";

import { useState } from "react";
import { cn } from "@ui/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  setPaymentType,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  setPaymentType: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);

  const handleTabClick = (tab: Tab, idx: number) => {
    setActive(tab);
    if (idx === 0) {
      setPaymentType(false);
    } else {
      setPaymentType(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center p-2 justify-center relative overflow-auto sm:overflow-visible no-visible-scrollbar rounded-2xl h-full w-full   gap-x-2",
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => handleTabClick(tab, idx)}
            className={cn(
              `relative px-6 py-2 rounded-full transition-all duration-300 ease-in-out ${
                tab.value === "YEARLY"
                  ? "w-fit flex items-center justify-center gap-x-1"
                  : ""
              } ${
                active.value === tab.value
                  ? "bg-[#FC6B00] text-white transform scale-105"
                  : "text-black hover:bg-gray-100"
              }`,
              tabClassName
            )}
          >
            {tab.value === "YEARLY" && (
              <span
                className={`block z-10 rounded-xl px-2 py-1 text-sm font-semibold transition-all duration-300 ${
                  active.value === tab.value
                    ? "text-[#FC6B00] bg-white"
                    : "text-white bg-[#FC6B00]"
                }`}
              >
                10%
              </span>
            )}
            <span className="relative block font-medium">{tab.title}</span>
          </button>
        ))}
      </div>
      {propTabs.map((tab) => (
        <div
          key={tab.value}
          className={cn(
            "w-full h-full transition-opacity duration-300 ease-in-out",
            active.value === tab.value
              ? "opacity-100"
              : "opacity-0 absolute pointer-events-none",
            contentClassName
          )}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
};
