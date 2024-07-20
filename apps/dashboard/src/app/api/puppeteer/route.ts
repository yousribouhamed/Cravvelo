import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import hb from "handlebars";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/src/lib/s3";

const generatePdf = async (pdfFileAsString: string) => {
  const data = {};
  const template = hb?.compile(pdfFileAsString, { strict: true });
  const result = template(data);
  const html = result;

  const path = await chromium.executablePath("/");

  console.log("this is the executable path");
  console.log({ path });

  // Launch Puppeteer with chrome-aws-lambda
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  // Add custom CSS to the page
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent = `
      body, html {
        margin: 0;
        padding: 0;
        width: 700px;
        height: 500px;
      }
    `;
    document.head.appendChild(style);
  });

  // Set the content of the page
  await page.setContent(html);

  // Generate the PDF with the specified width and height
  const buffer = await page.pdf({
    printBackground: true,
    width: "700px",
    height: "500px",
    pageRanges: "1",
  });

  // Close the browser
  await browser.close();

  return buffer;
};

export async function GET() {
  const pdfBuffer = await generatePdf("<p>hello word </p>");

  // Convert ArrayBuffer to Buffer
  const buffer = Buffer.from(pdfBuffer);

  // Upload the buffer to S3
  const bucketName = "cravvel-bucket"; // Replace with your S3 bucket name
  const key = `certificates/${Date.now()}.pdf`; // Generate a unique key for the file

  const s3Params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer, // This should be a resolved buffer
    ContentType: "application/pdf",
    //   ACL: ObjectCannedACL.public_read, // Use the appropriate enum value
  };

  let uploadResult;
  try {
    const command = new PutObjectCommand(s3Params);
    uploadResult = await s3.send(command);
    console.log("PDF uploaded successfully:", uploadResult);
  } catch (error) {
    console.error("Error uploading PDF to S3:", error);
    throw new Error("Failed to upload PDF to S3");
  }

  console.log("the file has been updated");
  console.log({
    fileurl: `https://cravvel-bucket.s3.${process.env
      .AWS_BUCKET_REGION!}.amazonaws.com/${key}`,
  });

  return NextResponse.json({
    newCertificate: ` https://cravvel-bucket.s3.${process.env
      .AWS_BUCKET_REGION!}.amazonaws.com/${key}`,
  });
}
