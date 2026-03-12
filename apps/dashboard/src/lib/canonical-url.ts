const DEFAULT_DASHBOARD_BASE_URL = "https://app.cravvelo.com";

function normalizeUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  const withProtocol =
    value.startsWith("http://") || value.startsWith("https://")
      ? value
      : `https://${value}`;

  try {
    const parsed = new URL(withProtocol);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

export function resolveCanonicalDashboardBaseUrl(): string {
  const explicitBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "";
  const normalizedExplicit = normalizeUrl(explicitBaseUrl);
  if (normalizedExplicit) return normalizedExplicit;

  const normalizedDefault = normalizeUrl(DEFAULT_DASHBOARD_BASE_URL);
  if (normalizedDefault) return normalizedDefault;

  return DEFAULT_DASHBOARD_BASE_URL;
}
