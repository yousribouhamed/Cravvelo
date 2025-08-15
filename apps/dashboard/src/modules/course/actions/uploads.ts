"use server";

import { withAuth } from "@/src/_internals/with-auth";

export const generateBunnySignedUrlAction = withAuth({
  handler: async ({ account, user }) => {
    console.log("this is the account and the user");
    console.log(account);

    console.log(user);
  },
});
