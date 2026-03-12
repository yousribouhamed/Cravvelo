import test from "node:test";
import assert from "node:assert/strict";
import {
  getSubscriptionPeriod,
  isValidUpgradeWebhookMetadata,
  verifyChargilySignature,
} from "./chargily-upgrade-webhook.ts";

test("verifyChargilySignature validates matching signature", () => {
  const body = JSON.stringify({ type: "checkout.paid", id: "evt_123" });
  const secretKey = "test_sk_my_secret";
  const validSignature = "14b9d9e2716780283219cf33585367e3cbb9d0f04ed9ef1801ce26b0c03d3fee";

  assert.equal(
    verifyChargilySignature({
      body,
      signature: validSignature,
      secretKey,
    }),
    true
  );
});

test("verifyChargilySignature rejects non-matching signature", () => {
  const body = JSON.stringify({ type: "checkout.failed", id: "evt_456" });
  const secretKey = "test_sk_my_secret";

  assert.equal(
    verifyChargilySignature({
      body,
      signature: "wrong",
      secretKey,
    }),
    false
  );
});

test("isValidUpgradeWebhookMetadata enforces required and allowed values", () => {
  assert.equal(
    isValidUpgradeWebhookMetadata({
      accountId: "acc_1",
      paymentId: "pay_1",
      planCode: "BASIC",
      billingCycle: "MONTHLY",
    }),
    true
  );

  assert.equal(
    isValidUpgradeWebhookMetadata({
      accountId: "acc_1",
      paymentId: "pay_1",
      planCode: "INVALID",
      billingCycle: "MONTHLY",
    }),
    false
  );
});

test("getSubscriptionPeriod advances by billing cycle", () => {
  const now = new Date("2026-03-12T10:00:00.000Z");

  const monthly = getSubscriptionPeriod("MONTHLY", now);
  const yearly = getSubscriptionPeriod("YEARLY", now);

  assert.equal(monthly.currentPeriodStart.toISOString(), now.toISOString());
  assert.equal(monthly.currentPeriodEnd.toISOString(), "2026-04-12T10:00:00.000Z");
  assert.equal(yearly.currentPeriodStart.toISOString(), now.toISOString());
  assert.equal(yearly.currentPeriodEnd.toISOString(), "2027-03-12T10:00:00.000Z");
});
