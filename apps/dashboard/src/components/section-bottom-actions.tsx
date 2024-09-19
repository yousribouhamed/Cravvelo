import type { ReactNode } from "react";
import { cn } from "@ui/lib/utils";

const SectionBottomActions = ({
  align = "start",
  children,
  className,
}: {
  align?: "start" | "end";
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "border-subtle bg-muted flex rounded-b-lg border px-6 py-4",
        align === "end" && "justify-end",
        className
      )}
    >
      {children}
    </div>
  );
};

export default SectionBottomActions;
