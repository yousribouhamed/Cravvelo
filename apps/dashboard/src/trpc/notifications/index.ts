import { z } from "zod";
import { privateProcedure } from "../trpc";

export const notifications = {
  getAllNotifications: privateProcedure.query(async ({ ctx, input }) => {
    const allNotifications = await ctx.prisma.notification.findMany({
      where: {
        accountId: ctx.account.id,
      },
      orderBy: {
        createdAt: "desc", // Assuming 'createdAt' is the field that stores the date and time the notification was created
      },
      take: 30, // Limit the number of notifications to 30
    });

    return allNotifications;
  }),
  makeNotificationRead: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.notification.update({
        where: {
          id: input.id,
        },

        data: {
          isRead: true,
        },
      });

      return notification;
    }),

  makeNotificationArchived: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.notification.update({
        where: {
          id: input.id,
        },

        data: {
          isArchived: true,
        },
      });

      return notification;
    }),
};
