"use server";

import { prisma } from "database/src";

export const increaseVerificationSteps = async ({
  accountId,
}: {
  accountId: string;
}) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
      },
    });

    const verification_steps =
      account.verification_steps < 3 ? account.verification_steps + 1 : 3;

    const verified = verification_steps === 3;

    await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        verification_steps,
        verified,
      },
    });
  } catch (err) {
    console.error(err);
  }
};
