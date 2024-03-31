import type { FC } from "react";
import MaxWidthWrapper from "../max-width-wrapper";
import Link from "next/link";
import Image from "next/image";

const AcademiaFooter: FC = () => {
  return (
    <div className="w-full h-[100px]  bg-white   px-4 border-t">
      <MaxWidthWrapper className="w-full h-full flex items-center justify-between mx-auto ">
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
        <div className="w-fit min-w-[100px] flex justify-end items-center gap-x-4">
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
