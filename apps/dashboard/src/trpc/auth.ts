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

    const academy = await prisma.academy
      .findMany({
        where: {
          userId: user.id,
        },
      })
      .catch((err) => console.log(err));

    if (!account && !academy) {
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
      console.log("this is the academia id user created value ");
      console.log(academy);
      return { success: true, academiaId: academy.id };
    }

    console.log("this is the academia id user have value");
    console.log(academy);

    return { success: true, academiaId: academy ? academy[0]?.id : "" };
  }),
};
