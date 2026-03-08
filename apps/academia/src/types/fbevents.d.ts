export {};

declare global {
  interface Window {
    fbq: (
      action: "init" | "track" | "trackCustom",
      ...args: (string | Record<string, unknown>)[]
    ) => void;
  }
}
