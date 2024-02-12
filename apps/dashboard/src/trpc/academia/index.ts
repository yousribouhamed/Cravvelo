import { z } from "zod";
import { publicProcedure } from "../trpc";
import { prisma } from "database/src";

export const academia = {
  getAllCourses: publicProcedure
    .input(
      z.object({
        subdomain: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const website = await prisma.website.findUnique({
          where: {
            subdomain: input.subdomain,
          },
        });

        const account = await prisma.account.findUnique({
          where: {
            id: website.accountId,
          },
        });

        const courses = await prisma.course.findMany({
          where: {
            accountId: account.id,
          },
        });

        return courses;
      } catch (err) {
        console.error(err);
      }
    }),
};
