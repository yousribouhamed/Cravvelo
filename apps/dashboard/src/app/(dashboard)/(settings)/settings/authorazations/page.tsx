import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";
import AuthorazationsView from "@/src/features/settings/authorazations/academia-view";

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
    <AuthorazationsView
      referalEnabled={website?.enableReferral}
      defaultLang={user.lang as "en" | "ar"}
    />
  );
}
