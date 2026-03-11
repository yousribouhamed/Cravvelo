import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { designO1 } from "./certificate-templates/design-01";
import { design02 } from "./certificate-templates/design-02";
import { designO3 } from "./certificate-templates/design-03";
import {
  deleteFileFromS3Bucket,
  getKeyFromUrl,
  getS3ObjectSize,
} from "../../aws/s3";
import { generatePdf } from "./generatePDF";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/src/lib/s3";
import { sendCertififcateEmail } from "@/src/lib/resend";

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
        const [website, student] = await Promise.all([
          ctx.prisma.website.findFirst({
            where: {
              accountId: ctx.account.id,
            },
          }),
          ctx.prisma.student.findFirst({
            where: {
              id: input.studentId,
            },
          }),
        ]);
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

        await sendCertififcateEmail({
          email: student.email,
          url: fileUrl,
        });
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
        const certificate = await ctx.prisma.certificate.findUnique({
          where: { id: input.id },
        });
        if (!certificate) return null;

        const key = getKeyFromUrl(certificate.fileUrl);
        const size = await getS3ObjectSize(key);
        await deleteFileFromS3Bucket({ fileName: key });

        await ctx.prisma.certificate.delete({
          where: { id: input.id },
        });

        if (size > 0) {
          const acc = await ctx.prisma.account.findUnique({
            where: { id: ctx.account.id },
            select: { storageUsedBytes: true },
          });
          if (acc) {
            const next = Math.max(0, acc.storageUsedBytes - size);
            await ctx.prisma.account.update({
              where: { id: ctx.account.id },
              data: { storageUsedBytes: next },
            });
          }
        }

        return certificate;
      } catch (err) {
        console.error(err);
      }
    }),
};
