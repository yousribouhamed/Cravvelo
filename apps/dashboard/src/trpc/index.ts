import { router } from "./trpc";
import { auth } from "./auth";
import { course } from "./course";
import { chapter } from "./course/chapter";
import { payment } from "./payments";

export const appRouter = router({
  ...auth,
  ...course,
  ...chapter,
  ...payment,
});

export type AppRouter = typeof appRouter;
