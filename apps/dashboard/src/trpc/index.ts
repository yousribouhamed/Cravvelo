import { router } from "./trpc";
import { auth } from "./auth";
import { course } from "./course";
import { chapter } from "./course/chapter";
import { payment } from "./payments";
import { videos } from "./media/vedios";
import { products } from "./products";

export const appRouter = router({
  ...auth,
  ...course,
  ...chapter,
  ...payment,
  ...videos,
  ...products,
});

export type AppRouter = typeof appRouter;
