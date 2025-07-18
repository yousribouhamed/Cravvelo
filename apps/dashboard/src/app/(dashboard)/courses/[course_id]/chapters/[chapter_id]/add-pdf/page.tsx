import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import AddPdfForm from "@/src/components/forms/course-forms/add-pdf-form";
import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

export default async function Home() {
  const user = await useHaveAccess();

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header
          notifications={notifications}
          goBack
          user={user}
          title="اظافة ملف"
        />

        <div className="w-full pt-8 min-h-[100px] ">
          <AddPdfForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
