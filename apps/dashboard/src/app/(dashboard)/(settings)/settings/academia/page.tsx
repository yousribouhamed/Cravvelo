import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";
import AcademiaView from "@/src/features/settings/academia/academia-view";

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
    <AcademiaView
      defaultLang={user.lang as "en" | "ar"}
      color={website?.color}
      logo={website?.logo}
      stamp={website?.stamp ?? ""}
    />
  );
}
