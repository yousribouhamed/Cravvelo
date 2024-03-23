import { z } from "zod";
import { privateProcedure } from "../../trpc/trpc";
import { TRPCError } from "@trpc/server";

export const student = {
  getAllStudents: privateProcedure.query(async ({ input, ctx }) => {
    const students = await ctx.prisma.student.findMany();
    return students;
  }),
};
