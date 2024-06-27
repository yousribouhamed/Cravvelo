import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Certificate } from "database";
import { prisma } from "database/src";
import CertificateTableShell from "./CertificatesTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData({
  accountId,
}: {
  accountId: string;
}): Promise<Certificate[]> {
  const data = await prisma.certificate.findMany({
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
    getData({
      accountId: user.accountId,
    }),
    getAllNotifications({
      accountId: user.accountId,
    }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          goBack
          notifications={notifications}
          user={user}
          title="الشهادات"
        />
        <CertificateTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
