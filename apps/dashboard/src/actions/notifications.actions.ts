"use server";

import { pusherServer } from "../lib/pusher";

export const notifyUser = async () => {
  pusherServer.trigger(
    "secretId",
    "incomming-notifications",
    "abdullah is notifing"
  );
};
