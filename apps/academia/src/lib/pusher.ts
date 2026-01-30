import PusherServer from "pusher";

const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const secret = process.env.PUSHER_APP_SECRET;

// Keep consistent with dashboard default.
const cluster = process.env.PUSHER_CLUSTER ?? "eu";

/**
 * Server-side Pusher instance for Academia.
 *
 * NOTE: This is intentionally nullable so server actions don't crash in
 * environments that haven't configured Pusher yet (e.g. local/dev).
 */
export const pusherServer: PusherServer | null =
  appId && key && secret
    ? new PusherServer({
        appId,
        key,
        secret,
        cluster,
        useTLS: true,
      })
    : null;

