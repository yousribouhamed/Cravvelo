import { router } from "./trpc";
import { auth } from "./auth";
import { course } from "./course";
import { chapter } from "./course/chapter";
import { payment } from "./payments";
import { videos } from "./media/vedios";

export const appRouter = router({
  ...auth,
  ...course,
  ...chapter,
  ...payment,
  ...videos,
});

export type AppRouter = typeof appRouter;
