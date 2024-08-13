import { getSiteData } from "../../../../_actions";
import { notFound, redirect } from "next/navigation";
import { getStudent } from "@/src/app/(academy)/_actions/auth";
import { getSubDomainValue } from "../../../../lib";
import AcademiaFooter from "@/src/app/(academy)/_components/layout/academy-footer";
import AcademyHeader from "@/src/app/(academy)/_components/layout/academy-header";
import { AcademyVerifyEmailForm } from "@/src/app/(academy)/_components/forms/verify-email";
import MaxWidthWrapper from "@/src/app/(academy)/_components/max-width-wrapper";
import { buttonVariants } from "@ui/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@ui/lib/utils";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain = getSubDomainValue({ value: params.site });

  const [student, website] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
  ]);

  if (!website) {
    notFound();
  }

  if (student) {
    redirect("/");
  }

  return (
    <>
      <AcademyHeader
        displaySalesBanner={website?.enableSalesBanner}
        referralEnabled={false}
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
      />
      <div className="w-full min-h-[500px] h-screen flex flex-col items-center justify-center  p-4">
        <div className="w-full h-[50px] flex items-center justify-start">
          <MaxWidthWrapper>
            <Link
              href={"/auth-academy/sign-up"}
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

        <AcademyVerifyEmailForm
          color={website?.color}
          accountId={website.accountId}
        />
      </div>
      <AcademiaFooter />
    </>
  );
};

export default Page;
