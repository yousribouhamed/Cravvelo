import { cn } from "@ui/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full  lg:max-w-screen-2xl px-2.5 overflow-visible-2000 h-fit md:px-20",

        className
      )}
    
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
