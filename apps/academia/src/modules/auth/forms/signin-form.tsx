import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { signInSchema, type SignInFormData } from "../lib/validators/auth";
import { useForm } from "@/hooks/use-form";

// Custom hook for API calls
const useAsyncOperation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, execute };
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const form = useForm(
    {
      email: "",
      password: "",
      rememberMe: false,
    },
    signInSchema
  );

  // Initialize async operation hook
  const { isLoading, execute } = useAsyncOperation();

  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      form.setValue(name, type === "checkbox" ? checked : value);
    },
    [form]
  );

  const handleInputBlur = useCallback(
    (e) => {
      form.setTouched(e.target.name);
    },
    [form]
  );

  const simulateSignIn = async (data) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success/failure based on email
    if (data.email === "test@example.com" && data.password === "password") {
      return { success: true, message: "Sign in successful! Welcome back." };
    } else {
      throw new Error(
        "Invalid email or password. Try test@example.com / password"
      );
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate form
      if (!form.validate()) {
        return;
      }

      try {
        await execute(() => simulateSignIn(form.values));
        setSubmitMessage("Sign in successful! Welcome back.");

        // Optionally reset form on success
        // form.reset();
      } catch (error) {
        setSubmitMessage(error.message);
      }
    },
    [form, execute]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email Field */}
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
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`pl-10 ${
                  form.errors.email ? "border-red-500 focus:ring-red-500" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {form.errors.email && (
              <p className="text-sm text-red-500">{form.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
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
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`pl-10 pr-10 ${
                  form.errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                disabled={isLoading}
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={form.values.rememberMe}
                onCheckedChange={(checked) =>
                  form.setValue("rememberMe", checked)
                }
                disabled={isLoading}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <Alert
              className={
                submitMessage.includes("successful")
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }
            >
              <AlertDescription
                className={
                  submitMessage.includes("successful")
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {submitMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Demo Credentials */}
          <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
            <p className="font-semibold">Demo Credentials:</p>
            <p>Email: test@example.com</p>
            <p>Password: password</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:underline"
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
