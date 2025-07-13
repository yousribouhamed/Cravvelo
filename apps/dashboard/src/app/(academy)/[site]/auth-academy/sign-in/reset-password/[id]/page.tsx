import { getSiteData } from "../../../../../_actions";
import { notFound } from "next/navigation";
import { getSubDomainValue } from "../../../../../lib";
import AcademiaFooter from "@/src/app/(academy)/_components/layout/academy-footer";
import AcademyHeader from "@/src/app/(academy)/_components/layout/academy-header";
import ResetPasswordFormStep2 from "@/src/app/(academy)/_components/forms/reset-password-form-step2";
import MaxWidthWrapper from "@/src/app/(academy)/_components/max-width-wrapper";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { buttonVariants } from "@ui/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ site: string; id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id, site } = await params;
  const subdomain = getSubDomainValue({ value: site });

  const [website] = await Promise.all([
    getSiteData({
      subdomain,
    }),
  ]);

  if (!website) {
    notFound();
  }

  console.log("this is the student id");

  console.log({ studentId: id });

  return (
    <>
      <AcademyHeader
        referralEnabled={false}
        color={website?.color}
        student={null}
        isAuthanticated={false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
        displaySalesBanner={website?.enableSalesBanner}
      />
      <div className="w-full h-screen flex flex-col items-center justify-center  p-4">
        <div className="w-full h-[50px] flex items-center justify-start">
          <MaxWidthWrapper>
            <Link
              href={"/auth-academy/sign-in"}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "bg-white border"
              )}
            >
              <ArrowRight className="w-4 h-4 ml-2 text-black" />
              العودة
            </Link>
          </MaxWidthWrapper>
        </div>
        <ResetPasswordFormStep2
          studentId={id}
          color={website?.color}
          accountId={website.accountId}
        />
      </div>
      <AcademiaFooter />
    </>
  );
};

export default Page;
