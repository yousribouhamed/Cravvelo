"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { isAuthenticationError } from "@/src/lib/auth-error-utils";

export default function InvoiceDetailsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    console.error(error);

    if (isAuthenticationError(error)) {
      router.push("/sign-in");
    }
  }, [error, router]);

  return (
    <div className="w-full min-h-[70vh] flex items-center flex-col gap-y-8 justify-center pt-12">
      <div className="w-[280px] h-[220px] flex items-center justify-center">
        <Image
          src="/error.svg"
          alt="Invoice details error"
          width={180}
          height={180}
        />
      </div>

      <div className="w-full max-w-xl px-4">
        <h1 className="text-xl font-bold text-center">
          حدث خطأ أثناء تحميل تفاصيل الفاتورة
        </h1>
        <p className="text-sm text-gray-600 text-center mt-2 break-words">
          {error?.message}
        </p>

        <div className="w-full flex items-center justify-center gap-x-4 mt-6">
          <Button size="lg" onClick={() => reset()}>
            إعادة المحاولة
          </Button>
          <Link
            href="/settings/invoices"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            العودة إلى الفواتير
          </Link>
        </div>
      </div>
    </div>
  );
}

