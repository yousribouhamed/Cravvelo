import { cn } from "@ui/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#EFEFEF] ", className)}
      {...props}
    />
  );
}

export { Skeleton };
