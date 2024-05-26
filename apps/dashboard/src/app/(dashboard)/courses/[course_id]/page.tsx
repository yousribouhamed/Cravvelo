import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import { notFound, redirect } from "next/navigation";
import { Button } from "@ui/components/ui/button";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";

interface PageProps {
  params: { course_id: string };
}

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

export default async function Page({ params }: PageProps) {
  const user = await useHaveAccess();

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
        <Header notifications={[]} goBack user={user} title="ui ux" />
        <div className="w-full h-[70px]  flex items-center justify-between"></div>
        <div className="w-full min-h-[500px] grid grid-cols-3">
          <p>this page is an error</p>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
