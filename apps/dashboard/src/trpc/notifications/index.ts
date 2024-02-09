import { privateProcedure } from "../trpc";

export const notifications = {
  getAllNotifications: privateProcedure.query(async ({ ctx, input }) => {
    const allNotifications = await ctx.prisma.notification.findMany({
      where: {
        accountId: ctx.account.id,
      },
    });

    return allNotifications;
  }),
};
