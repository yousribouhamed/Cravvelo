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
  referralEnabled: boolean;
  displaySalesBanner: boolean;
}

const AcademyHeader: FC<AcademyHeaderProps> = ({
  isAuthanticated,
  student,
  subdomain,
  logo,
  color,
  referralEnabled,
  displaySalesBanner,
}) => {
  return (
    <div
      className={`  w-full   border-b z-[8] fixed top-0 bg-white ${
        displaySalesBanner ? "h-[110px]" : "h-[70px]"
      }  `}
    >
      {displaySalesBanner && <LiarSales />}

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
        <div className="flex w-fit min-w-[100px] justify-end items-center h-[70px] relative">
          <ShoppingCardProduction
            islogged={isAuthanticated && student?.id ? true : false}
            color={color}
            subdomain={subdomain}
          />
          {isAuthanticated && student?.id ? (
            <StudentNav student={student} referralEnabled={referralEnabled} />
          ) : (
            // <StudentNavigation student={student} />

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
