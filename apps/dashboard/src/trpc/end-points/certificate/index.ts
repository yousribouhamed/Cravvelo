import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { designO1 } from "./certificate-templates/design-01";
import { design02 } from "./certificate-templates/design-02";
import { designO3 } from "./certificate-templates/design-03";
import { deleteFileFromS3Bucket, getKeyFromUrl } from "../../aws/s3";
import { sendGenerateRequest } from "./utils";

export const cetificate = {
  getAllCertificates: privateProcedure.query(async ({ ctx }) => {
    const allCertificates = await ctx.prisma.certificate.findMany({
      where: {
        accountId: ctx.account.id,
      },
    });
    return allCertificates;
  }),

  createCertificate: privateProcedure
    .input(
      z.object({
        studentName: z.string(),
        courseName: z.string(),
        cerrificateName: z.string(),
        studentId: z.string(),
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("we have started the server");
        console.log({ hu: "" });
        let pdfAsString = "";

        if (input.code === "DEAD_DEER") {
          pdfAsString = designO1({
            courseName: input.courseName,
            studentName: input.studentName,
          });
        } else if (input.code === "PARTY_UNDER_SUN") {
          pdfAsString = design02({
            courseName: input.courseName,
            studentName: input.studentName,
            certificateName: input.cerrificateName,
          });
        } else {
          pdfAsString = designO3({
            courseName: input.courseName,
            studentName: input.studentName,
            certificateName: input.cerrificateName,
          });
        }

        console.log("this is the pdf string ");
        console.log(pdfAsString);

        // await sendGenerateRequest({
        //   certificate: pdfAsString,
        //   accountId: ctx.account.id,
        //   courseName: input.courseName,
        //   name: input.cerrificateName,
        //   studentName: input.studentName,
        //   studentId: input.studentId,
        // });

        return {
          successs: true,
        };
      } catch (err) {
        console.error(err);
      }
    }),

  deleteCertificate: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const certificate = await ctx.prisma.certificate.delete({
          where: {
            id: input.id,
          },
        });

        await deleteFileFromS3Bucket({
          fileName: getKeyFromUrl(certificate.fileUrl),
        });

        return certificate;
      } catch (err) {
        console.error(err);
      }
    }),
};
