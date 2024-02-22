import { privateProcedure } from "../trpc";
import { z } from "zod";
import { generatePdf } from "./functions/create-pdf";
import { pdfTemplate } from "./pdfTemplate";

export const generators = {
  createPdf: privateProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { description, firstName, lastName } = input;
      const myPdf = await generatePdf(
        pdfTemplate({ firstName, lastName, description })
      );

      // Create a Blob from the ArrayBuffer
      const blob = new Blob([myPdf], { type: "application/pdf" });

      // Create a File from the Blob (you can specify the desired filename here)
      const file = new File([blob], firstName + "_" + lastName + ".pdf", {
        type: "application/pdf",
      });
    }),
};
