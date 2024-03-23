import { admin } from "./end-points/admins";
import { course } from "./end-points/courses";
import { student } from "./end-points/students";
import { account } from "./end-points/users";
import { website } from "./end-points/website";
import { router } from "./trpc";

export const appRouter = router({
  ...course,
  ...admin,
  ...student,
  ...account,
  ...website,
});

export type AppRouter = typeof appRouter;
