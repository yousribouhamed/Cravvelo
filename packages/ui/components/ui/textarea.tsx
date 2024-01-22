import * as React from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

import { cn } from "@ui/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextareaAutosize
        className={cn(
          "flex h-12 w-full rounded-lg border  border-[#E6E6E6] bg-white px-3 py-2 text-sm   placeholder:text-[#8A8A8A] focus-visible:outline-none   focus:border-[#43766C]   transition-all duration-75  focus:border-2  disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
