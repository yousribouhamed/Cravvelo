import { z } from "zod";
import { publicProcedure, privateProcedure } from "../../trpc";
import { prisma } from "database/src";

export const users = {
  update_user_profile: privateProcedure
    .input(
      z.object({
        user_name: z.string(),
        user_bio: z.string(),
        avatarUrl: z.string(),
        phoneNumber: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await prisma.account.update({
          where: {
            userId: ctx.user.id,
          },
          data: {
            avatarUrl: input.avatarUrl,
            user_name: input.user_name,
            user_bio: input.user_bio,
            phone: input.phoneNumber,
          },
        });

        return account;
      } catch (err) {
        console.error(err);
      }
    }),
};
