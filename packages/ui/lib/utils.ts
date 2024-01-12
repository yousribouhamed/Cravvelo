import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export { toast };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
