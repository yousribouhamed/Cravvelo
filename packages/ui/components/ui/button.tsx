import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { CravveloSpinner } from "../cravvelo-spinner";
import { cn } from "@ui/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[#FC6B00] text-white shadow-xs hover:bg-[#FC6B00]/90 dark:bg-[#FC6B00] dark:text-white dark:hover:bg-[#FC6B00]/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/90",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary dark:bg-white/20 text-secondary-foreground shadow-xs hover:bg-secondary/80 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 dark:text-foreground",
        link: "text-[#FC6B00] underline-offset-4 hover:underline dark:text-blue-400 dark:hover:text-blue-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Helper function to get spinner color based on variant
const getSpinnerColor = (variant: string | null | undefined) => {
  switch (variant) {
    case "outline":
    case "ghost":
      return "currentColor";
    case "link":
      return "currentColor";
    default:
      return "white";
  }
};

// Helper function to get spinner size based on button size
const getSpinnerSize = (size: string | null | undefined) => {
  switch (size) {
    case "sm":
      return 14;
    case "lg":
      return 18;
    case "icon":
      return 16;
    default:
      return 16;
  }
};

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <CravveloSpinner
            size={getSpinnerSize(size)}
            color={getSpinnerColor(variant)}
          />
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
