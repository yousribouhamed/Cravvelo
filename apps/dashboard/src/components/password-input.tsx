"use client";

import * as React from "react";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import { cn } from "@ui/lib/utils";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
          disabled={props.disabled}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeNoneIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <EyeOpenIcon className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
