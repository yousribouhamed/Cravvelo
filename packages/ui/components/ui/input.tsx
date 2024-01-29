import * as React from "react";

import { cn } from "@ui/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border placeholder:text-[#8A8A8A] border-[#E6E6E6] bg-white dark:bg-white/10 dark:border-black px-3 py-2 text-sm    focus-visible:outline-none   focus:border-[#FC6B00]   transition-all duration-75  focus:border-2  disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
