import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { Notification } from "database";
import { prisma } from "database/src";
import NotificationsTableShell from "./NotificationsTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData(): Promise<Notification[]> {
  const data = await prisma.notification.findMany();
  return data;
}

const Page = async ({}) => {
  const user = await useHaveAccess();
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="الاشعارات" />
        <NotificationsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
