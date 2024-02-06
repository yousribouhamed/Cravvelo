import type { FC } from "react";

interface ThemeFooterProps {}

const ThemeFooter: FC = ({}) => {
  return (
    <div className="w-full h-[100px] flex bg-white items-center justify-between mb-12 px-4 border-t">
      <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
        يعمل بواسطة{" "}
        <a href="#" className="font-semibold text-primary">
          <span className="absolute inset-0" aria-hidden="true" />
          جدير
        </a>
      </div>
      <div className="w-fit min-w-[100px] flex justify-end items-center gap-x-4">
        <button>سياسة الخصوصية</button>
        <button>شروط الاستخدام</button>
      </div>
    </div>
  );
};

export default ThemeFooter;
