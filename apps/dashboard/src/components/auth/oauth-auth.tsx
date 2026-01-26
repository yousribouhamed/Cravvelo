"use client";

import * as React from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { type OAuthStrategy } from "@clerk/types";
import { toast } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Icons } from "../my-icons";
import { useTranslations } from "next-intl";

const oauthProviders = [
  { name: "Google", strategy: "oauth_google", icon: "google" },
  // { name: "Facebook", strategy: "oauth_facebook", icon: "facebook" },
] satisfies {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
}[];

interface OAuthAuthProps {
  mode: "signIn" | "signUp";
}

export function OAuthAuth({ mode }: OAuthAuthProps) {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const t = useTranslations("auth.oauth");

  const isLoaded = mode === "signIn" ? signInLoaded : signUpLoaded;

  async function oauthAuth(provider: OAuthStrategy) {
    if (!isLoaded) return;

    try {
      setIsLoading(provider);
      setError(null);

      if (mode === "signIn") {
        await signIn.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/auth-callback",
        });
      } else {
        await signUp.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/auth-callback",
        });
      }
    } catch (error) {
      setIsLoading(null);

      const unknownError = t("error");
      const errorMessage = isClerkAPIResponseError(error)
        ? error.errors[0]?.longMessage ?? unknownError
        : unknownError;

      setError(errorMessage);
      toast.error(errorMessage);
    }
  }

  // Reset error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getButtonText = (providerName: string) => {
    if (isLoading === oauthProviders.find((p) => p.name === providerName)?.strategy) {
      return mode === "signIn"
        ? t("signingInWith", { provider: providerName })
        : t("signingUpWith", { provider: providerName });
    }
    return mode === "signIn"
      ? t("signInWith", { provider: providerName })
      : t("signUpWith", { provider: providerName });
  };

  const getAriaLabel = (providerName: string) => {
    return mode === "signIn"
      ? t("signInWith", { provider: providerName })
      : t("signUpWith", { provider: providerName });
  };

  return (
    <div className="w-full space-y-3">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {oauthProviders.map((provider) => {
          const isCurrentLoading = isLoading === provider.strategy;
          const isAnyLoading = isLoading !== null;

          // Get the icon component from Icons object
          const IconComponent = Icons[provider.icon];

          return (
            <Button
              key={provider.strategy}
              size="lg"
              variant="secondary"
              className={`
                w-full h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center gap-x-3 
                border border-gray-200 dark:border-gray-700 shadow font-medium transition-all duration-200
                ${isAnyLoading ? "opacity-70" : ""}
                ${
                  isCurrentLoading ? "ring-2 ring-blue-500 ring-opacity-50" : ""
                }
                hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                disabled:cursor-not-allowed disabled:opacity-50
              `}
              onClick={() => void oauthAuth(provider.strategy)}
              disabled={isAnyLoading || !isLoaded}
              aria-label={getAriaLabel(provider.name)}
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {getButtonText(provider.name)}
              </span>

              {isCurrentLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
              ) : (
                <IconComponent className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </Button>
          );
        })}
      </div>

      {isLoading && (
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("redirectingTo", {
              provider: oauthProviders.find((p) => p.strategy === isLoading)?.name || "",
            })}
          </p>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("termsText")}
        </p>
      </div>
    </div>
  );
}
