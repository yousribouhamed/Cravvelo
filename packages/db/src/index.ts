import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      //@ts-ignore
      process?.env?.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
//@ts-ignore
if (process?.env?.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
