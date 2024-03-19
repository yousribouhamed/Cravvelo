import { course } from "./end-points/courses";
import { router } from "./trpc";

export const appRouter = router({
  ...course,
});

export type AppRouter = typeof appRouter;
