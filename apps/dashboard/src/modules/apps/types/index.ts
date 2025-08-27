import { Prisma } from "database";

export type AppType = {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  longDesc: Prisma.JsonValue;
  logoUrl: string | null;
  images: string[];
  category: string | null;
  installsCount: number;
  createdBy: string;
  configSchema: Prisma.JsonValue;
  uiInjection: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};
