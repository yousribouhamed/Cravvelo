import { z } from "zod";
import { privateProcedure } from "../trpc";
import { setAccountLanguageUseCase } from "../use-cases/appearance";
import { TRPCError } from "@trpc/server";

export const appearance = {
  setAccountLang: privateProcedure
    .input(
      z.object({
        lang: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const lang = await setAccountLanguageUseCase({
          accountId: ctx.account.id,
          currentLang: input.lang as "en" | "ar",
        });

        // update the user cookies here as will

        return lang;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          // optional: pass the original error to retain stack trace
          cause: err,
        });
      }
    }),
};
