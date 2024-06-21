"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex  items-center justify-center   relative overflow-auto sm:overflow-visible no-visible-scrollbar  rounded-2xl  h-full w-full ",
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
              if (idx === 0) {
                setPaymentType(false);
              } else {
                setPaymentType(true);
              }
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn(
              `relative px-6  py-2 rounded-full  ${
                tab.value === "YEARLY"
                  ? "w-fit flex items-center justify-center gap-x-1"
                  : ""
              }`,
              tabClassName
            )}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.2 }}
                className={cn(
                  "absolute inset-0 bg-gray-200  rounded-full ",
                  activeTabClassName
                )}
              />
            )}
            {tab.value === "YEARLY" && (
              <span
                className={` block z-[99] rounded-xl px-2   ${
                  active.value === tab.value
                    ? "text-primary bg-white"
                    : "text-white bg-primary"
                }`}
              >
                {" "}
                40%{" "}
              </span>
            )}
            <span
              className={`relative block   ${
                active.value === tab.value ? "text-white" : "text-black"
              } `}
            >
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn("mt-32", contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}: {
  className?: string;
  key?: any;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn("w-full h-full absolute top-0 left-0", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
