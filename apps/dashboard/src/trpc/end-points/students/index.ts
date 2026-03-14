import { z } from "zod";
import { privateProcedure } from "../../trpc";

const PAGE_SIZE = 10;

export const students = {
  getAllStudents: privateProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(PAGE_SIZE),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? PAGE_SIZE;
      const skip = (page - 1) * limit;

      const where = {
        accountId: ctx.account.id,
        ...(input?.search && input.search.trim().length > 0
          ? {
              OR: [
                { full_name: { contains: input.search, mode: "insensitive" as const } },
                { email: { contains: input.search, mode: "insensitive" as const } },
                { phone: { contains: input.search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      };

      const [studentsList, totalCount] = await Promise.all([
        ctx.prisma.student.findMany({
          where,
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
            photo_url: true,
            bio: true,
            isActive: true,
            emailVerified: true,
            lastVisitedAt: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                Sales: true,
                Certificates: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        ctx.prisma.student.count({ where }),
      ]);

      const pageCount = Math.ceil(totalCount / limit);

      return {
        students: studentsList,
        totalCount,
        pageCount,
        currentPage: page,
      };
    }),
};
