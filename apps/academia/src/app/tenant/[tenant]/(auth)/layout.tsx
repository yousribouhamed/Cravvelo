"use client";

import { useTenantThemeStyles } from "@/hooks/use-tenant";
import { useTenantBranding } from "@/hooks/use-tenant";
import { cn } from "@/lib/utils";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authFormStyle } = useTenantThemeStyles();
  const { name } = useTenantBranding();
  const isSplit = authFormStyle === "SPLIT";
  const isCenteredCard = authFormStyle === "CENTERED_CARD";

  if (isSplit) {
    return (
      <div
        className="min-h-screen flex flex-col md:flex-row"
        data-auth-form-style={authFormStyle}
      >
        <div className="hidden md:flex md:w-1/2 bg-primary text-primary-foreground items-center justify-center p-12">
          <div className="max-w-sm text-center">
            <h1 className="text-3xl font-bold">{name || "Academy"}</h1>
            <p className="mt-2 text-primary-foreground/80">
              Sign in to continue your learning
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen flex py-8",
        isCenteredCard && "items-center justify-center bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)]",
        !isCenteredCard && "items-start justify-center",
      )}
      data-auth-form-style={authFormStyle}
    >
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
}
