"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { loginSchema, type LoginFormData } from "../lib/validators/auth";
import { useForm } from "@/hooks/use-form";
import { loginUser } from "../actions/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const form = useForm<LoginFormData>(
    {
      email: "",
      password: "",
    },
    loginSchema
  );

  const mutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await loginUser({
        email: data.email,
        password: data.password,
        remember: true,
      });
    },
    onSuccess: (res) => {
      setSubmitMessage(res.message || "Login successful");
      // Redirect or handle successful login here
      // For example: router.push('/dashboard');
    },
    onError: (error: any) => {
      setSubmitMessage(error.message || "Failed to login");
    },
  });

  const handleSubmit = async () => {
    if (!form.validate()) return;

    mutation.mutate(form.values);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.values.email}
              onChange={(e) => form.setValue("email", e.target.value)}
              onBlur={() => form.setTouched("email")}
              className={`pl-10 ${
                form.errors.email ? "border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={mutation.isPending}
            />
          </div>
          {form.errors.email && (
            <p className="text-sm text-red-500">{form.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.values.password}
              onChange={(e) => form.setValue("password", e.target.value)}
              onBlur={() => form.setTouched("password")}
              className={`pl-10 pr-10 ${
                form.errors.password ? "border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={mutation.isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={mutation.isPending}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.errors.password && (
            <p className="text-sm text-red-500">{form.errors.password}</p>
          )}
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <Alert
            className={
              submitMessage.includes("success")
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }
          >
            <AlertDescription
              className={
                submitMessage.includes("success")
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
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Optional: Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-800 underline"
            disabled={mutation.isPending}
          >
            Forgot your password?
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
