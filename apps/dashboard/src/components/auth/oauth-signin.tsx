"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { type OAuthStrategy } from "@clerk/types";
import { toast } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Icons } from "../my-icons";

const oauthProviders = [
  { name: "Google", strategy: "oauth_google", icon: "google" },
  // { name: "Facebook", strategy: "oauth_facebook", icon: "facebook" },
] satisfies {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
}[];

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  async function oauthSignIn(provider: OAuthStrategy) {
    if (!signInLoaded) return;

    try {
      setIsLoading(provider);
      setError(null);

      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/auth-callback",
      });
    } catch (error) {
      setIsLoading(null);

      const unknownError = "حدث خطأ، يرجى المحاولة مرة أخرى.";
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

  return (
    <div className="w-full space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm text-red-700">{error}</span>
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
                w-full h-12 bg-white rounded-lg flex items-center justify-center gap-x-3 
                border shadow font-medium transition-all duration-200
                ${isAnyLoading ? "opacity-70" : ""}
                ${
                  isCurrentLoading ? "ring-2 ring-blue-500 ring-opacity-50" : ""
                }
                hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                disabled:cursor-not-allowed disabled:opacity-50
              `}
              onClick={() => void oauthSignIn(provider.strategy)}
              disabled={isAnyLoading || !signInLoaded}
              aria-label={`تسجيل الدخول باستخدام ${provider.name}`}
            >
              <span className="text-sm font-medium text-gray-700">
                {isCurrentLoading
                  ? `جاري تسجيل الدخول باستخدام ${provider.name}...`
                  : `تسجيل الدخول باستخدام ${provider.name}`}
              </span>

              {isCurrentLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <IconComponent className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          );
        })}
      </div>

      {isLoading && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            سيتم إعادة توجيهك إلى{" "}
            {oauthProviders.find((p) => p.strategy === isLoading)?.name}...
          </p>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">
          بالمتابعة، فإنك توافق على شروط الخدمة وسياسة الخصوصية
        </p>
      </div>
    </div>
  );
}
