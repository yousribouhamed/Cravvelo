import { admin } from "./end-points/admins";
import { course } from "./end-points/courses";
import { router } from "./trpc";

export const appRouter = router({
  ...course,
  ...admin,
});

export type AppRouter = typeof appRouter;
