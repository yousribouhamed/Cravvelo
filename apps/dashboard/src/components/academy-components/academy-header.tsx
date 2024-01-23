import type { FC } from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Button } from "@ui/components/ui/button";

interface AcademyHeaderAbdullahProps {}

const AcademyHeader: FC = ({}) => {
  return (
    <MaxWidthWrapper>
      <div className="w-full h-[70px] border-b flex justify-between items-center">
        <span className="text-green-500 font-bold text-xl ">Your logo</span>
        <div className="w-[200px] h-full">
          <Button>mune</Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default AcademyHeader;
