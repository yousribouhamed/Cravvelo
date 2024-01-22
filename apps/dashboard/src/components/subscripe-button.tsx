"use client";

import { Button } from "@ui/components/ui/button";
import { X } from "lucide-react";
import type { FC } from "react";
import React from "react";

const SubscripeButton: FC = ({}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      onClick={() => setIsOpen(true)}
      className={`w-[300px]  bg-black rounded-lg flex items-center justify-center absolute bottom-[3.4rem] left-24 cursor-pointer hover:scale-105 transition-all duration-150 shadow ${
        isOpen ? "h-[400px]" : "h-[60px]"
      }`}
    >
      {!open ? (
        <span className="text-white text-xl font-bold">subscripe now</span>
      ) : (
        <div className="w-full h-full flex flex-col justify-start p-4">
          <div className="flex justify-between items-center w-full h-[50px]  ">
            <Button
              onClick={() => setIsOpen(false)}
              size="icon"
              variant="ghost"
              className="hover:bg-transparent bg-transparent"
            >
              <X className="text-white w-4 h-4" />
            </Button>
            <span className="text-white text-lg text-start">subscripe now</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscripeButton;
