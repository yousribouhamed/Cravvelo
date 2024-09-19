import useHaveAccess from "@/src/hooks/use-have-access";
import ProfileView from "@/src/modules/settings/user-profile/profile-view";
import { prisma } from "database/src";

export default async function Page() {
  const user = await useHaveAccess();

  const [account] = await Promise.all([
    prisma.account.findFirst({
      where: {
        id: user.accountId,
      },
    }),
  ]);

  return <ProfileView account={account} />;
}
