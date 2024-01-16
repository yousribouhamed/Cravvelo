"use client";

import { Button } from "@ui/components/ui/button";
import Link from "next/link";
// Error components must be Client Components
import * as React from "react";

export default function StoreCheckoutError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h1>{error.name}</h1>
      <p>{error.message}</p>
      <div className="w-full h-[100px] flex items-center justify-center gap-x-8">
        <Link href={"/"}>go home</Link>
        <Button onClick={reset}>re try</Button>
      </div>
    </div>
  );
}
