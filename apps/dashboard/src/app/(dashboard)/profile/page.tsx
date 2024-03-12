import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import useHaveAccess from "@/src/hooks/use-have-access";
import UserProfileForm from "./ProfileForm";
import { prisma } from "database/src";

export default async function Home() {
  const user = await useHaveAccess();

  console.log("this is the user avatra");
  console.log(user.avatar);

  const account = await prisma.account.findFirst({
    where: {
      id: user.accountId,
    },
  });
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header user={user} title="حساب تعريفي" />
        <div className="py-8 flex justify-center ">
          <UserProfileForm account={account} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
