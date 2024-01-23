import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "database/src";
import { currentUser } from "@clerk/nextjs";

export const create_portal_link = publicProcedure.query(async () => {
  const user = await currentUser();

  if (!user.id || !user.emailAddresses)
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
    },
  });
});
