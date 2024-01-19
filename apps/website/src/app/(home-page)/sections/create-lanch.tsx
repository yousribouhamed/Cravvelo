import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import TextTyper from "@/src/components/text-typer";
import type { FC } from "react";

interface CreateLanchAbdullahProps {}

const CreateLanch: FC = ({}) => {
  return (
    <MaxWidthWrapper className="my-6">
      <div className="w-full h-[300px]  grid grid-cols-2 ">
        <div className="w-full h-full ">
          <h1 className="mt-12 text-[49px]  text-right  qatar-bold font-bold tracking-tight text-black sm:text-4xl">
            أنشئ، وأطلق
            <TextTyper />
          </h1>

          <p className="mt-6   text-[25px] font-thin    text-start text-black">
            من البناء بلا برمجة إلى التسويق والبيع بدون خبرة، مساق توفّر لك كل
            الأدوات التي تحتاجها لإنشاء منصتك التعليمية وتنمية أعمالك عبر
            الإنترنت.
          </p>
        </div>
        <div className=" border border-[#FFB800] rounded-lg p-2 col-span-1">
          <div className="w-full h-full bg-[#8000FF]" />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CreateLanch;
