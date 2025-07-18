import { isClerkAPIResponseError } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import { z } from "zod";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { maketoast } from "../components/toasts";
import { Metadata } from "next";
import axios from "axios";
import { translateClerkErrorToArabic } from "./exceptions";

const unknownErrArabic = "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا.";

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function isMacOs() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}

export function getUserEmail(user: User | null) {
  const email =
    user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";

  return email;
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return maketoast.errorWithTest({ text: errors.join("\n") });
  } else if (err instanceof Error) {
    return maketoast.errorWithTest({ text: err.message });
  } else {
    return maketoast.error();
  }
}

// Extract error message from stack trace
function extractErrorMessage(error) {
  if (error.stack) {
    const match = error.stack.match(/Error:\s*(.*)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return unknownErrArabic;
}

export function catchClerkError(err: unknown) {
  const errorMessage = extractErrorMessage(err);

  console.log("this is the message we got from the error");

  console.log(errorMessage);

  if (isClerkAPIResponseError(err)) {
    console.log(err.errors);
  }

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return maketoast.errorWithTest({ text: errors.join("\n") });
  } else if (isClerkAPIResponseError(err)) {
    const clerkErrorMessages = err.errors.map((error) =>
      translateClerkErrorToArabic(error.code)
    );
    return maketoast.errorWithTest({
      text: clerkErrorMessages.join("\n") || unknownErrArabic,
    });
  } else {
    // Extract the error message from the stack trace
    const errorMessage = extractErrorMessage(err);
    return maketoast.errorWithTest({
      text: errorMessage,
    });
  }
}

// Get cookie by name
export function getCookie(cookieName: string): string | null {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return null;
}

// Set cookie
export function setCookie(
  cookieName: string,
  cookieValue: string,
  expirationDays: number = 7
) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  const cookieString = `${cookieName}=${encodeURIComponent(
    cookieValue
  )};expires=${expirationDate.toUTCString()};path=/`;

  document.cookie = cookieString;
}

export function getValueFromUrl(
  pathname: string,
  index: number
): string | null {
  const pathSegments = pathname.split("/");

  if (index >= 0 && index < pathSegments.length) {
    return pathSegments[index];
  } else {
    return null;
  }
}

export function translateCurrency(amount, toCurrency) {
  // Exchange rates (as of the last available data, you might want to update them)
  const usdToEurRate = 0.92; // 1 USD = 0.88 EUR
  const usdToDzdRate = 199; // 1 USD = 135.5 DZD

  // Check if the input amount is a valid number
  if (typeof amount !== "number" || isNaN(amount)) {
    throw new Error("Amount must be a valid number");
  }

  // Check if the target currency is valid
  const validCurrencies = ["USD", "EUR", "DZD"];
  if (!validCurrencies.includes(toCurrency)) {
    throw new Error('Invalid currency. Use "USD", "EUR", or "DZD"');
  }

  // Convert amount to the target currency
  switch (toCurrency) {
    case "EUR":
      return amount * usdToEurRate;
    case "DZD":
      return amount * usdToDzdRate;
    // If the target currency is the same as the source currency, return the original amount
    case "USD":
    default:
      return amount;
  }
}

export function daysLeftInTrial(created_at: Date): number {
  // Calculate the end date of the trial by adding 14 days to the created_at date
  const trialEndDate = new Date(created_at);
  trialEndDate.setDate(trialEndDate.getDate() + 14);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds between the current date and the trial end date
  const timeDifference = trialEndDate.getTime() - currentDate.getTime();

  // Convert milliseconds to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  // Return the number of days left in the trial
  return daysDifference;
}

// Function to format dates in Arabic
export function formatDateInArabic(date: Date, formatString: string): string {
  return format(date, formatString, { locale: ar });
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export function constructMetadata({
  title = "Cravvelo",
  description = "Cravvelo is a Multi-tenant application which allow users to create their own platform where they can sell their courses and digital products and manage their students all under their costume brad So they can charge their customers /students even a higher prices and keep all the profit to themselves",
  image = "/opengraph-image.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@KING_IN_JUNGLE",
    },
    icons,
    metadataBase: new URL("https://www.cravvelo.com"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function timeSince(createdAt: Date): string {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000); // seconds in a year
  if (interval > 1) {
    return `منذ ${interval} سنوات`;
  } else if (interval === 1) {
    return "منذ سنة واحدة";
  }

  interval = Math.floor(seconds / 2592000); // seconds in a month
  if (interval > 1) {
    return `منذ ${interval} أشهر`;
  } else if (interval === 1) {
    return "منذ شهر واحد";
  }

  interval = Math.floor(seconds / 604800); // seconds in a week
  if (interval > 1) {
    return `منذ ${interval} أسابيع`;
  } else if (interval === 1) {
    return "منذ أسبوع واحد";
  }

  interval = Math.floor(seconds / 86400); // seconds in a day
  if (interval > 1) {
    return `منذ ${interval} أيام`;
  } else if (interval === 1) {
    return "منذ يوم واحد";
  }

  interval = Math.floor(seconds / 3600); // seconds in an hour
  if (interval > 1) {
    return `منذ ${interval} ساعات`;
  } else if (interval === 1) {
    return "منذ ساعة واحدة";
  }

  interval = Math.floor(seconds / 60); // seconds in a minute
  if (interval > 1) {
    return `منذ ${interval} دقائق`;
  } else if (interval === 1) {
    return "منذ دقيقة واحدة";
  }

  if (seconds < 10) {
    return "الآن";
  }

  return `منذ ${seconds} ثواني`;
}

export function formatDZD(amount: number): string {
  // Create a number formatter for Algerian Dinar
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Format the amount and replace the currency symbol with "DZD"
  const formattedAmount = formatter.format(amount).replace("DZD", "").trim();

  return `${formattedAmount} DZD`;
}

/**
 * Transforms a YouTube URL into an embeddable URL for an iframe.
 * @param {string} url - The YouTube URL to be transformed.
 * @returns {string} - The embeddable YouTube URL.
 */
export function getEmbedUrl({ url }) {
  const videoIdRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(videoIdRegex);

  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  } else {
    // Return a default or fallback embed URL if the video ID is not found
    return `https://youtu.be/sc-FApGZXB0?si=DpPpTpCTdyL1qD13`;
  }
}

export async function getVideoLength(
  videoLibrary,
  fileUrl,
  apiKey,
  maxRetries = 5,
  delay = 2000
) {
  let retries = 0;
  let videoLength = 0;

  while (retries < maxRetries) {
    try {
      const { data } = await axios.get(
        `https://video.bunnycdn.com/library/${videoLibrary}/videos/${fileUrl}`,
        {
          headers: {
            "Content-Type": "application/octet-stream",
            AccessKey: apiKey,
          },
        }
      );

      videoLength = data?.length;

      if (videoLength && videoLength > 0) {
        return videoLength;
      } else {
        // Log the attempt and length
        console.log(
          `Attempt ${retries + 1}: Video length is ${videoLength}. Retrying...`
        );
      }
    } catch (error) {
      console.error("Error fetching video length:", error);
      // Optionally, you can handle specific error types here (e.g., network issues)
    }

    retries++;
    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for a bit before retrying
  }

  throw new Error(`Failed to fetch video length after ${maxRetries} attempts`);
}

export function deleteAllCookies() {
  // Get all the cookies for the current site
  var cookies = document.cookie.split(";");

  // Loop through each cookie and delete it
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

    // Set the cookie expiration date to the past to delete it
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }

  console.log("All cookies deleted.");
}
