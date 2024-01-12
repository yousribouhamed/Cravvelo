import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "database/src";
import { currentUser } from "@clerk/nextjs";

export const auth = {
  authCallback: publicProcedure.query(async () => {
    const user = await currentUser();

    if (!user.id || !user.emailAddresses)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!account) {
      // create an account in the platform
      const account = await prisma.account.create({
        data: {
          userId: user.id,
          AcademyIds: JSON.stringify([user.id]),
        },
      });

      // create the the academy and link it to the account
      const academy = await prisma.academy.create({
        data: {
          userId: user.id,
          name: user.firstName,
          courses: JSON.stringify([]),
        },
      });

      return { success: true, academiaId: academy.id };
    }

    // // if the user has an academy so return it's id to store it in a cookie in the front end
    // const academy = await prisma.academy.findFirst({
    //   where: {
    //     userId: user.id,

    //   },
    // });

    return { success: true };
  }),
};
