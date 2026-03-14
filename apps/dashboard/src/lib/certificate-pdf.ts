"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const CERTIFICATE_WIDTH = 700;
export const CERTIFICATE_HEIGHT = 500;

export async function generateCertificatePdfFromElement({
  element,
  fileName,
}: {
  element: HTMLElement;
  fileName: string;
}): Promise<File> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    width: CERTIFICATE_WIDTH,
    height: CERTIFICATE_HEIGHT,
    windowWidth: CERTIFICATE_WIDTH,
    windowHeight: CERTIFICATE_HEIGHT,
  });

  const image = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT],
  });

  pdf.addImage(image, "PNG", 0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);
  const blob = pdf.output("blob");
  return new File([blob], fileName, { type: "application/pdf" });
}
