import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { BlueOcean } from "./certificate-templates/blue-ocean";
import { generatePdf } from "./generatePDF";
import { PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { s3 } from "@/src/lib/s3";
import { designO1 } from "./certificate-templates/design-01";

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
      // Generate the PDF buffer
      const pdfBuffer = await generatePdf(designO1());

      // BlueOcean({
      //   certificateName: input.cerrificateName,
      //   courseName: input.courseName,
      //   studentName: input.courseName,
      // })

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
};
