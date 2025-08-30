import { buttonVariants } from "@ui/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full  h-screen flex items-center  flex-col gap-y-8 justify-center pt-12">
      <div className="w-[400px] mt-[100px] h-[350px] flex items-center justify-center">
        <Image
          src="/404.svg"
          alt="this is the error page"
          width={400}
          height={400}
        />
      </div>
      <div className="w-[600px] h-[300px]">
        <h1 className="text-xl font-bold text-center">
          من المحتمل أن الصفحة التي تبحث عنها غير موجودة أو تمت إزالتها
        </h1>

        <div className="w-full h-[100px] flex items-center justify-center gap-x-8">
          <Link href={"/"} className={buttonVariants({ size: "lg" })}>
            الذهاب إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
