"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import BrandButton from "@/components/brand-button";
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

import { signUpSchema, type SignUpFormData } from "../lib/validators/auth";
import { useForm } from "@/hooks/use-form";
import { createUser } from "../actions/user";
import { useTranslations } from "next-intl";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const router = useRouter();
  const t = useTranslations("auth.signUp");

  const form = useForm<SignUpFormData>(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    signUpSchema
  );

  const mutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      return await createUser({
        full_name: data.name,
        email: data.email,
        password: data.password,
        remember: true,
      });
    },
    onSuccess: (res) => {
      setSubmitMessage(res.message || t("successMessage"));
      form.reset();

      // Redirect to home so user is visibly logged in (cookie already set by server)
      router.push("/?welcome=1");
      router.refresh();
    },
    onError: (error: any) => {
      setSubmitMessage(error.message || t("errorMessage"));
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
          {t("title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">{t("nameLabel")}</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={t("namePlaceholder")}
              value={form.values.name}
              onChange={(e) => form.setValue("name", e.target.value)}
              onBlur={() => form.setTouched("name")}
              className={`pl-10 ${
                form.errors.name ? "border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={mutation.isLoading}
            />
          </div>
          {form.errors.name && (
            <p className="text-sm text-red-500">{form.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={form.values.email}
              onChange={(e) => form.setValue("email", e.target.value)}
              onBlur={() => form.setTouched("email")}
              className={`pl-10 ${
                form.errors.email ? "border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={mutation.isLoading}
            />
          </div>
          {form.errors.email && (
            <p className="text-sm text-red-500">{form.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">{t("passwordLabel")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              value={form.values.password}
              onChange={(e) => form.setValue("password", e.target.value)}
              onBlur={() => form.setTouched("password")}
              className={`pl-10 pr-10 ${
                form.errors.password ? "border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={mutation.isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={mutation.isLoading}
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

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
            value={form.values.confirmPassword}
            onChange={(e) => form.setValue("confirmPassword", e.target.value)}
            onBlur={() => form.setTouched("confirmPassword")}
            className={`${
              form.errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
            disabled={mutation.isLoading}
          />
          {form.errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {form.errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={form.values.terms}
            onCheckedChange={(checked) =>
              form.setValue("terms", checked as boolean)
            }
            disabled={mutation.isLoading}
          />
          <Label htmlFor="terms" className="text-sm text-gray-600">
            {t("termsLabel")}
          </Label>
        </div>
        {form.errors.terms && (
          <p className="text-sm text-red-500">{form.errors.terms}</p>
        )}

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
        <BrandButton
          type="button"
          onClick={handleSubmit}
          className="w-full"
          disabled={mutation.isLoading}
          loading={mutation.isLoading}
        >
          {mutation.isLoading ? t("loading") : t("button")}
        </BrandButton>
      </CardFooter>
    </Card>
  );
}
