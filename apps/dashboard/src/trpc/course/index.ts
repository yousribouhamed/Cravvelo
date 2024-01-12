import { z } from "zod";
import { privateProcedure } from "../trpc";

export const course = {
  createCourse: privateProcedure
    .input(
      z.object({
        title: z.string(),
        academiaId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      ctx.prisma.course.create({
        data: {
          title: input.title,
          AcademiaIa: input.academiaId,
        },
      });
    }),
};
