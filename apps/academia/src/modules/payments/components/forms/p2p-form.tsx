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
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations("payments.p2p");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const [formData, setFormData] = useState<P2PFormData>({
    paymentProof: null,
    notes: "",
  });
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const { getActiveConnection } = usePaymentContext();
  const p2pConnection = getActiveConnection("P2P");
  const p2pConfigRaw = p2pConnection?.config;
  const p2pConfig =
    typeof p2pConfigRaw === "string"
      ? (() => {
          try {
            return JSON.parse(p2pConfigRaw);
          } catch {
            return null;
          }
        })()
      : p2pConfigRaw ?? null;
  const bankDetails = p2pConfig as
    | {
        accountHolder?: string;
        bankName?: string;
        accountNumber?: string;
        routingNumber?: string;
        bankDetails?: string;
        notes?: string;
      }
    | null;

  const createP2pMutation = useMutation({
    mutationFn: async (payload: PaymentIntentPayload) => {
      const response = await createP2pPaymentIntent({
        paymentProof: payload.proofUrl,
        productId: payload.productId,
        type: payload.type,
        notes: payload.notes,
      });
      if (!response.success) {
        throw new Error(response.message || t("toastError"));
      }
      return response;
    },
    onSuccess: () => {
      toast.success(t("toastSuccess"));
      setFormData({ paymentProof: null, notes: "" });
      setIsLocked(true); // keep locked to prevent re-submission
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("toastError"));
      setIsLocked(false);
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
    if (isLocked) return;
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    if (isLocked) return;
    setFormData((prev) => ({ ...prev, paymentProof: null }));
  };

  const isFormValid = () => {
    return formData.paymentProof !== null && !!selectedProduct;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (!selectedProduct) {
      toast.error(t("toastNoProduct"));
      return;
    }

    if (!formData.paymentProof) {
      toast.error(t("toastProofRequired"));
      return;
    }

    try {
      // Immediately lock all interactions to avoid double submit during upload.
      setIsLocked(true);

      // Upload to S3
      const fd = new FormData();
      fd.append("file", formData.paymentProof);

      const uploadResult = await uploadImageToS3(fd);

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || t("toastUploadFailed"));
      }

      createP2pMutation.mutate({
        productId: selectedProduct.id,
        type: selectedProduct.type as "COURSE" | "PRODUCT",
        proofUrl: uploadResult.url,
        notes: formData.notes,
      });
    } catch (err) {
      console.error(err);
      toast.error(t("toastUploadFailed"));
      setIsLocked(false);
    }
  };

  const isSubmitLoading = isLoading || createP2pMutation.isLoading;
  const isDisabled = isSubmitLoading || isLocked;

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Bank Details (P2P instructions) */}
            {bankDetails && (
              <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
                <p
                  className={`text-sm font-semibold text-foreground ${dir === "rtl" ? "text-right" : "text-left"}`}
                >
                  {t("bankDetailsTitle")}
                </p>
                <div
                  className={`space-y-1 text-sm text-foreground/90 ${dir === "rtl" ? "text-right" : "text-left"}`}
                >
                  {bankDetails.bankName && (
                    <p>
                      <span className="font-medium">{t("bankName")}:</span>{" "}
                      {bankDetails.bankName}
                    </p>
                  )}
                  {bankDetails.accountHolder && (
                    <p>
                      <span className="font-medium">
                        {t("accountHolder")}:
                      </span>{" "}
                      {bankDetails.accountHolder}
                    </p>
                  )}
                  {bankDetails.accountNumber && (
                    <p>
                      <span className="font-medium">
                        {t("accountNumber")}:
                      </span>{" "}
                      {bankDetails.accountNumber}
                    </p>
                  )}
                  {bankDetails.routingNumber && (
                    <p>
                      <span className="font-medium">
                        {t("routingNumber")}:
                      </span>{" "}
                      {bankDetails.routingNumber}
                    </p>
                  )}
                  {bankDetails.bankDetails && (
                    <p className="whitespace-pre-wrap">
                      <span className="font-medium">{t("ibanSwift")}:</span>{" "}
                      {bankDetails.bankDetails}
                    </p>
                  )}
                  {bankDetails.notes && (
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {bankDetails.notes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Proof Upload */}
            <div className="space-y-2" dir={dir}>
              <Label
                className={`block text-foreground ${dir === "rtl" ? "text-right" : "text-left"}`}
              >
                {t("uploadLabel")}
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragActive
                    ? "border-green-500 bg-green-50 dark:bg-green-950/50"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onDrop={isDisabled ? undefined : handleDrop}
                onDragOver={isDisabled ? undefined : handleDragOver}
                onDragLeave={isDisabled ? undefined : handleDragLeave}
              >
                {formData.paymentProof ? (
                  <div className="flex items-center justify-between bg-green-100 dark:bg-green-900/30 rounded-md p-3">
                    <button
                      type="button"
                      onClick={removeFile}
                      disabled={isDisabled}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div
                      className={dir === "rtl" ? "text-right" : "text-left"}
                    >
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
                        {t("dragDropText")}
                      </p>
                      <label className="cursor-pointer inline-flex items-center justify-center min-h-11 px-4 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                        <span className="text-green-600 hover:text-green-700 font-medium">
                          {t("chooseFile")}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={handleFileInputChange}
                          disabled={isDisabled}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t("fileTypesHint")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2" dir={dir}>
              <Label
                htmlFor="notes"
                className={`block text-foreground ${dir === "rtl" ? "text-right" : "text-left"}`}
              >
                {t("notesLabel")}
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder={t("notesPlaceholder")}
                className={`bg-background resize-none min-h-11 md:min-h-0 ${dir === "rtl" ? "text-right" : "text-left"}`}
                dir={dir}
                rows={3}
                disabled={isDisabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Bottom Button - sticky on mobile for always-visible CTA */}
      <div className="sticky bottom-0 z-10 bg-card pt-4 pb-[env(safe-area-inset-bottom)] md:static md:my-4 md:pb-4 flex items-center justify-center p-4">
        <BrandButton
          size="lg"
          type="submit"
          className="w-full min-h-11 sm:h-10"
          disabled={!isFormValid() || isDisabled}
          loading={isSubmitLoading}
        >
          {isLocked && !isSubmitLoading ? t("submittedButton") : t("submitButton")}
        </BrandButton>
      </div>
    </form>
  );
}
