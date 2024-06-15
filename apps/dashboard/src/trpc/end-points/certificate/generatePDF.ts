import puppeteer from "puppeteer";
import hb from "handlebars";

export const generatePdf = async (pdfFileAsString: string) => {
  const data = {};
  const template = hb?.compile(pdfFileAsString, { strict: true });
  const result = template(data);
  const html = result;

  // Connect to the puppeteer browser
  const browser = await puppeteer.connect({
    browserWSEndpoint:
      "wss://chrome.browserless.io?token=c8dc96e8-a6c8-4b7c-97e3-5e7977f7389f",
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
  const buffer = (
    await page.pdf({
      printBackground: true,
      width: "700px",
      height: "500px",
      pageRanges: "1",
    })
  ).buffer;

  // Close the browser
  await browser.close();

  return buffer;
};
