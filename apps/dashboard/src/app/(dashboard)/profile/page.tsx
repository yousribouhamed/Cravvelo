import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import useHaveAccess from "@/src/hooks/use-have-access";
import UserProfileForm from "./ProfileForm";
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

  const [notifications, account] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
    prisma.account.findFirst({
      where: {
        id: user.accountId,
      },
    }),
  ]);
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header notifications={[]} user={user} title="حساب تعريفي" />
        <div className="py-8 flex justify-center ">
          <UserProfileForm account={account} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
