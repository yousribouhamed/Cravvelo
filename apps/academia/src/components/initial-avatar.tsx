import { cn } from "@/lib/utils";

interface InitialAvatarProps {
  letter: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-10 h-10 text-base",
  md: "w-16 h-16 text-2xl",
  lg: "w-24 h-24 text-4xl",
};

export function InitialAvatar({
  letter,
  className,
  size = "lg",
}: InitialAvatarProps) {
  const initial = (letter || "?").trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "rounded-full bg-white/20 dark:bg-gray-700/50 flex items-center justify-center font-bold text-white shrink-0",
        sizeClasses[size],
        className
      )}
      aria-hidden
    >
      {initial}
    </div>
  );
}
