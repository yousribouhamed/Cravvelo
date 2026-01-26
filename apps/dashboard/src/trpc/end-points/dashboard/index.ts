import { privateProcedure } from "../../trpc";
import { z } from "zod";
import { getMainRevenueData } from "@/src/modules/analytics/actions/dashboard";

export const dashboard = {
  getRevenueData: privateProcedure
    .input(
      z
        .object({
          startDate: z.string().datetime().optional(),
          endDate: z.string().datetime().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const result = await getMainRevenueData(input);
      return result;
    }),
};
