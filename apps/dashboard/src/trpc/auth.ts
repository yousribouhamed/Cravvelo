import { publicProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "database/src";
import { currentUser } from "@clerk/nextjs";
import { cookies } from "next/headers";

export const auth = {
  authCallback: publicProcedure.query(async () => {
    cookies().set({
      name: "machine_id",
      value:
        "RlBEazOsVynvf8MaSJZXJM46cEFUtwIhQJzncCAdDS%2BtkyIE52h1Z97paoc5CibZoIM%3D",
    });

    const user = await currentUser();

    if (!user.id || !user.emailAddresses)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!account) {
      const newAccount = await prisma.account.create({
        data: {
          userId: user.id,
        },
      });
      return { success: true, accountId: newAccount.id };
    }

    return { success: true, accountId: account.id };
  }),
};
