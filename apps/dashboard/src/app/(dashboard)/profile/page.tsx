import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import useHaveAccess from "@/src/hooks/use-have-access";
import UserProfileForm from "@/src/components/auth/user-profile";
import { prisma } from "database/src";

export default async function Home() {
  const user = await useHaveAccess();

  const account = await prisma.account.findFirst({
    where: {
      id: user.accountId,
    },
  });
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header user={user} title="حساب تعريفي" />
        <div className="py-8 ">
          <UserProfileForm
            bio={account.user_bio ?? ""}
            full_name={account.user_name ?? user.firstName}
            image={account.avatarUrl ?? ""}
          />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
