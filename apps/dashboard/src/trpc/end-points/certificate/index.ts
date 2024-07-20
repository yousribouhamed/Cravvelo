import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { generatePdf } from "./generatePDF";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/src/lib/s3";
import { designO1 } from "./certificate-templates/design-01";
import { design02 } from "./certificate-templates/design-02";
import { designO3 } from "./certificate-templates/design-03";
import { deleteFileFromS3Bucket, getKeyFromUrl } from "../../aws/s3";

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
      console.log("we have started the server");
      console.log({ hu: "" });
      let pdfAsString = "";

      if (input.code === "DEAD_DEER") {
        pdfAsString = await designO1({
          courseName: input.courseName,
          studentName: input.studentName,
        });
      } else if (input.code === "PARTY_UNDER_SUN") {
        pdfAsString = await design02({
          courseName: input.courseName,
          studentName: input.studentName,
          certificateName: input.cerrificateName,
        });
      } else {
        pdfAsString = await designO3({
          courseName: input.courseName,
          studentName: input.studentName,
          certificateName: input.cerrificateName,
        });
      }

      // Generate the PDF buffer
      const pdfBuffer = await generatePdf(pdfAsString).catch((err) => {
        console.error(err);

        throw new Error("error in create pdf funtion");
      });

      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(pdfBuffer);

      // Upload the buffer to S3
      const bucketName = "cravvel-bucket"; // Replace with your S3 bucket name
      const key = `certificates/${Date.now()}.pdf`; // Generate a unique key for the file

      const s3Params = {
        Bucket: bucketName,
        Key: key,
        Body: buffer, // This should be a resolved buffer
        ContentType: "application/pdf",
        //   ACL: ObjectCannedACL.public_read, // Use the appropriate enum value
      };

      let uploadResult;
      try {
        const command = new PutObjectCommand(s3Params);
        uploadResult = await s3.send(command);
        console.log("PDF uploaded successfully:", uploadResult);
      } catch (error) {
        console.error("Error uploading PDF to S3:", error);
        throw new Error("Failed to upload PDF to S3");
      }

      console.log("the file has been updated");
      console.log({
        fileurl: `https://cravvel-bucket.s3.${process.env
          .AWS_BUCKET_REGION!}.amazonaws.com/${key}`,
      });

      // Create a new certificate record in the database with the S3 URL
      const newCertificate = await ctx.prisma.certificate.create({
        data: {
          accountId: ctx.account.id,
          courseName: input.courseName,
          name: input.cerrificateName,
          studentId: input.studentId,
          studentName: input.studentName,
          fileUrl: `https://cravvel-bucket.s3.${process.env
            .AWS_BUCKET_REGION!}.amazonaws.com/${key}`,
        },
      });

      return newCertificate;
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
