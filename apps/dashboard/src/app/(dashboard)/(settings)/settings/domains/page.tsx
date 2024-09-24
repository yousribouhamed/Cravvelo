import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";
import DomainsView from "@/src/features/settings/domains/domains-views";

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
    <DomainsView
      customeDomain={website?.customDomain}
      defaultLang={user.lang as "en" | "ar"}
      subdomain={website?.subdomain}
    />
  );
}
