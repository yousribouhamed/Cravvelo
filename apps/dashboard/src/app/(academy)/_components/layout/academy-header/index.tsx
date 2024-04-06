import type { FC } from "react";
import ShoppingCardProduction from "./shopping-bag";
import Link from "next/link";
import MobilNavgiationProduction from "./mobil-navbar";
import MaxWidthWrapper from "../../max-width-wrapper";
import LinksNavbar from "./links-navbar";
import StudentNav from "../../auth/student-nav";
import type { Student } from "database";
import LiarSales from "../../Liar-sales";

interface AcademyHeaderProps {
  isAuthanticated: boolean;
  student: Student | null;
  subdomain: string | null;
  logo: string | null;
  color: string;
}

const AcademyHeader: FC<AcademyHeaderProps> = ({
  isAuthanticated,
  student,
  subdomain,
  logo,
  color,
}) => {
  return (
    <div className="w-full h-[110px]   border-b z-[8] fixed top-0 bg-white shadow overflow-y-hidden">
      <LiarSales />
      <MaxWidthWrapper className="w-full h-[70px] flex items-center justify-between">
        <div className="w-fit h-full flex items-center justify-start md:hidden">
          <MobilNavgiationProduction />
        </div>
        <div className="min-w-[200px] w-fit  items-center justify-start gap-x-4 hidden md:flex h-full">
          {logo && (
            <img alt="logo" src={logo} className="object-cover w-12 h-12" />
          )}
          <LinksNavbar />
        </div>
        <div className="flex w-fir min-w-[100px] justify-end items-center">
          <ShoppingCardProduction color={color} subdomain={subdomain} />
          {/* <button className="text-black w-[40px] h-[40px] rounded-xl p-2">
            <Search className="w-5 h-5 " />
          </button> */}
          {isAuthanticated ? (
            student && <StudentNav student={student} />
          ) : (
            <Link
              href={"/auth-academy/sign-in"}
              className=" text-white w-[140px] h-[40px] rounded-lg p-2 flex items-center justify-center hover:bg-orange-700 transition-all duration-300"
              style={{
                background: color ?? "#FC6B00",
              }}
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
