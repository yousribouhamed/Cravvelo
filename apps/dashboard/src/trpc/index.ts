import { router } from "./trpc";
import { auth } from "./auth";
import { course } from "./course";
import { chapter } from "./course/chapter";
import { payment } from "./payments";
import { videos } from "./media/vedios";
import { products } from "./products";
import { website } from "./website";
import { orders } from "./orders";
import { notifications } from "./notifications";
import { students } from "./students";
import { homework } from "./homework";
import { cetificate } from "./certificate";
import { exams } from "./exams";
import { comments } from "./comments";
import { academia } from "./academia";
import { coubons } from "./coupons";

export const appRouter = router({
  ...auth,
  ...course,
  ...chapter,
  ...payment,
  ...videos,
  ...products,
  ...website,
  ...orders,
  ...notifications,
  ...students,
  ...homework,
  ...cetificate,
  ...exams,
  ...comments,
  ...academia,
  ...coubons,
});

export type AppRouter = typeof appRouter;
