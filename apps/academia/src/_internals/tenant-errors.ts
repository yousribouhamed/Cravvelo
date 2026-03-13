/**
 * Message thrown when DB is unreachable (P1001) or pool times out (P2024).
 * The tenant error page shows a translated database-unavailable message when it receives this.
 * Keep this file free of server-only imports so it can be used from Client Components.
 */
export const DATABASE_UNAVAILABLE_MESSAGE = "DATABASE_UNAVAILABLE" as const;
