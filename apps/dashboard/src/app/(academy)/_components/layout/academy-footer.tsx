import type { FC } from "react";
import MaxWidthWrapper from "../max-width-wrapper";
import Link from "next/link";

const AcademiaFooter: FC = ({}) => {
  return (
    <div className="w-full h-[100px]  bg-white   px-4 border-t">
      <MaxWidthWrapper className="w-full h-full flex items-center justify-between mx-auto ">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          يعمل بواسطة{" "}
          <a
            href="https://www.cravvelo.com"
            className="font-semibold text-primary"
          >
            <span className="absolute inset-0" aria-hidden="true" />
            cravvelo
          </a>
        </div>
        <div className="w-fit min-w-[100px] flex justify-end items-center gap-x-4">
          <Link href="/privacy-policy">
            <button className="text-sm text-gray-700"> سياسة الاكاديمية</button>
          </Link>
          <Link href="/terms-of-use">
            <button className="text-sm text-gray-700">اتصل بنا</button>
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
