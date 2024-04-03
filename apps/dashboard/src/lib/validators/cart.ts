import { z } from "zod";

export const cartLineItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  images: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
    )
    .optional()
    .nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export const dashboardProductsSearchParamsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});
