"use client";

import { useState } from "react";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import { Mail, User, CheckCircle } from "lucide-react";
import { joinWaitingList } from "../actions/waiting.action";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export function WaitingListModal() {
  const t = useTranslations("waitingList");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error(t("errors.emailRequired"));
      return;
    }

    try {
      setLoading(true);
      const res = await joinWaitingList(formData);

      if (res.success) {
        toast.success(t("success.title"));
        setIsSubmitted(true);
      } else {
        if (res.errors) {
          // لو فيه validation errors من Zod
          const firstError = Object.values(res.errors).flat()[0];
          toast.error(firstError || t("errors.inputError"));
        } else {
          toast.error(res.message || t("errors.unexpectedError"));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(t("errors.registrationError"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail className="w-4 h-4 ml-2" />
          {t("button")}
        </Button>
      </DialogTrigger>

      <DialogContent
        dir="rtl"
        className="sm:max-w-[425px] bg-white border-0 shadow-lg"
      >
        {!isSubmitted ? (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold text-right">
                {t("title")}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2 text-right">
                {t("description")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-6">
              <div className="grid gap-3">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t("form.name")}
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t("form.namePlaceholder")}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t("form.email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="flex-1"
                    disabled={loading}
                  >
                    {t("form.cancel")}
                  </Button>
                </DialogClose>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? t("form.submitting") : t("form.submit")}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-green-600 mb-2 text-right">
                {t("success.title")}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-right">
                {t("success.description")}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <DialogClose asChild>
                <Button>{t("form.close")}</Button>
              </DialogClose>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
