export {};

declare global {
  interface Window {
    fbq: (
      action: "init" | "track" | "trackCustom",
      ...args: (string | Record<string, unknown>)[]
    ) => void;
    ttq?: {
      page: () => void;
      track: (event: string, properties?: Record<string, unknown>) => void;
      identify: (payload: Record<string, unknown>) => void;
      [key: string]: unknown;
    };
  }
}
