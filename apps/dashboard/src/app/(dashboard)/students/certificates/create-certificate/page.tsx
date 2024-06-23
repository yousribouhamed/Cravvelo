import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Student } from "database";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";
import CertificateForm from "./certificate-form";

async function getData({
  accountId,
}: {
  accountId: string;
}): Promise<Student[]> {
  const data = await prisma.student.findMany({
    where: {
      accountId,
    },
  });
  return data;
}

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

const Page = async ({}) => {
  const user = await useHaveAccess();

  const [data, notifications] = await Promise.all([
    getData({ accountId: user.accountId }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        {/* @ts-ignore */}
        <Header
          notifications={notifications}
          user={user}
          title="باني الشهادة"
        />

        <CertificateForm students={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
