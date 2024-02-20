import { privateProcedure } from "../../trpc";

export const students = {
  getAllStudents: privateProcedure.query(async ({ ctx }) => {
    const AllStudents = await ctx.prisma.student.findMany();

    return AllStudents;
  }),
};
