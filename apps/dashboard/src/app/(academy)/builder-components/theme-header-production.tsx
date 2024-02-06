import type { FC } from "react";
import ShoppingCardProduction from "./theme-actions/shopping-card-production";
import { Search } from "lucide-react";
import Link from "next/link";

const ThemeHeaderProduction: FC = ({}) => {
  return (
    <div className="w-full h-[70px] flex items-center justify-between px-4 border-b z-[20] ">
      <div className="min-w-[200px] w-fit flex items-center justify-start gap-x-4 ">
        <img
          src="https://png.pngtree.com/png-clipart/20230330/original/pngtree-vector-sword-esports-and-mascot-logo-png-image_9012921.png"
          className="object-cover w-16 h-16"
        />
        <Link href={"/"} className="text-lg font-semibold">
          الصفحة الرئيسية
        </Link>
        <Link href={"/courses"} className="text-lg font-semibold">
          الدورات
        </Link>
      </div>
      <div className="flex w-fir min-w-[100px] justify-end items-center">
        <ShoppingCardProduction />
        <button className="text-black w-[40px] h-[40px] rounded-xl p-2">
          <Search className="w-5 h-5 " />
        </button>
        <Link
          href={"/signin"}
          className="bg-blue-500 text-white w-[140px] h-[40px] rounded-xl p-2"
        >
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
};

export default ThemeHeaderProduction;
