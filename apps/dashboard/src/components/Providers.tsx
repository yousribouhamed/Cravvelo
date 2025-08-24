"use client";

import { trpc } from "../app/_trpc/client";
import { absoluteUrl } from "../lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";
import { ConfirmationProvider } from "../contexts/confirmation-context";
import { ConfirmationModal } from "./models/confirmation-modal";

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
        <ConfirmationProvider>
          {children}

          <ConfirmationModal />
        </ConfirmationProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
