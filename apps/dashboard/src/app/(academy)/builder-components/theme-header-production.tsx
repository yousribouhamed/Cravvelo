import type { FC } from "react";

const ThemeHeaderProduction: FC = ({}) => {
  return (
    <div className="w-full h-[70px] flex items-center justify-between px-4 border-b">
      <button className="bg-blue-500 text-white w-[150px] h-[50px] rounded-xl p-2">
        تسجيل الدخول
      </button>
      <div className="min-w-[200px] w-fit flex items-center justify-start gap-x-4 ">
        <button>الدورات</button>
        <button>الصفحة الرئيسية</button>
      </div>
    </div>
  );
};

export default ThemeHeaderProduction;
