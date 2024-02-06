import type { FC } from "react";
import MaxWidthWrapper from "../_components/max-width-wrapper";

const ThemeFooterProduction: FC = ({}) => {
  return (
    <div className="w-full h-[100px]  bg-white  mb-12 px-4 border-t">
      <MaxWidthWrapper className="w-full h-full flex items-center justify-between mx-auto ">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          يعمل بواسطة{" "}
          <a
            href="https://jadara.vercel.app"
            className="font-semibold text-primary"
          >
            <span className="absolute inset-0" aria-hidden="true" />
            جدير
          </a>
        </div>
        <div className="w-fit min-w-[100px] flex justify-end items-center gap-x-4">
          <button>سياسة الخصوصية</button>
          <button>شروط الاستخدام</button>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default ThemeFooterProduction;
