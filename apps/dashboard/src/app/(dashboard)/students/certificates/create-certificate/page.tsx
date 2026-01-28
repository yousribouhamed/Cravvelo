import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Student } from "database";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";
import CertificateForm from "./certificate-form";
import { getServerTranslations } from "@/src/lib/i18n/utils";

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

const getStamp = async ({
  accountId,
}: {
  accountId: string;
}): Promise<string | null> => {
  const website = await prisma.website.findFirst({
    where: {
      accountId,
    },
  });
  return website?.stamp ?? null;
};

const Page = async ({}) => {
  const user = await useHaveAccess();
  const t = await getServerTranslations("certificates");

  const [data, notifications, stamp] = await Promise.all([
    getData({ accountId: user.accountId }),
    getAllNotifications({ accountId: user.accountId }),
    getStamp({ accountId: user?.accountId }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={t("createTitle")}
        />

        <CertificateForm stamp={stamp} students={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
