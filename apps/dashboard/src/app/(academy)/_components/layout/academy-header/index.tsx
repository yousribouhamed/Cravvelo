import type { FC } from "react";
import ShoppingCardProduction from "./shopping-bag";
import { Search } from "lucide-react";
import Link from "next/link";
import MobilNavgiationProduction from "./mobil-navbar";
import MaxWidthWrapper from "../../max-width-wrapper";
import LinksNavbar from "./links-navbar";
import StudentNav from "../../auth-comppnent/student-nav";
import type { Student } from "@/src/types";

interface AcademyHeaderProps {
  isAuthanticated: boolean;
  student: Student;
}

const AcademyHeader: FC<AcademyHeaderProps> = ({
  isAuthanticated,
  student,
}) => {
  return (
    <div className="w-full h-[70px]   border-b z-[80] fixed top-0 bg-white shadow ">
      <MaxWidthWrapper className="w-full h-full flex items-center justify-between">
        <div className="w-fit h-full flex items-center justify-start md:hidden">
          <MobilNavgiationProduction />
        </div>
        <div className="min-w-[200px] w-fit  items-center justify-start gap-x-4 hidden md:flex ">
          <img
            src="https://png.pngtree.com/png-clipart/20230330/original/pngtree-vector-sword-esports-and-mascot-logo-png-image_9012921.png"
            className="object-cover w-16 h-16"
          />

          <LinksNavbar />
        </div>
        <div className="flex w-fir min-w-[100px] justify-end items-center">
          <ShoppingCardProduction />
          <button className="text-black w-[40px] h-[40px] rounded-xl p-2">
            <Search className="w-5 h-5 " />
          </button>
          {isAuthanticated ? (
            <StudentNav student={student} />
          ) : (
            <Link
              href={"/auth-academy/sign-in"}
              className="bg-blue-500 text-white w-[140px] h-[40px] rounded-xl p-2 flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all duration-300"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default AcademyHeader;
