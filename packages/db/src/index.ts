// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log:
//       //@ts-ignore
//       process?.env?.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
//   });
// //@ts-ignore
// if (process?.env?.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
//@ts-ignore
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  //@ts-ignore
  if (!global.cachedPrisma) {
    //@ts-ignore
    global.cachedPrisma = new PrismaClient();
  }
  //@ts-ignore
  prisma = global.cachedPrisma;
}

export { prisma };
