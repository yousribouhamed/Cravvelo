import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { Button } from "@ui/components/ui/button";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";

interface PageProps {
  params: { course_id: string };
}

export default async function Page({ params }: PageProps) {
  const { user, account } = await useHaveAccess();

  const course = await prisma.course.findUnique({
    where: {
      id: params.course_id,
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header goBack user={user} title="ui ux" />
        <div className="w-full h-[70px]  flex items-center justify-between">
          <div>hado les lies </div>
          <Button>تعديل الدورة</Button>
        </div>
        <div className="w-full min-h-[500px] grid grid-cols-3">
          <div className="col-span-2 bg-blue-500"></div>
          <div className="col-span-1 bg-yellow-500"></div>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
