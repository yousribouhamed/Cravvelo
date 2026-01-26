"use client";

import { trpc } from "../app/_trpc/client";
import { absoluteUrl } from "../lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";
import { ConfirmationProvider } from "../contexts/confirmation-context";
import { ConfirmationModal } from "./models/confirmation-modal";
import { NextIntlClientProvider } from "next-intl";
import { Locale } from "../lib/i18n/config";

interface ProvidersProps extends PropsWithChildren {
  locale: Locale;
  messages: Record<string, any>;
}

const Providers = ({ children, locale, messages }: ProvidersProps) => {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          onError: (error: any) => {
            // Handle TRPC UNAUTHORIZED errors by redirecting to sign-in
            if (error?.data?.code === "UNAUTHORIZED" || error?.code === "UNAUTHORIZED") {
              // Use window.location for redirect since router might not be available in error handler
              if (typeof window !== "undefined") {
                window.location.href = "/sign-in";
              }
            }
          },
        },
        mutations: {
          onError: (error: any) => {
            // Handle TRPC UNAUTHORIZED errors by redirecting to sign-in
            if (error?.data?.code === "UNAUTHORIZED" || error?.code === "UNAUTHORIZED") {
              // Use window.location for redirect since router might not be available in error handler
              if (typeof window !== "undefined") {
                window.location.href = "/sign-in";
              }
            }
          },
        },
      },
    });
  });
  
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: absoluteUrl("/api/trpc"),
        }),
      ],
      transformer: undefined,
    })
  );

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ConfirmationProvider>
            {children}

            <ConfirmationModal />
          </ConfirmationProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </NextIntlClientProvider>
  );
};

export default Providers;
