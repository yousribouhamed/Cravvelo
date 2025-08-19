"use client";

import { trpc } from "../app/_trpc/client";
import { absoluteUrl } from "../lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";
import { GeistProvider, CssBaseline } from "@geist-ui/core";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
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
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GeistProvider>{children}</GeistProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
