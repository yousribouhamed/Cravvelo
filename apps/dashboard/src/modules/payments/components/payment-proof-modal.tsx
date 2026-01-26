"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { Badge } from "@ui/components/ui/badge";
import { ChevronLeft, ChevronRight, X, FileText, Image as ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useToast } from "@ui/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Dynamically import PDF viewer to avoid SSR issues with canvas
const PDFViewer = dynamic(
  () => import("./pdf-viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ),
  }
);

interface PaymentProof {
  id: string;
  fileUrl: string;
  note?: string;
  verified: boolean;
  createdAt: Date;
}

interface PaymentProofModalProps {
  proofs: PaymentProof[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

// Improved file type detection - checks URL extension and also tries to detect by loading
const detectFileType = (url: string): "image" | "pdf" | "unknown" => {
  const lowerUrl = url.toLowerCase();
  
  // Check for explicit extensions first
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];
  const pdfExtensions = [".pdf"];
  
  if (imageExtensions.some((ext) => lowerUrl.includes(ext))) {
    return "image";
  }
  
  if (pdfExtensions.some((ext) => lowerUrl.includes(ext)) || lowerUrl.includes("application/pdf")) {
    return "pdf";
  }
  
  // If no extension, default to image (most common case for payment proofs)
  // The image will fail to load if it's not actually an image, and we'll handle that
  return "image";
};

export function PaymentProofModal({
  proofs,
  isOpen,
  setIsOpen,
}: PaymentProofModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const currentProof = proofs[currentIndex];
  const fileType = currentProof ? detectFileType(currentProof.fileUrl) : "unknown";
  const isImage = fileType === "image";
  const isPdf = fileType === "pdf";

  useEffect(() => {
    if (isOpen && proofs.length > 0) {
      setCurrentIndex(0);
      setImageError(false);
      setImageLoading(true);
    }
  }, [isOpen, proofs.length]);

  useEffect(() => {
    // Reset image loading state when proof changes
    if (currentProof && isImage) {
      setImageError(false);
      setImageLoading(true);
    }
  }, [currentProof?.fileUrl, isImage]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : proofs.length - 1));
    setImageError(false);
    setImageLoading(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < proofs.length - 1 ? prev + 1 : 0));
    setImageError(false);
    setImageLoading(true);
  };

  if (!currentProof) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-5xl w-full max-h-[95vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className={isRTL ? "text-right" : "text-left"}>
                {t("payments.proofModal.title")}
              </DialogTitle>
              {proofs.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  {currentIndex + 1} / {proofs.length}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Proof content */}
          <div className="flex-1 overflow-auto relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            {isImage && !imageError ? (
              <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
                <img
                  src={currentProof.fileUrl}
                  alt={t("payments.proofModal.imageAlt")}
                  className="max-w-full max-h-[calc(95vh-250px)] object-contain rounded-lg shadow-lg"
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              </div>
            ) : isPdf ? (
              <div className="w-full h-full min-h-[400px]">
                <PDFViewer fileUrl={currentProof.fileUrl} />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4 max-w-md">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">
                      {t("payments.proofModal.unsupportedFormat")}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t("payments.proofModal.openInNewTabDescription")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open(currentProof.fileUrl, "_blank")}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {t("payments.proofModal.openInNewTab")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer with navigation and info */}
          <div className="px-6 py-4 border-t bg-card">
            <div className="flex flex-col gap-4">
              {/* Note section */}
              {currentProof.note && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {t("payments.proofModal.note")}
                      </p>
                      <p className="text-sm text-foreground">{currentProof.note}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom row: Navigation and status */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Navigation */}
                <div className="flex items-center gap-2">
                  {proofs.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={proofs.length <= 1}
                        className="gap-2"
                      >
                        {isRTL ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronLeft className="h-4 w-4" />
                        )}
                        {t("payments.proofModal.previous")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={proofs.length <= 1}
                        className="gap-2"
                      >
                        {t("payments.proofModal.next")}
                        {isRTL ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  )}
                </div>

                {/* Status and file type */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isImage ? (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    ) : isPdf ? (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    ) : null}
                    <span className="text-xs text-muted-foreground">
                      {isImage ? t("payments.proofModal.image") : isPdf ? t("payments.proofModal.pdf") : t("payments.proofModal.unknown")}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    {currentProof.verified ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <Badge variant="outline" className="text-xs border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                          {t("payments.proofModal.verified")}
                        </Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <Badge variant="outline" className="text-xs border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300">
                          {t("payments.proofModal.notVerified")}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
