import { privateProcedure } from "../trpc";

export const homework = {
  getAllHomeworks: privateProcedure.query(async ({ ctx, input }) => {
    const allHomeworks = await ctx.prisma.homework.findMany();

    return allHomeworks;
  }),
};
