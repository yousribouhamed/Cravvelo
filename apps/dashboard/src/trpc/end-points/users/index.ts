import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { prisma } from "database/src";
import { increaseVerificationSteps } from "@/src/lib/actions/increase-steps";

export const users = {
  update_user_profile: privateProcedure
    .input(
      z.object({
        user_name: z.string(),
        user_bio: z.string(),
        avatarUrl: z.string(),
        phoneNumber: z.number(),
        support_email: z.string().email(),
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
            support_email: input.support_email,
          },
        });

        await increaseVerificationSteps({ accountId: ctx.account.id });

        return account;
      } catch (err) {
        console.error(err);
      }
    }),
};
