"use client";

import { Button, buttonVariants } from "@ui/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export default function StoreCheckoutError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-screen flex items-center  flex-col gap-y-8 justify-center pt-12">
      <div className="w-[400px] h-[350px] flex items-center justify-center">
        <Image
          src="/error.svg"
          alt="this is the error page"
          width={400}
          height={400}
        />
      </div>
      <div className="w-[600px] h-[300px]">
        <h1 className="text-xl font-bold text-center">
          {error?.name
            ? error?.name
            : "هناك خطأ يرجى الاتصال بالدعم إذا استمرت المشكلة"}
        </h1>
        <p className="text-xl text-gray-600 text-center">{error?.message}</p>
        <div className="w-full h-[100px] flex items-center justify-center gap-x-8">
          <Button size="lg" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
          <Link
            href={"/"}
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            الذهاب إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
