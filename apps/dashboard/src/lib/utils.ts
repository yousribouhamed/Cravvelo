import { isClerkAPIResponseError } from "@clerk/nextjs";
import { useToast } from "@ui/components/ui/use-toast";
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

export function catchError(err: unknown) {
  const { toast } = useToast();
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    toast({
      variant: "destructive",
      title: "error",
      description: errors.join("\n"),
    });
    return;
  } else if (err instanceof Error) {
    toast({
      variant: "destructive",
      title: "error",
      description: err.message,
    });
    return;
  } else {
    toast({
      variant: "destructive",
      title: "error",
      description: "Something went wrong, please try again later.",
    });
  }
}

export function catchClerkError(err: unknown) {
  const { toast } = useToast();

  const unknownErr = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });

    toast({
      variant: "destructive",
      title: "error",
      description: errors.join("\n"),
    });
  } else if (isClerkAPIResponseError(err)) {
    toast({
      variant: "destructive",
      title: "error",
      description: err.errors[0]?.longMessage ?? unknownErr,
    });

    return;
  } else {
    toast({
      variant: "destructive",
      title: "error",
      description: unknownErr,
    });
    return;
  }
}
