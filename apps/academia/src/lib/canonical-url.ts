const DEFAULT_TENANT_HOST = "twice.cravvelo.com";

export function normalizeHost(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  const withoutProtocol = trimmed.replace(/^https?:\/\//, "");
  const withoutPath = withoutProtocol.split("/")[0] ?? "";
  const withoutPort = withoutPath.split(":")[0] ?? "";
  const withoutWww = withoutPort.startsWith("www.")
    ? withoutPort.slice(4)
    : withoutPort;

  return withoutWww || null;
}

export function resolveCanonicalTenantHost({
  tenant,
  customDomain,
  subdomain,
}: {
  tenant?: string | null;
  customDomain?: string | null;
  subdomain?: string | null;
}): string {
  return (
    normalizeHost(customDomain) ??
    normalizeHost(subdomain) ??
    normalizeHost(tenant) ??
    DEFAULT_TENANT_HOST
  );
}
