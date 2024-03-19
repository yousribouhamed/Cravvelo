import { TRPCError, initTRPC } from "@trpc/server";
import { prisma } from "database/src";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  return opts.next({
    ctx: {
      prisma,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
