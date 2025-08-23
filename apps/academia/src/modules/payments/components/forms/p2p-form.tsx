"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import BrandButton from "@/components/brand-button";
import { toast } from "sonner";
import { createP2pPaymentIntent } from "../../actions/p2p.actions";
import { uploadImageToS3 } from "@/modules/aws/s3";
import { usePaymentContext } from "../../context/payments-provider";

interface P2PFormData {
  paymentProof: File | null;
  notes?: string;
}

interface PaymentIntentPayload {
  productId: string;
  type: "COURSE" | "PRODUCT";
  proofUrl: string;
  notes?: string;
}

interface P2PFormProps {
  isLoading?: boolean;
}

export function P2PForm({ isLoading = false }: P2PFormProps) {
  const { selectedProduct } = usePaymentContext();
  const [formData, setFormData] = useState<P2PFormData>({
    paymentProof: null,
    notes: "",
  });
  const [isDragActive, setIsDragActive] = useState(false);

  const createP2pMutation = useMutation({
    mutationFn: async (payload: PaymentIntentPayload) => {
      const response = await createP2pPaymentIntent({
        paymentProof: payload.proofUrl,
        productId: payload.productId,
        type: payload.type,
        notes: payload.notes,
      });
      if (!response.success) {
        throw new Error(response.message || "فشل إنشاء الطلب");
      }
      return response;
    },
    onSuccess: () => {
      toast.success("تم إرسال إثبات الدفع بنجاح");
      setFormData({ paymentProof: null, notes: "" });
    },
    onError: (error) => {
      console.error(error);
      toast.error("حدث خطأ أثناء إرسال إثبات الدفع");
    },
  });

  const handleChange = (field: keyof P2PFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File) => {
    setFormData((prev) => ({ ...prev, paymentProof: file }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, paymentProof: null }));
  };

  const isFormValid = () => {
    return formData.paymentProof !== null && !!selectedProduct;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("لم يتم اختيار منتج");
      return;
    }

    if (!formData.paymentProof) {
      toast.error("يرجى رفع إثبات الدفع");
      return;
    }

    try {
      // Upload to S3
      const fd = new FormData();
      fd.append("file", formData.paymentProof);

      const uploadResult = await uploadImageToS3(fd);

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || "فشل رفع الملف");
      }

      createP2pMutation.mutate({
        productId: selectedProduct.id,
        type: selectedProduct.type as "COURSE" | "PRODUCT",
        proofUrl: uploadResult.url,
        notes: formData.notes,
      });
    } catch (err) {
      console.error(err);
      toast.error("تعذر رفع الملف");
    }
  };

  const isSubmitLoading = isLoading || createP2pMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Payment Proof Upload */}
            <div className="space-y-2">
              <Label className="block text-right text-foreground">
                إثبات الدفع *
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragActive
                    ? "border-green-500 bg-green-50 dark:bg-green-950/50"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {formData.paymentProof ? (
                  <div className="flex items-center justify-between bg-green-100 dark:bg-green-900/30 rounded-md p-3">
                    <button
                      type="button"
                      onClick={removeFile}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        {formData.paymentProof.name}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {(formData.paymentProof.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        اسحب وأفلت الملف هنا أو
                      </p>
                      <label className="cursor-pointer">
                        <span className="text-green-600 hover:text-green-700 font-medium">
                          اختر ملف
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={handleFileInputChange}
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF حتى 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="block text-right text-foreground"
              >
                ملاحظات (اختياري)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="أضف أي ملاحظات إضافية..."
                className="text-right bg-background resize-none"
                dir="rtl"
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Bottom Button */}
      <div className=" my-4 flex items-center justify-center p-4 ">
        <BrandButton
          size={"lg"}
          type="submit"
          className="w-full h-[40px]"
          disabled={!isFormValid() || isSubmitLoading}
          loading={isSubmitLoading}
        >
          إتمام الدفع المباشر
        </BrandButton>
      </div>
    </form>
  );
}
