import type { FC } from "react";

interface SuspandedProps {}

const Suspanded: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <h2 className="text-xl font-bold text-black">
        قررنا وقف الأكاديمية الخاصة بك و لن نخبرك بالسبب
      </h2>
    </div>
  );
};

export default Suspanded;
