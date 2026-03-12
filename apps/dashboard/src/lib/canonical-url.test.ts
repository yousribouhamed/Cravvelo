import test from "node:test";
import assert from "node:assert/strict";
import { resolveCanonicalDashboardBaseUrl } from "./canonical-url.ts";

function withEnv(
  updates: Partial<Record<"NEXT_PUBLIC_APP_URL" | "APP_URL", string | undefined>>,
  run: () => void
) {
  const prevNextPublicAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const prevAppUrl = process.env.APP_URL;

  if (updates.NEXT_PUBLIC_APP_URL === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = updates.NEXT_PUBLIC_APP_URL;
  }

  if (updates.APP_URL === undefined) {
    delete process.env.APP_URL;
  } else {
    process.env.APP_URL = updates.APP_URL;
  }

  try {
    run();
  } finally {
    if (prevNextPublicAppUrl === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = prevNextPublicAppUrl;
    }

    if (prevAppUrl === undefined) {
      delete process.env.APP_URL;
    } else {
      process.env.APP_URL = prevAppUrl;
    }
  }
}

test("resolveCanonicalDashboardBaseUrl prefers NEXT_PUBLIC_APP_URL", () => {
  withEnv(
    { NEXT_PUBLIC_APP_URL: "https://billing.cravvelo.com/", APP_URL: "https://fallback.test" },
    () => {
      assert.equal(
        resolveCanonicalDashboardBaseUrl(),
        "https://billing.cravvelo.com"
      );
    }
  );
});

test("resolveCanonicalDashboardBaseUrl falls back to APP_URL", () => {
  withEnv({ NEXT_PUBLIC_APP_URL: undefined, APP_URL: "https://app.example.com/path" }, () => {
    assert.equal(resolveCanonicalDashboardBaseUrl(), "https://app.example.com");
  });
});

test("resolveCanonicalDashboardBaseUrl falls back to default host", () => {
  withEnv({ NEXT_PUBLIC_APP_URL: undefined, APP_URL: undefined }, () => {
    assert.equal(resolveCanonicalDashboardBaseUrl(), "https://app.cravvelo.com");
  });
});
