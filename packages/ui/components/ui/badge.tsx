import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ui/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white hover:bg-blue-700 " +
          "dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-800 hover:bg-zinc-200 " +
          "dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700 " +
          "dark:bg-red-500 dark:text-white dark:hover:bg-red-600",
        success:
          "border-transparent bg-green-600 text-white hover:bg-green-700 " +
          "dark:bg-green-500 dark:text-white dark:hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 " +
          "dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700",
        outline:
          "border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-50 " +
          "dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800",
        purple:
          "border-transparent bg-purple-600 text-white hover:bg-purple-700 " +
          "dark:bg-purple-500 dark:text-white dark:hover:bg-purple-600",
        indigo:
          "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 " +
          "dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
