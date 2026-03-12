"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--primary)",
          "--success-text": "var(--primary-foreground)",
          "--success-border": "var(--border)",
          "--error-bg": "var(--destructive)",
          "--error-text": "var(--primary-foreground)",
          "--error-border": "var(--border)",
          "--info-bg": "var(--accent)",
          "--info-text": "var(--accent-foreground)",
          "--info-border": "var(--border)",
          "--warning-bg": "var(--secondary)",
          "--warning-text": "var(--secondary-foreground)",
          "--warning-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
