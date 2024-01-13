import { z } from "zod";
import { privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const course = {
  createCourse: privateProcedure
    .input(
      z.object({
        title: z.string(),
        academiaId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const course = await ctx.prisma.course
        .create({
          data: {
            title: input.title,
            academiaId: input.academiaId,
          },
        })
        .catch((err) => {
          console.log(err);
          throw new TRPCError({ code: "NOT_FOUND" });
        });

      return { success: true, courseId: course.id };
    }),
};
