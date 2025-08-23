"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signInAction } from "../actions/auth.action";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

interface SignInFormProps {
  onSignInSuccess?: (adminData: any) => void;
  redirectTo?: string;
}

export default function SignInForm({
  onSignInSuccess,
  redirectTo,
}: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAlert(null);

    try {
      const result = await signInAction({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        setAlert({
          type: "success",
          message: result.message || "Signed in successfully!",
        });

        // Call success callback if provided
        if (onSignInSuccess && result.data) {
          onSignInSuccess(result.data);
        }

        // Redirect if specified
        if (redirectTo) {
          window.location.href = redirectTo;
        }

        form.reset(); // Clear the form
      } else {
        setAlert({
          type: "error",
          message: result.error || "Failed to sign in.",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <Card className="border-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
          </div>
          <CardDescription>
            Sign in to your administrator account to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alert && (
            <Alert variant={alert.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          {...field}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                disabled={isLoading}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </div>
          </Form>

          <div className="text-center text-sm text-muted-foreground">
            <p>Need help? Contact your system administrator.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
