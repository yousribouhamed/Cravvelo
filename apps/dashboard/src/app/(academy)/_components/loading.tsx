"use client";

import { cn } from "@ui/lib/utils";
import { Loader } from "lucide-react";
import type { FC } from "react";

interface LoadingProps {
  className?: string;
}

const LoadingCard: FC<LoadingProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-full h-full min-h-[100px] min-w-[300px] flex items-center justify-center",
        className
      )}
    >
      <Loader className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
};

export default LoadingCard;
