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

        console.log("this is the website ");
        console.log(website);

        const account = await prisma.account.findUnique({
          where: {
            id: website.id,
          },
        });
        console.log("this is your account");
        console.log(account);

        const courses = await prisma.course.findMany({
          where: {
            accountId: account.id,
          },
        });

        console.log("this is your courses");
        console.log(courses);
        return courses;
      } catch (err) {
        console.error(err);
      }
    }),
};
