import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { Course, Product } from "database";

interface ProductGroup {
  pages: { name: string; path: string }[];
  products: Product[];
  courses: Course[];
}

export const search = {
  getUserQuery: privateProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        where: {
          accountId: ctx.account.id,
        },
      });

      const courses = await ctx.prisma.course.findMany({
        where: {
          accountId: ctx.account.id,
        },
      });

      const filteredProducts = () => {
        return products.filter((product) => {
          // Filter based on product title or any other property
          return (
            product.title
              ?.toLowerCase()
              ?.includes(input.query?.toLowerCase()) ||
            product.subDescription
              ?.toLowerCase()
              ?.includes(input.query?.toLowerCase())
          );
        });
      };

      const filteredCourses = () => {
        return courses.filter((product) => {
          // Filter based on product title or any other property
          return (
            product?.title
              ?.toLowerCase()
              ?.includes(input.query?.toLowerCase()) ||
            product?.courseResume
              ?.toLowerCase()
              ?.includes(input.query?.toLowerCase())
          );
        });
      };
      // get all the settings

      // get all the products

      // get all the courses

      // get all the students

      const data: ProductGroup = {
        pages: [],
        products: [...filteredProducts()],
        courses: [...filteredCourses()],
      };

      return data;
    }),
};
