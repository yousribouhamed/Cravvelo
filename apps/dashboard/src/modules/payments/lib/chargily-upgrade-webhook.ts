import crypto from "crypto";

export type UpgradeWebhookMetadata = {
  accountId?: string | null;
  planCode?: string | null;
  billingCycle?: string | null;
  paymentId?: string | null;
};

const VALID_PLAN_CODES = new Set(["BASIC", "STARTER", "GROWTH", "SCALE"]);
const VALID_BILLING_CYCLES = new Set(["MONTHLY", "YEARLY"]);

export function verifyChargilySignature({
  body,
  signature,
  secretKey,
}: {
  body: string;
  signature: string;
  secretKey: string;
}): boolean {
  const computedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(body)
    .digest("hex");

  return computedSignature === signature;
}

export function isValidUpgradeWebhookMetadata(
  metadata: UpgradeWebhookMetadata
): metadata is Required<UpgradeWebhookMetadata> {
  if (!metadata.accountId || !metadata.paymentId) return false;
  if (!metadata.planCode || !VALID_PLAN_CODES.has(metadata.planCode)) return false;
  if (!metadata.billingCycle || !VALID_BILLING_CYCLES.has(metadata.billingCycle)) {
    return false;
  }
  return true;
}

export function getSubscriptionPeriod(
  billingCycle: "MONTHLY" | "YEARLY",
  now: Date = new Date()
): { currentPeriodStart: Date; currentPeriodEnd: Date } {
  const currentPeriodStart = new Date(now);
  const currentPeriodEnd = new Date(now);

  if (billingCycle === "YEARLY") {
    currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
  } else {
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
  }

  return { currentPeriodStart, currentPeriodEnd };
}
