import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";
import PolicyView from "@/src/features/settings/policy/policy-view";

export default async function Page() {
  const user = await useHaveAccess();

  const [website] = await Promise.all([
    prisma.website.findFirst({
      where: {
        id: user.accountId,
      },
    }),
  ]);

  return (
    <PolicyView
      defaultLang={user.lang as "en" | "ar"}
      policy={website?.privacy_policy}
    />
  );
}
