import { privateProcedure } from "../../trpc";

export const students = {
  getAllStudents: privateProcedure.query(async ({ ctx }) => {
    const AllStudents = await ctx.prisma.student.findMany({
      where: {
        accountId: ctx.account.id,
      },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return AllStudents;
  }),
};
