import AppCardSkeleton from "./skeleton-card";

type Props = {
  /** how many cards to render */
  count?: number;
};

export default function ApplicationsBoardSkeleton({ count = 6 }: Props) {
  return (
    <div
      className="w-full h-fit min-h-[300px] grid grid-cols-1 md:grid-cols-2 gap-4"
      dir="rtl"
    >
      {Array.from({ length: count }).map((_, i) => (
        <AppCardSkeleton key={i} />
      ))}
    </div>
  );
}
