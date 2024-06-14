import { buttonVariants } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex items-center  flex-col gap-y-8 justify-center pt-12">
      <div className="w-[400px] h-[350px] flex items-center justify-center">
        <Image
          src="/academia/no-academia-found.svg"
          alt="this is the error page"
          width={400}
          height={400}
        />
      </div>
      <div className="w-[600px] h-[300px]">
        <h1 className="text-xl font-bold text-center">
          ربما الأكاديمية التي تبحث عنها غير موجودة او تمت ازالتها يمكنك انشاء
          اكادميتك الخاصة على منصة cravvelo
        </h1>

        <div className="w-full h-[100px] flex items-center justify-center gap-x-8">
          <Link
            href={"https://www.cravvelo.com"}
            className={cn(
              buttonVariants({ size: "lg" }),
              "hover:scale-105 transition-all duration-300 rounded-xl"
            )}
          >
            انشئ اكادميتي على cravvelo
          </Link>
        </div>
      </div>
    </div>
  );
}
