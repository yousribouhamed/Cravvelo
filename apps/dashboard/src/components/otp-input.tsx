"use client";

import React from "react";
import { cn } from "@ui/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  length?: number;
  className?: string;
  error?: boolean;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  disabled = false,
  length = 6,
  className,
  error = false,
  autoFocus = true,
}) => {
  const [otp, setOtp] = React.useState<string[]>(new Array(length).fill(""));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, length);
      while (otpArray.length < length) {
        otpArray.push("");
      }
      setOtp(otpArray);
    } else {
      setOtp(new Array(length).fill(""));
    }
  }, [value, length]);

  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const inputValue = element.value;

    // Only allow numbers
    if (inputValue && !/^\d$/.test(inputValue)) return;

    const newOtp = [...otp];
    newOtp[index] = inputValue;
    setOtp(newOtp);

    // Update the form value
    const newValue = newOtp.join("");
    onChange(newValue);

    // Move to next input if value is entered
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    }
    // Handle Delete key
    else if (e.key === "Delete") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onChange(newOtp.join(""));
    }
    // Handle Arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // Handle Enter key
    else if (e.key === "Enter") {
      e.preventDefault();
      // Focus next empty input or submit if all filled
      const nextEmptyIndex = otp.findIndex((val) => val === "");
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (pastedData) {
      const newOtp = [...otp];

      for (let i = 0; i < pastedData.length && i < length; i++) {
        newOtp[i] = pastedData[i];
      }

      setOtp(newOtp);
      onChange(newOtp.join(""));

      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((val) => val === "");
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select all text on focus for easy replacement
    inputRefs.current[index]?.select();
  };

  const handleClick = (index: number) => {
    // Focus the first empty input when clicking
    const firstEmptyIndex = otp.findIndex((val) => val === "");
    if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
      inputRefs.current[firstEmptyIndex]?.focus();
    }
  };
  return (
    <div className={cn("flex justify-center gap-2", className)} dir="ltr">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onClick={() => handleClick(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
            digit
              ? "border-blue-500 bg-blue-50"
              : "bg-white hover:border-gray-400"
          )}
          aria-label={`رقم التحقق ${index + 1}`}
        />
      ))}
    </div>
  );
};
