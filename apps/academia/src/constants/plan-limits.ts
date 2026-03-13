type SubscriptionPlanCode = "BASIC" | "STARTER" | "GROWTH" | "SCALE";

export interface PlanLimits {
  storageBytes: number;
  videoBandwidthBytes: number;
  membersMax: number;
}

const PLAN_LIMITS: Record<SubscriptionPlanCode, PlanLimits> = {
  BASIC: {
    storageBytes: 2 * 1024 * 1024 * 1024,
    videoBandwidthBytes: 10 * 1024 * 1024 * 1024,
    membersMax: 50,
  },
  STARTER: {
    storageBytes: 10 * 1024 * 1024 * 1024,
    videoBandwidthBytes: 50 * 1024 * 1024 * 1024,
    membersMax: 500,
  },
  GROWTH: {
    storageBytes: 100 * 1024 * 1024 * 1024,
    videoBandwidthBytes: 500 * 1024 * 1024 * 1024,
    membersMax: 5000,
  },
  SCALE: {
    storageBytes: 500 * 1024 * 1024 * 1024,
    videoBandwidthBytes: 2 * 1024 * 1024 * 1024 * 1024,
    membersMax: 20000,
  },
};

const FREE_TIER_LIMITS: PlanLimits = {
  storageBytes: 500 * 1024 * 1024,
  videoBandwidthBytes: 2 * 1024 * 1024 * 1024,
  membersMax: 10,
};

export function getLimitsForPlanCode(planCode: string | null): PlanLimits {
  if (!planCode || !(planCode in PLAN_LIMITS)) {
    return FREE_TIER_LIMITS;
  }

  return PLAN_LIMITS[planCode as SubscriptionPlanCode];
}
