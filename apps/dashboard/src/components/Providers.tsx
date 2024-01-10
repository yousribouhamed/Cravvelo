"use client";

import { trpc } from "../app/_trpc/client";
import { absoluteUrl } from "../lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";
import { Next13ProgressBar } from "next13-progressbar";

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
        <Next13ProgressBar
          height="2px"
          color="#54756c"
          options={{ showSpinner: false }}
          showOnShallow
          startPosition={0.3}
        />
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
