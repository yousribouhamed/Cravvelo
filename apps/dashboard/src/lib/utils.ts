import { isClerkAPIResponseError } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import { z } from "zod";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { maketoast } from "../components/toasts";
import { Metadata } from "next";

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

export function catchClerkError(err: unknown) {
  const unknownErr = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return maketoast.errorWithTest({ text: errors.join("\n") });
  } else if (isClerkAPIResponseError(err)) {
    return maketoast.errorWithTest({
      text: err.errors[0]?.longMessage ?? unknownErr,
    });
  } else {
    return maketoast.error();
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

export function constructMetadata({
  title = "Cravvelo",
  description = "Cravvelo is Cravvelo",
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
    metadataBase: new URL("https://quill-blcrm7149-chrhi.vercel.app"),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
