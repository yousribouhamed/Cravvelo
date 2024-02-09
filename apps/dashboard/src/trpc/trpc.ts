import { currentUser } from "@clerk/nextjs";
import { TRPCError, initTRPC } from "@trpc/server";
import { prisma } from "database/src";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const account = await prisma.account.findUnique({
    where: {
      userId: user.id,
    },
  });

  return opts.next({
    ctx: {
      userId: user.id,
      user,
      prisma,
      account,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
