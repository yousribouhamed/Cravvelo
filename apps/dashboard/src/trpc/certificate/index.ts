import { privateProcedure } from "../trpc";

export const cetificate = {
  getAllCertificates: privateProcedure.query(async ({ ctx }) => {
    const allCertificates = await ctx.prisma.certificate.findMany();

    return allCertificates;
  }),
};
