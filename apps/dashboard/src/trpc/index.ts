import { router } from "./trpc";
import { auth } from "./auth";
import { course } from "./course";

export const appRouter = router({
  ...auth,
  ...course,
});

export type AppRouter = typeof appRouter;
