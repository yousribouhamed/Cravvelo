import type { FC } from "react";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "database/src";

interface useHaveAccessAbdullahProps {}

// this sunction should run on the server only
const useHaveAccess = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const account = await prisma.account.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!account) {
    redirect("/auth-callback");
  }

  // here we check if the user is paid user or not

  return { user, account };
};

export default useHaveAccess;
