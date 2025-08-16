"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

import { requestEmailConfirmation } from "../actions/request-email-confirmation";
import { confirmEmail } from "../actions/confirm-email";

interface ConfirmEmailFormData {
  email: string;
  token: string;
}

export default function ConfirmEmailForm() {
  const [tokenValue, setTokenValue] = useState("");
  const [email, setEmail] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();

  // Get email and token from search parameters
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    if (tokenParam) {
      setTokenValue(tokenParam);
    }
  }, [searchParams]);

  const mutation = useMutation({
    mutationFn: async (data: ConfirmEmailFormData) => {
      return await confirmEmail({
        email: data.email,
        token: data.token,
      });
    },
    onSuccess: (res) => {
      setSubmitMessage(res.message || "Email verified successfully");
      // Redirect or handle successful verification here
      // For example: router.push('/dashboard');
    },
    onError: (error: any) => {
      setSubmitMessage(error.message || "Failed to verify email");
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      return await requestEmailConfirmation({ email });
    },
    onSuccess: (res) => {
      setSubmitMessage(res.message || "Verification email sent successfully");
      setIsResending(false);
    },
    onError: (error: any) => {
      setSubmitMessage(error.message || "Failed to send verification email");
      setIsResending(false);
    },
  });

  const handleSubmit = async () => {
    if (!email) {
      setSubmitMessage("Email is required");
      return;
    }

    if (!tokenValue || tokenValue.trim().length === 0) {
      setSubmitMessage("Please enter the verification token");
      return;
    }

    mutation.mutate({
      email,
      token: tokenValue,
    });
  };

  const handleResendCode = async () => {
    if (!email) {
      setSubmitMessage("Email is required to resend verification");
      return;
    }

    setIsResending(true);
    setSubmitMessage("");
    resendMutation.mutate(email);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Verify Email
        </CardTitle>
        <CardDescription className="text-center">
          Enter the verification token from your email
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Email Display */}
        <div className="space-y-2">
          <Label>Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <div className="flex items-center pl-10 py-2 px-3 bg-gray-50 border border-gray-200 rounded-md">
              <span className="text-sm text-gray-700 truncate">
                {email || "No email provided"}
              </span>
            </div>
          </div>
          {!email && (
            <p className="text-sm text-red-500">
              Email parameter is missing from URL
            </p>
          )}
        </div>

        {/* Token Input */}
        <div className="space-y-2">
          <Label htmlFor="token">Verification Token</Label>
          <Input
            id="token"
            name="token"
            type="text"
            placeholder="Enter verification token from email"
            value={tokenValue}
            onChange={(e) => setTokenValue(e.target.value)}
            className={`${
              !tokenValue && submitMessage
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
            disabled={mutation.isPending}
          />
          <p className="text-xs text-gray-500">
            Copy and paste the verification token from your email
          </p>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <Alert
            className={
              submitMessage.includes("success") ||
              submitMessage.includes("verified") ||
              submitMessage.includes("resent")
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }
          >
            {(submitMessage.includes("success") ||
              submitMessage.includes("verified")) && (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription
              className={
                submitMessage.includes("success") ||
                submitMessage.includes("verified") ||
                submitMessage.includes("resent")
                  ? "text-green-700"
                  : "text-red-700"
              }
            >
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full"
          disabled={mutation.isPending || !email || !tokenValue.trim()}
        >
          {mutation.isPending ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify Email"
          )}
        </Button>

        {/* Resend Token */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the email?
          </p>
          <button
            type="button"
            onClick={handleResendCode}
            className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={mutation.isPending || resendMutation.isPending || !email}
          >
            {isResending || resendMutation.isPending ? (
              <div className="flex items-center justify-center space-x-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              "Resend verification email"
            )}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
