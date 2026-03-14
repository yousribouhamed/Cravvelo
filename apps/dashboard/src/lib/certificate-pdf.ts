"use client";

import { jsPDF } from "jspdf";

export const CERTIFICATE_WIDTH = 700;
export const CERTIFICATE_HEIGHT = 500;

type CertificateThemeCode = "DEAD_DEER" | "PARTY_UNDER_SUN" | "COLD_CERTIFICATE";

export async function generateCertificatePdfFromData({
  fileName,
  studentName,
  courseName,
  certificateName,
  theme,
}: {
  fileName: string;
  studentName: string;
  courseName: string;
  certificateName: string;
  theme: CertificateThemeCode;
}): Promise<File> {
  const canvasWidth = 1400;
  const canvasHeight = 1000;
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not initialize canvas context for certificate generation.");
  }

  drawTemplate({
    ctx,
    width: canvasWidth,
    height: canvasHeight,
    theme,
    studentName,
    courseName,
    certificateName,
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

function drawTemplate({
  ctx,
  width,
  height,
  theme,
  studentName,
  courseName,
  certificateName,
}: {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  theme: CertificateThemeCode;
  studentName: string;
  courseName: string;
  certificateName: string;
}) {
  const palettes: Record<
    CertificateThemeCode,
    { background: string; accent: string; border: string; text: string }
  > = {
    DEAD_DEER: {
      background: "#FAF5EC",
      accent: "#B78747",
      border: "#C8A776",
      text: "#1F1F1F",
    },
    PARTY_UNDER_SUN: {
      background: "#FAF5EC",
      accent: "#1A3661",
      border: "#B78747",
      text: "#1A3661",
    },
    COLD_CERTIFICATE: {
      background: "#F5F8FF",
      accent: "#1A3661",
      border: "#3D6FB4",
      text: "#142A4A",
    },
  };

  const palette = palettes[theme];

  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 8;
  ctx.strokeRect(22, 22, width - 44, height - 44);

  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  // Decorative center line accents
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(width * 0.22, 220);
  ctx.lineTo(width * 0.40, 220);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width * 0.60, 220);
  ctx.lineTo(width * 0.78, 220);
  ctx.stroke();

  ctx.fillStyle = palette.text;
  ctx.textAlign = "center";

  ctx.font = "700 86px Arial";
  ctx.fillText("شهادة", width / 2, 160);

  ctx.font = "700 48px Arial";
  ctx.fillStyle = palette.accent;
  ctx.fillText("مشاركة", width / 2, 240);

  ctx.font = "700 86px Arial";
  ctx.fillStyle = palette.accent;
  ctx.fillText(studentName || "Student Name", width / 2, 400);

  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(width * 0.27, 435);
  ctx.lineTo(width * 0.73, 435);
  ctx.stroke();

  ctx.fillStyle = palette.text;
  ctx.font = "600 38px Arial";
  ctx.fillText(
    `تقديرًا لحضوره بنجاح دورة ${courseName || certificateName || "Course Name"}`,
    width / 2,
    520
  );

  const today = new Date().toLocaleDateString("en-GB");
  ctx.textAlign = "left";
  ctx.font = "700 40px Arial";
  ctx.fillText(`صدرت الشهادة بتاريخ ${today}`, 130, height - 120);

  ctx.textAlign = "right";
  ctx.font = "700 38px Arial";
  ctx.fillText("التوقيع", width - 140, height - 100);
  ctx.lineWidth = 4;
  ctx.strokeStyle = palette.text;
  ctx.beginPath();
  ctx.moveTo(width - 380, height - 145);
  ctx.lineTo(width - 120, height - 145);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.font = "600 28px Arial";
  ctx.fillStyle = "#8E5C2C";
  ctx.fillText("Powered by Cravvelo", width * 0.27, height - 70);
}
