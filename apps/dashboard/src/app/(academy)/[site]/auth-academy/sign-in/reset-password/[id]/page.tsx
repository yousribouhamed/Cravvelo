import { getSiteData } from "../../../../../_actions";
import { notFound, redirect } from "next/navigation";
import { getStudent } from "@/src/app/(academy)/_actions/auth";
import { getSubDomainValue } from "../../../../../lib";
import AcademiaFooter from "@/src/app/(academy)/_components/layout/academy-footer";
import AcademyHeader from "@/src/app/(academy)/_components/layout/academy-header";
import { AcademyRestPasswordStep1Form } from "@/src/app/(academy)/_components/forms/reset-password-form";
import ResetPasswordFormStep2 from "@/src/app/(academy)/_components/forms/reset-password-form-step2";

interface PageProps {
  params: { site: string; id: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain = getSubDomainValue({ value: params.site });

  const [website] = await Promise.all([
    getSiteData({
      subdomain,
    }),
  ]);

  if (!website) {
    notFound();
  }

  console.log("this is the student id");

  console.log({ studentId: params.id });

  return (
    <>
      <AcademyHeader
        color={website?.color}
        student={null}
        isAuthanticated={false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
      />
      <div className="w-full h-screen flex items-center justify-center  p-4">
        <ResetPasswordFormStep2
          studentId={params.id}
          color={website?.color}
          accountId={website.accountId}
        />
      </div>
      <AcademiaFooter />
    </>
  );
};

export default Page;
