import { privateProcedure } from "../../trpc";

export const exams = {
  getAllExams: privateProcedure.query(async ({ ctx }) => {
    const allExams = await ctx.prisma.exam.findMany();

    return allExams;
  }),
};
