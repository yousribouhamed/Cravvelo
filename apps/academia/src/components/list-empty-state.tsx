import Link from "next/link";
import { ReactNode } from "react";

interface ListEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function ListEmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: ListEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-muted-foreground [&>svg]:h-14 [&>svg]:w-14">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
