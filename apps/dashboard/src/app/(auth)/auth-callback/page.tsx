"use client";

import { useRouter } from "next/navigation";
import { trpc } from "../../_trpc/client";
import type { FC } from "react";
import { setCookie } from "@/src/lib/utils";
import { Loader } from "@/src/components/loader-icon";

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
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center gap-y-4">
      <Loader size={48} />
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        جاري إعداد حسابك...
      </p>
    </div>
  );
};

export default AuthCallBack;
