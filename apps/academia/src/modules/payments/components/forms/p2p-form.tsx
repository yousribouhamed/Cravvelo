import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import BrandButton from "@/components/brand-button";
import { useForm } from "@/hooks/use-form";

interface P2PFormProps {
  isLoading?: boolean;
}

interface P2PFormData {
  phone: string;
  fullName: string;
  paymentProof: File | null;
  notes?: string;
}

export function P2PForm({ isLoading = false }: P2PFormProps) {
  const [formData, setFormData] = useState<P2PFormData>({
    phone: "",
    fullName: "",
    paymentProof: null,
    notes: "",
  });
  const [isDragActive, setIsDragActive] = useState(false);

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
    return (
      formData.phone.trim() !== "" &&
      formData.fullName.trim() !== "" &&
      formData.paymentProof !== null
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
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
            {/* Coupon Code Section */}
            <div className="space-y-2">
              <Label
                htmlFor="coupon"
                className="block text-right text-foreground"
              >
                كود الخصم (اختياري)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => handleChange("couponCode", e.target.value)}
                  placeholder="أدخل كود الخصم"
                  className="text-right bg-background flex-1"
                  dir="rtl"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={handleCouponApply}
                  disabled={!formData.couponCode?.trim() || isLoading}
                  size="sm"
                  className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {couponApplied ? "تم التطبيق" : "تطبيق"}
                </Button>
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
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "جاري المعالجة..." : "إتمام الدفع المباشر"}
        </BrandButton>
      </div>
    </form>
  );
}
