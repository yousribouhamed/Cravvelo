import test from "node:test";
import assert from "node:assert/strict";
import { normalizeHost, resolveCanonicalTenantHost } from "./canonical-url.ts";

test("normalizeHost strips protocol, www prefix, path and port", () => {
  assert.equal(
    normalizeHost("https://www.TWICE.cravvelo.com:443/payments/success"),
    "twice.cravvelo.com"
  );
});

test("normalizeHost returns null for empty values", () => {
  assert.equal(normalizeHost(""), null);
  assert.equal(normalizeHost(null), null);
  assert.equal(normalizeHost(undefined), null);
});

test("resolveCanonicalTenantHost prefers custom domain", () => {
  assert.equal(
    resolveCanonicalTenantHost({
      tenant: "twice.cravvelo.com",
      customDomain: "https://www.academia-example.com",
      subdomain: "twice.cravvelo.com",
    }),
    "academia-example.com"
  );
});

test("resolveCanonicalTenantHost falls back to tenant/default", () => {
  assert.equal(
    resolveCanonicalTenantHost({
      tenant: "my-school.cravvelo.com",
      customDomain: null,
      subdomain: null,
    }),
    "my-school.cravvelo.com"
  );

  assert.equal(
    resolveCanonicalTenantHost({
      tenant: "",
      customDomain: null,
      subdomain: null,
    }),
    "twice.cravvelo.com"
  );
});
