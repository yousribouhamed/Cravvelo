import { prisma } from "database/src";

export async function getAccountByUserId({ userId }: { userId: string }) {
  const user = await prisma.account.findFirst({
    where: {
      userId,
    },
  });

  return user;
}

export async function updateAccountLang({
  id,
  lang,
}: {
  id: string;
  lang: "en" | "ar";
}) {
  const academia = await prisma.account.update({
    where: {
      id,
    },
    data: {
      lang,
    },
  });

  return academia;
}
