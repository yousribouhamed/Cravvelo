import type { FC } from "react";

interface SiteFooterAbdullahProps {}

const SiteFooter: FC = ({}) => {
  return (
    <div className="w-full mt-8 py-8 h-[600px] overflow-x-hidden bg-[#43766C] flex flex-col items-center gap-y-6">
      <h2 className="text-center font-bold text-white text-5xl">footer</h2>
    </div>
  );
};

export default SiteFooter;
