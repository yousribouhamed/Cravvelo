import { z } from "zod";
import { privateProcedure } from "../../trpc/trpc";
import { TRPCError } from "@trpc/server";

export const course = {
  getAllCourses: privateProcedure.query(async ({ input, ctx }) => {
    const courses = await ctx.prisma.course.findMany();
    return courses;
  }),
};
