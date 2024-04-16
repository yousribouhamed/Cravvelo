import type { FC } from "react";
import Image from "next/image";

const Suspanded: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center  flex-col gap-y-8 justify-center pt-12">
      <div className="w-[400px] h-[350px] flex items-center justify-center">
        <Image
          src="/suspanded.svg"
          alt="this is the error page"
          width={250}
          height={250}
        />
      </div>
      <div className="w-[600px] h-[300px]">
        <h1 className="text-xl font-bold text-center">
          قررنا ايقاف الأكاديمية الخاصة بكم
        </h1>
      </div>
    </div>
  );
};

export default Suspanded;
