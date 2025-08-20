import { router } from "./trpc";
import { auth } from "./auth";
import { course } from "./end-points/course";
import { chapter } from "./end-points/course/chapter";
import { payment } from "./payments";
import { products } from "./end-points/products";
import { website } from "./website";
import { orders } from "./end-points/orders";
import { notifications } from "./notifications";
import { students } from "./end-points/students";
import { cetificate } from "./end-points/certificate";
import { comments } from "./end-points/comments";
import { academia } from "./end-points/academia";
import { coubons } from "./end-points/coupons";
import { generators } from "./generators";
import { users } from "./end-points/users";
import { s3_bucket } from "./aws/s3";
import { search } from "./end-points/search";
import { referral } from "./end-points/referral";
import { videoMutations } from "./end-points/course/video";
import { textModule } from "./end-points/course/text-module";

export const appRouter = router({
  ...auth,
  ...course,
  ...chapter,
  ...payment,
  ...products,
  ...website,
  ...orders,
  ...notifications,
  ...students,
  ...cetificate,
  ...comments,
  ...academia,
  ...coubons,
  ...users,
  ...search,
  ...s3_bucket,
  ...referral,
  ...videoMutations,
  ...textModule,
});

export type AppRouter = typeof appRouter;
