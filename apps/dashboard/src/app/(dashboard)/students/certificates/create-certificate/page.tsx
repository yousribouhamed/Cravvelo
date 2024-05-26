import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Student } from "database";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";
import CertificateForm from "./certificate-form";
import CertificateViewer from "./certificate-viewer";

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
        <div className="w-full min-h-[400px] h-fit grid grid-cols-3 mt-8 py-2   gap-4">
          <div className="col-span-1 w-full h-full   ">
            <CertificateForm students={data} />
          </div>
          <div className="col-span-2 w-full h-full  ">
            <CertificateViewer />
          </div>
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
