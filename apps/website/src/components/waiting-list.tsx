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

export function WaitingListModal() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }

    try {
      setLoading(true);
      const res = await joinWaitingList(formData);

      if (res.success) {
        toast.success("تم التسجيل بنجاح!");
        setIsSubmitted(true);
      } else {
        if (res.errors) {
          // لو فيه validation errors من Zod
          const firstError = Object.values(res.errors).flat()[0];
          toast.error(firstError || "خطأ في الإدخال");
        } else {
          toast.error(res.message || "حدث خطأ غير متوقع");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التسجيل");
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
          انضم إلى قائمة الانتظار
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
                انضم إلى قائمة الانتظار
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2 text-right">
                كن أول من يعرف عند إطلاق منتجنا الجديد. سنرسل لك دعوة حصرية
                للوصول المبكر.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-6">
              <div className="grid gap-3">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  الاسم (اختياري)
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="أدخل اسمك"
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
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
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
                    إلغاء
                  </Button>
                </DialogClose>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "جارٍ الإرسال..." : "انضم الآن"}
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
                تم التسجيل بنجاح!
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-right">
                شكراً لانضمامك إلى قائمة الانتظار. سنرسل لك رسالة بريد إلكتروني
                بمجرد أن نكون جاهزين للإطلاق.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <DialogClose asChild>
                <Button>إغلاق</Button>
              </DialogClose>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
