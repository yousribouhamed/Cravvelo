import z from "zod";

export const chargilyConfigSchema = z.object({
  publicKey: z.string().min(1, "Public key is required"),
  secretKey: z.string().min(1, "Secret key is required"),
});

export const p2pConfigSchema = z.object({
  bankDetails: z.string().min(1, "Bank details are required"),
  accountHolder: z
    .string()
    .min(1, "Account holder name is required")
    .optional(),
  bankName: z.string().min(1, "Bank name is required").optional(),
  accountNumber: z.string().min(1, "Account number is required").optional(),
  routingNumber: z.string().optional(),
  notes: z.string().optional(),
});
