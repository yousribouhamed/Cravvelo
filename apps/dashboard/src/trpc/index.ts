import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

import { absoluteUrl } from "../lib/utils";

export const appRouter = router({});

export type AppRouter = typeof appRouter;
