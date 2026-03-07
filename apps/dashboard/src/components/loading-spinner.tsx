import { cn } from "@ui/lib/utils";

const ORANGE_FILTER =
  "brightness(0) saturate(100%) invert(55%) sepia(98%) saturate(1500%) hue-rotate(360deg)";

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
};

export function LoadingSpinner({ size = 96, className }: LoadingSpinnerProps) {
  return (
    <img
      src="/spinner.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ filter: ORANGE_FILTER }}
    />
  );
}
