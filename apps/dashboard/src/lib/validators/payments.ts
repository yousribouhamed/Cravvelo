import * as z from "zod";

export const ChargilyConnectSchema = z.object({
  chargilyPrivateKey: z.string(),
  chargilyPublicKey: z.string(),
});
