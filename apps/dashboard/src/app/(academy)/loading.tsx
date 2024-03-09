import type { FC } from "react";
import LoadingCard from "./_components/loading";

const Loading: FC = ({}) => {
  return (
    <div
      aria-label="Loading"
      aria-describedby="loading-description"
      className="w-full h-screen flex flex-col items-center justify-center gap-y-4"
    >
      <LoadingCard />
    </div>
  );
};

export default Loading;
