import { prisma } from "database/src";

export async function getAcademiaByAccountId({
  accountId,
}: {
  accountId: string;
}) {
  const academia = await prisma.website.findFirst({
    where: {
      accountId,
    },
  });

  return academia;
}
