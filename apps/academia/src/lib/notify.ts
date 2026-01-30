import type { Notification } from "database";
import { pusherServer } from "@/lib/pusher";

export const PUSHER_NOTIFICATION_EVENT = "incomming-notifications";

type NotificationCreateInput = Pick<
  Notification,
  "accountId" | "content" | "title" | "type" | "actionUrl" | "metadata"
>;

export async function createNotification({
  db,
  data,
}: {
  db: any;
  data: NotificationCreateInput;
}): Promise<Notification> {
  return db.notification.create({
    data: {
      accountId: data.accountId,
      content: data.content,
      title: data.title ?? null,
      type: data.type ?? "INFO",
      actionUrl: data.actionUrl ?? null,
      metadata: data.metadata ?? undefined,
    },
  });
}

export async function triggerNotificationEvent({
  accountId,
  payload,
}: {
  accountId: string;
  payload: unknown;
}) {
  // Never break business logic on realtime failures.
  if (!pusherServer) return;
  try {
    await pusherServer.trigger(accountId, PUSHER_NOTIFICATION_EVENT, payload);
  } catch (err) {
    console.error("Failed to trigger Pusher notification event:", err);
  }
}

export async function createAndTriggerNotification({
  db,
  data,
  payload,
}: {
  db: any;
  data: NotificationCreateInput;
  payload?: unknown;
}): Promise<Notification> {
  const notification = await createNotification({ db, data });
  await triggerNotificationEvent({
    accountId: data.accountId,
    payload: payload ?? { id: notification.id },
  });
  return notification;
}

