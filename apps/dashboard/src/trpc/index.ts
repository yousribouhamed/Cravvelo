import { router } from "./trpc";
import { auth } from "./auth";
import { course } from "./end-points/course";
import { chapter } from "./end-points/course/chapter";
import { payment } from "./payments";
import { videos } from "./media/vedios";
import { products } from "./end-points/products";
import { website } from "./website";
import { orders } from "./end-points/orders";
import { notifications } from "./notifications";
import { students } from "./end-points/students";
import { homework } from "./end-points/homework";
import { cetificate } from "./end-points/certificate";
import { exams } from "./end-points/exams";
import { comments } from "./end-points/comments";
import { academia } from "./end-points/academia";
import { coubons } from "./end-points/coupons";
import { generators } from "./generators";
import { users } from "./end-points/users";
import { s3_bucket } from "./aws/s3";

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
  ...users,
  ...s3_bucket,
});

export type AppRouter = typeof appRouter;
