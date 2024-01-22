import { isClerkAPIResponseError } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import { z } from "zod";

import { maketoast } from "../components/toasts";

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
