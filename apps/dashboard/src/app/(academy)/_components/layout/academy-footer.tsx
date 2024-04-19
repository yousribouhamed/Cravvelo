import type { FC } from "react";
import MaxWidthWrapper from "../max-width-wrapper";
import Link from "next/link";
import Image from "next/image";

const AcademiaFooter: FC = () => {
  return (
    <div className="w-full  h-[170px] sm:min-h-[100px] sm:h-fit  bg-white   px-4 pt-4 sm:pt-0 border-t">
      <MaxWidthWrapper className="w-full h-full flex  flex-col sm:flex-row items-center justify-start sm:justify-between mx-auto ">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 flex items-center gap-x-2">
          يعمل بواسطة{" "}
          <a
            href="https://www.cravvelo.com"
            className="font-semibold text-primary"
          >
            <Image
              src="/cravvelo-logo.svg"
              alt="cravvelo logo"
              width={60}
              height={12}
            />
          </a>
        </div>
        <div className="w-fit min-w-[100px] flex flex-wrap h-[100px] justify-center sm:justify-end items-center gap-x-4">
          <Link href="/privacy-policy">
            <button className="text-sm text-gray-700"> سياسة الاكاديمية</button>
          </Link>
          <Link href="/privacy-policy/contact-us">
            <button className="text-sm text-gray-700">تواصل معنا</button>
          </Link>

          <span className="text-sm text-gray-700">
            جميع الحقوق محفوظة في الأكاديمية © 2024
          </span>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default AcademiaFooter;
