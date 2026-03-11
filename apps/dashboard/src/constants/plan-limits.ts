import type { SubscriptionPlanCode } from "./subscription-plans";

export interface PlanLimits {
  storageBytes: number;
  membersMax: number;
}

/** Plan limits by planCode (from subscription-plans feature text). */
export const PLAN_LIMITS: Record<SubscriptionPlanCode, PlanLimits> = {
  BASIC: { storageBytes: 2 * 1024 * 1024 * 1024, membersMax: 50 },
  STARTER: { storageBytes: 10 * 1024 * 1024 * 1024, membersMax: 500 },
  GROWTH: { storageBytes: 100 * 1024 * 1024 * 1024, membersMax: 5000 },
  SCALE: { storageBytes: 500 * 1024 * 1024 * 1024, membersMax: 20000 },
};

/** Free tier when user has no active subscription (e.g. can create one course). */
export const FREE_TIER_STORAGE_BYTES = 500 * 1024 * 1024; // 500 MB
export const FREE_TIER_MEMBERS_MAX = 10;

export const FREE_TIER_LIMITS: PlanLimits = {
  storageBytes: FREE_TIER_STORAGE_BYTES,
  membersMax: FREE_TIER_MEMBERS_MAX,
};

export function getLimitsForPlanCode(planCode: SubscriptionPlanCode | null): PlanLimits {
  if (!planCode || !(planCode in PLAN_LIMITS)) {
    return FREE_TIER_LIMITS;
  }
  return PLAN_LIMITS[planCode as SubscriptionPlanCode];
}
