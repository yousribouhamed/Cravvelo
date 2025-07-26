import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CourseHeader from "@/src/modules/course/components/course-header";
import { notFound } from "next/navigation";
import AddPricingForm from "@/src/components/forms/course-forms/add-pricing-form";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";

export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ course_id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { course_id } = await params;
  const [user, course] = await Promise.all([
    useHaveAccess(),
    prisma.course.findUnique({
      where: {
        id: course_id,
      },
    }),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header notifications={[]} user={user} title="التسعير" goBack />
        <CourseHeader />
        <AddPricingForm course={course} />
      </main>
    </MaxWidthWrapper>
  );
}
