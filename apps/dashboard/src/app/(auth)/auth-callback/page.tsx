"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { trpc } from "../../_trpc/client";
import type { FC } from "react";
import { setCookie } from "@/src/lib/utils";
import { LoadingSpinner } from "@/src/components/loading-spinner";

const AuthCallBack: FC = ({}) => {
  const router = useRouter();
  const t = useTranslations("loadingScreen");

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
      <LoadingSpinner size={96} />
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {t("settingUpAccount")}
      </p>
    </div>
  );
};

export default AuthCallBack;
