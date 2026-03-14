import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import hb from "handlebars";

export const generatePdf = async (pdfFileAsString: string) => {
  const data = {};
  const template = hb?.compile(pdfFileAsString, { strict: true });
  const result = template(data);
  const html = result;
  const isServerlessRuntime = Boolean(
    process.env.VERCEL ||
      process.env.AWS_EXECUTION_ENV ||
      process.env.AWS_LAMBDA_FUNCTION_VERSION
  );

  const browser = isServerlessRuntime
    ? await launchServerlessBrowser()
    : await launchLocalBrowser();

  let page: Awaited<ReturnType<typeof browser.newPage>> | null = null;

  try {
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(30_000);
    page.setDefaultTimeout(30_000);

    await page.setViewport({ width: 700, height: 500 });
    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30_000,
    });

    await page.addStyleTag({
      content: `
        body, html {
          margin: 0;
          padding: 0;
          width: 700px;
          height: 500px;
        }
      `,
    });

    return await page.pdf({
      printBackground: true,
      width: "700px",
      height: "500px",
      pageRanges: "1",
      timeout: 30_000,
    });
  } finally {
    if (page) {
      await page.close();
    }
    await browser.close();
  }
};

const launchServerlessBrowser = async () => {
  try {
    return await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ?? (await chromium.executablePath()),
      headless: chromium.headless,
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown launch error";
    throw new Error(
      `Could not launch Chromium in serverless runtime. ${details}. ` +
        `Make sure @sparticuz/chromium is installed and the function runs on Node.js runtime.`
    );
  }
};

const launchLocalBrowser = async () => {
  try {
    // Prefer the locally installed Chrome app in development.
    return await puppeteer.launch({
      channel: "chrome",
      headless: true,
    });
  } catch (channelError) {
    try {
      // Fallback to Puppeteer's managed browser cache when available.
      return await puppeteer.launch({
        headless: true,
      });
    } catch (defaultError) {
      const primaryMessage =
        channelError instanceof Error ? channelError.message : "Unknown error";
      const fallbackMessage =
        defaultError instanceof Error ? defaultError.message : "Unknown error";
      throw new Error(
        `Could not launch a local browser. Tried installed Chrome and Puppeteer cache. ` +
          `Install Chrome or run 'npx puppeteer browsers install chrome'. ` +
          `Primary: ${primaryMessage}. Fallback: ${fallbackMessage}`
      );
    }
  }
};
