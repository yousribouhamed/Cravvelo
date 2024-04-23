"use client";

import * as React from "react";

import { cn } from "@ui/lib/utils";
import { useMounted } from "../hooks/use-mounted";
import {
  Button,
  buttonVariants,
  type ButtonProps,
} from "@ui/components/ui/button";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { pending?: boolean }
>(({ className, variant, pending = false, size, ...props }, ref) => {
  //todo : add skelaton loader if the button is not mounted yet
  const mounted = useMounted();

  return (
    <Button
      className={cn(buttonVariants({ variant, size, className }), "space-x-2")}
      {...props}
      ref={ref}
      disabled={pending}
    >
      {pending && <LoadingSpinner />}
      {props.children}
    </Button>
  );
});
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
