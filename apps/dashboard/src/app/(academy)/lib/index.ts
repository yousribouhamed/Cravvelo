import { jwtVerify, SignJWT } from "jose";

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

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return files.every((file) => file instanceof File);
}

export function getSubDomainValue({ value }: { value: string }) {
  const subdomain_value =
    process.env.NODE_ENV === "development"
      ? "abdullah.cravvelo.com"
      : decodeURIComponent(value);

  return subdomain_value;
  // return "abdullah.cravvelo.com";
}
