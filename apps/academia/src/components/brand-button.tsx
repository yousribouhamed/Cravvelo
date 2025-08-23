"use client";

import { useTenantBranding } from "@/hooks/use-tenant";
import { Button, buttonVariants } from "./ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { type VariantProps } from "class-variance-authority";

interface BrandButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
  loading?: boolean;
}

const BrandButton = forwardRef<HTMLButtonElement, BrandButtonProps>(
  (
    {
      className,
      children,
      variant = "default",
      size = "default",
      asChild = false,
      style,
      loading = false,
      ...props
    },
    ref
  ) => {
    const { primaryColor, primaryColorDark } = useTenantBranding();
    const { theme, resolvedTheme } = useTheme();

    // Determine if we're in dark mode
    const isDarkMode =
      resolvedTheme === "dark" ||
      (theme === "system" && resolvedTheme === "dark");

    // Use appropriate color based on theme
    const brandColor = isDarkMode ? primaryColorDark : primaryColor;

    // Function to determine if a color is dark
    const isColorDark = (color: string): boolean => {
      // Convert hex to RGB
      const hex = color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Calculate relative luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      return luminance < 0.5;
    };

    // Determine text color based on background
    const textColor = isColorDark(brandColor) ? "#ffffff" : "#000000";

    // Create hover and active variations
    const adjustBrightness = (color: string, percent: number): string => {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;

      return (
        "#" +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    };

    const hoverColor = adjustBrightness(
      brandColor,
      isColorDark(brandColor) ? 15 : -10
    );
    const activeColor = adjustBrightness(
      brandColor,
      isColorDark(brandColor) ? 25 : -20
    );

    return (
      <Button
        loading={loading}
        ref={ref}
        variant={variant}
        className={cn(
          // Override default button styles when using brand colors
          variant === "default" && "border-0",
          className
        )}
        style={
          {
            backgroundColor: brandColor,
            color: textColor,
            borderColor: brandColor,
            // CSS custom properties for hover/active states
            "--hover-bg": hoverColor,
            "--active-bg": activeColor,
          } as React.CSSProperties & Record<string, string>
        }
        onMouseEnter={(e) => {
          if (variant === "default") {
            (e.target as HTMLElement).style.backgroundColor = hoverColor;
          }
        }}
        onMouseLeave={(e) => {
          if (variant === "default") {
            (e.target as HTMLElement).style.backgroundColor = brandColor;
          }
        }}
        onMouseDown={(e) => {
          if (variant === "default") {
            (e.target as HTMLElement).style.backgroundColor = activeColor;
          }
        }}
        onMouseUp={(e) => {
          if (variant === "default") {
            (e.target as HTMLElement).style.backgroundColor = hoverColor;
          }
        }}
        {...props}
      >
        {children || "I am brand"}
      </Button>
    );
  }
);

BrandButton.displayName = "BrandButton";

export default BrandButton;
