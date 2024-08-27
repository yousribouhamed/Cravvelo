import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { designO1 } from "./certificate-templates/design-01";
import { design02 } from "./certificate-templates/design-02";
import { designO3 } from "./certificate-templates/design-03";
import { deleteFileFromS3Bucket, getKeyFromUrl } from "../../aws/s3";
import { generatePdf } from "./generatePDF";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/src/lib/s3";

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
        // here we need to get the stamp

        const website = await ctx.prisma.website.findFirst({
          where: {
            accountId: ctx.account.id,
          },
        });
        let pdfAsString = "";

        if (input.code === "DEAD_DEER") {
          pdfAsString = designO1({
            courseName: input.courseName,
            studentName: input.studentName,
            stamp: website?.stamp,
          });
        } else if (input.code === "PARTY_UNDER_SUN") {
          pdfAsString = design02({
            courseName: input.courseName,
            studentName: input.studentName,
            certificateName: input.cerrificateName,
            stamp: website?.stamp,
          });
        } else {
          pdfAsString = designO3({
            courseName: input.courseName,
            studentName: input.studentName,
            certificateName: input.cerrificateName,
            stamp: website?.stamp,
          });
        }

        const pdfBuffer = await generatePdf(pdfAsString);

        const buffer = Buffer.from(pdfBuffer);

        const bucketName = "cravvel-bucket";
        const key = `certificates/${Date.now()}.pdf`;

        const s3Params = {
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: "application/pdf",
        };

        const command = new PutObjectCommand(s3Params);
        await s3.send(command);
        const fileUrl = `https://cravvel-bucket.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;
        await ctx.prisma.certificate.create({
          data: {
            accountId: ctx.account.id,
            courseName: input.courseName,
            name: input.cerrificateName,
            studentId: input.studentId,
            studentName: input.studentName,
            fileUrl: fileUrl,
          },
        });

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
