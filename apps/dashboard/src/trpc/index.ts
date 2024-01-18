import { router } from "./trpc";
import { auth } from "./auth";
import { course } from "./course";
import { chapter } from "./course/chapter";

export const appRouter = router({
  ...auth,
  ...course,
  ...chapter,
});

export type AppRouter = typeof appRouter;
