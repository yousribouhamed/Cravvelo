"use client";

import { useRouter } from "next/navigation";
import { trpc } from "../../_trpc/client";
import type { FC } from "react";
import { setCookie } from "@/src/lib/utils";
import { LoadingScreen } from "@/src/components/loading-screen";
import { CravveloSpinner } from "@/src/components/cravvelo-spinner";

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
  return (
    <div className="w-full min-h-[400px] h-full flex items-center justify-center">
      <CravveloSpinner />
    </div>
  );
};

export default AuthCallBack;
