import { buttonVariants } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";

interface Props {
  defaultLang: string;
  children: React.ReactNode;
  title: {
    arabic: string;
    english: string;
  };
}

const FormView: FC<Props> = ({ defaultLang, children, title }) => {
  return (
    <div
      dir={defaultLang === "en" ? "ltr" : "rtl"}
      className="w-full min-h-[200px] h-fit flex flex-col gap-y-4 p-4 md:p-0  "
    >
      <div className="w-full h-fit flex items-center justify-between">
        <h1 className="text-xl text-[#303030] font-bold ">
          {defaultLang === "en" ? title.english : title.arabic}
        </h1>

        <Link
          href={"/settings"}
          className={cn(
            buttonVariants({ variant: "secondary", size: "icon" }),
            "bg-white border shadow"
          )}
        >
          {defaultLang === "en" ? <ArrowRight /> : <ArrowLeft />}
        </Link>
      </div>

      {children}
    </div>
  );
};

export default FormView;
