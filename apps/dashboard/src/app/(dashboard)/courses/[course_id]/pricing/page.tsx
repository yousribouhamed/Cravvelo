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
      include: {
        // Include the pricing plans through the junction table
        CoursePricingPlans: {
          include: {
            PricingPlan: true, // This gets the actual Pricing model data
          },
          orderBy: {
            isDefault: "desc", // Show default pricing first
          },
        },
        // You might also want to include the account info
        Account: {
          select: {
            id: true,
            user_name: true,
            // Add other account fields you need
          },
        },
      },
    }),
  ]);

  if (!course) {
    notFound();
  }

  // Extract pricing plans for easier access
  const pricingPlans = course.CoursePricingPlans.map((cpp) => ({
    ...cpp.PricingPlan,
    isDefault: cpp.isDefault,
    junctionId: cpp.id,
  }));

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header notifications={[]} user={user} title="التسعير" goBack />
        <CourseHeader />
        <AddPricingForm course={course} pricingPlans={pricingPlans} />
      </main>
    </MaxWidthWrapper>
  );
}
