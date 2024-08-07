import { jwtVerify, SignJWT } from "jose";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export function absoluteUrl(route: string) {
  if (typeof window !== "undefined") return route;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}${route}`;
  return `http://localhost:${process.env.PORT ?? 3001}${route}`;
}

export function isMacOs() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export function getJwtSecritKey() {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret || secret.length === 0) {
    throw new Error("there is no secret key");
  }

  return secret;
}

export async function verifyToken({ token }: { token: string }) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecritKey())
    );

    return verified.payload as UserJwtPayload;
  } catch (err) {
    console.error(err);
    throw new Error("your token has expired");
  }
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

export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Function to format dates in Arabic
export function formatDateInArabic(date: Date, formatString: string): string {
  return format(date, formatString, { locale: ar });
}
