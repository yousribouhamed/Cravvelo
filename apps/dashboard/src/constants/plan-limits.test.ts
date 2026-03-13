import test from "node:test";
import assert from "node:assert/strict";
import { getLimitsForPlanCode, PLAN_LIMITS } from "./plan-limits.ts";

test("plan limits include storage and video bandwidth", () => {
  assert.equal(PLAN_LIMITS.BASIC.storageBytes, 2 * 1024 * 1024 * 1024);
  assert.equal(PLAN_LIMITS.BASIC.videoBandwidthBytes, 10 * 1024 * 1024 * 1024);

  assert.equal(PLAN_LIMITS.STARTER.storageBytes, 10 * 1024 * 1024 * 1024);
  assert.equal(PLAN_LIMITS.STARTER.videoBandwidthBytes, 50 * 1024 * 1024 * 1024);

  assert.equal(PLAN_LIMITS.GROWTH.storageBytes, 100 * 1024 * 1024 * 1024);
  assert.equal(PLAN_LIMITS.GROWTH.videoBandwidthBytes, 500 * 1024 * 1024 * 1024);

  assert.equal(PLAN_LIMITS.SCALE.storageBytes, 500 * 1024 * 1024 * 1024);
  assert.equal(
    PLAN_LIMITS.SCALE.videoBandwidthBytes,
    2 * 1024 * 1024 * 1024 * 1024
  );
});

test("getLimitsForPlanCode returns free tier limits when missing", () => {
  const fallback = getLimitsForPlanCode(null);
  assert.equal(fallback.storageBytes, 500 * 1024 * 1024);
  assert.equal(fallback.videoBandwidthBytes, 2 * 1024 * 1024 * 1024);
  assert.equal(fallback.membersMax, 10);
});
