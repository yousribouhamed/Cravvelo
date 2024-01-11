import { z } from "zod";

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function isMacOs() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}

// export function catchError(err: unknown) {
//   if (err instanceof z.ZodError) {
//     const errors = err.issues.map((issue) => {
//       return issue.message;
//     });
//     return toast(errors.join("\n"));
//   } else if (err instanceof Error) {
//     return toast(err.message);
//   } else {
//     return toast("Something went wrong, please try again later.");
//   }
// }

// export function catchClerkError(err: unknown) {
//   const unknownErr = "Something went wrong, please try again later.";

//   if (err instanceof z.ZodError) {
//     const errors = err.issues.map((issue) => {
//       return issue.message;
//     });
//     return toast(errors.join("\n"));
//   } else if (isClerkAPIResponseError(err)) {
//     return toast.error(err.errors[0]?.longMessage ?? unknownErr);
//   } else {
//     return toast.error(unknownErr);
//   }
// }
