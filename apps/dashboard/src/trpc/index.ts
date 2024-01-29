import { router } from "./trpc";
import { auth } from "./auth";
import { course } from "./course";
import { chapter } from "./course/chapter";
import { payment } from "./payments";
import { videos } from "./media/vedios";
import { products } from "./products";
import { website } from "./website";

export const appRouter = router({
  ...auth,
  ...course,
  ...chapter,
  ...payment,
  ...videos,
  ...products,
  ...website,
});

export type AppRouter = typeof appRouter;
