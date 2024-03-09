import type { FC } from "react";
import LoadingCard from "../../../_components/loading";

const Page: FC = ({}) => {
  return (
    <div className="  w-full h-fit min-h-screen flex flex-col lg:flex-row  justify-between gap-x-4 items-start py-4">
      <LoadingCard />
    </div>
  );
};

export default Page;
