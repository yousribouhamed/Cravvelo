import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminPageShellProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export function AdminPageShell({
  title,
  description,
  className,
  children,
}: AdminPageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-4 py-6 md:px-6 md:py-8",
        className
      )}
    >
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-[#18181b] dark:text-zinc-100">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-[#3f3f46] dark:text-zinc-400">{description}</p>
        )}
      </header>
      {children}
    </div>
  );
}
