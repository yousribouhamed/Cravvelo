"use client";

import * as React from "react";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/types";
import { toast } from "@ui/lib/utils";

import { Button } from "@ui/components/ui/button";
import { Icons } from "../my-icons";

const oauthProviders = [
  { name: "Google", strategy: "oauth_google", icon: "google" },
  { name: "Facebook", strategy: "oauth_facebook", icon: "facebook" },
] satisfies {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
}[];

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  async function oauthSignIn(provider: OAuthStrategy) {
    if (!signInLoaded) return null;
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/auth-callback",
      });
    } catch (error) {
      setIsLoading(null);

      const unknownError = "Something went wrong, please try again.";

      isClerkAPIResponseError(error)
        ? toast.error(error.errors[0]?.longMessage ?? unknownError)
        : toast.error(unknownError);
    }
  }

  return (
    <div className=" w-full h-[100px] my-4  flex flex-col gap-y-2">
      <Button
        size="lg"
        aria-label={`Sign in with ${oauthProviders[0].name}`}
        key={oauthProviders[0].strategy}
        variant="secondary"
        className="w-full h-14  bg-white rounded-lg flex items-center justify-center gap-x-4 border-input shadow font-bold "
        onClick={() => void oauthSignIn(oauthProviders[0].strategy)}
        disabled={true}
      >
        تسجيل الدخول من خلال جوجل
        {isLoading === oauthProviders[0].strategy ? (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
      </Button>
      <Button
        size="lg"
        aria-label={`Sign in with ${oauthProviders[1].name}`}
        key={oauthProviders[1].strategy}
        variant="secondary"
        className="w-full h-14 bg-[#1877F2] flex items-center justify-center gap-x-4  rounded-lg font-bold text-white "
        onClick={() => void oauthSignIn(oauthProviders[1].strategy)}
        disabled={true}
        // disabled={isLoading !== null}
      >
        تسجيل الدخول من خلال فايسبوك
        {isLoading === oauthProviders[1].strategy ? (
          <Icons.spinner
            className="mr-4 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Icons.facebook className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
