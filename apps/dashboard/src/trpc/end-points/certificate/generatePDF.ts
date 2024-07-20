import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import hb from "handlebars";

export const generatePdf = async (pdfFileAsString: string) => {
  const data = {};
  const template = hb?.compile(pdfFileAsString, { strict: true });
  const result = template(data);
  const html = result;

  // Launch Puppeteer with chrome-aws-lambda
  const browser = await puppeteer.launch({ headless: true });

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
