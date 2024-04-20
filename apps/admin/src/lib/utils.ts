import { jwtVerify, SignJWT } from "jose";

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
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

export const logout = () => {};
