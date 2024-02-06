import { Search } from "lucide-react";
import type { FC } from "react";
import ShoppingCard from "./interactive/shopping-card";

const ThemeHeader: FC = ({}) => {
  return (
    <div className="w-full h-[70px] flex items-center justify-between px-4 border-b z-[20] ">
      <div className="min-w-[200px] w-fit flex items-center justify-start gap-x-4 ">
        <img
          src="https://png.pngtree.com/png-clipart/20230330/original/pngtree-vector-sword-esports-and-mascot-logo-png-image_9012921.png"
          className="object-cover w-16 h-16"
        />
        <button className="text-lg font-semibold">الصفحة الرئيسية</button>
        <button className="text-lg font-semibold">الدورات</button>
      </div>
      <div className="flex w-fir min-w-[100px] justify-end items-center">
        <ShoppingCard />
        <button className="text-black w-[40px] h-[40px] rounded-xl p-2">
          <Search className="w-5 h-5 " />
        </button>
        <button className="bg-blue-500 text-white w-[140px] h-[40px] rounded-xl p-2">
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default ThemeHeader;
