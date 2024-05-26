import { z } from "zod";
import { privateProcedure } from "../../trpc";

export const cetificate = {
  getAllCertificates: privateProcedure.query(async ({ ctx }) => {
    const allCertificates = await ctx.prisma.certificate.findMany();

    return allCertificates;
  }),

  createCertificate: privateProcedure
    .input(
      z.object({
        studentName: z.string(),
        courseName: z.string(),
        cerrificateName: z.string(),
        studentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const allCertificates = await ctx.prisma.certificate.create({
        data: {
          courseName: input.courseName,
          name: input.cerrificateName,
          studentId: input.studentId,
          studentName: input.studentName,
        },
      });

      return allCertificates;
    }),
};
