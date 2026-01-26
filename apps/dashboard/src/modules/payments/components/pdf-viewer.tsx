"use client";

import { useState } from "react";
import SimpleBar from "simplebar-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { useToast } from "@ui/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFViewerProps {
  fileUrl: string;
}

function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const t = useTranslations();

  return (
    <SimpleBar autoHide={false} className="max-h-[70vh]">
      <div ref={ref} className="p-4">
        <Document
          loading={
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          }
          onLoadError={() => {
            toast({
              title: t("payments.proofModal.pdfErrorTitle"),
              description: t("payments.proofModal.pdfErrorDescription"),
              variant: "destructive",
            });
          }}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          file={fileUrl}
          className="max-h-full"
        >
          {numPages &&
            new Array(numPages).fill(0).map((_, i) => (
              <Page
                key={i}
                width={width ? width : 1}
                pageNumber={i + 1}
                className="mb-4"
              />
            ))}
        </Document>
      </div>
    </SimpleBar>
  );
}

export default PDFViewer;
