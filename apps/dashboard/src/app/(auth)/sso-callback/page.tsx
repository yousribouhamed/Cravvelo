import { type HandleOAuthCallbackParams } from "@clerk/types";

import SSOCallback from "@/src/components/auth/sso-callback";

// Running out of edge function execution units on vercel free plan
// export const runtime = "edge"

export interface SSOCallbackPageProps {
  searchParams: HandleOAuthCallbackParams;
}

export default function SSOCallbackPage({
  searchParams,
}: SSOCallbackPageProps) {
  return (
    <div className="w-full h-screen">
      <SSOCallback searchParams={searchParams} />
    </div>
  );
}
