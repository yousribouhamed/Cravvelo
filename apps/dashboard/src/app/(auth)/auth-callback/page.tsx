"use client";

import { useRouter } from "next/navigation";
import { trpc } from "../../_trpc/client";
import type { FC } from "react";
import { setCookie } from "@/src/lib/utils";
import { LoadingScreen } from "@/src/components/loading-screen";

const AuthCallBack: FC = ({}) => {
  const router = useRouter();

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success, accountId }) => {
      if (success) {
        // // user is synced to db
        setCookie("accountId", accountId);

        router.push("/");
      }
    },
    onError: (err) => {
      console.log(err);
      //@ts-ignore
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });
  return <LoadingScreen mode="signin" />;
};

export default AuthCallBack;
