"use client";

import { useEffect, type FC } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { Button } from "@ui/components/ui/button";
import { Icons } from "../my-icons";
import Image from "next/image";
import { useMounted } from "@/src/hooks/use-mounted";
import { pusherClient } from "@/src/lib/pusher";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Notification } from "database";

interface NotificationsProps {
  notifications: Notification[];

  accountId: string;
}
// we have to get a list of all the notifications
// we need to update the array of notifications
const Notifications: FC<NotificationsProps> = ({
  notifications,
  accountId,
}) => {
  const isMounted = useMounted();

  useEffect(() => {
    // subscribe to an account id
    // updadet the array of notifications
    // unsbscripe to an account id
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="bg-white border rounded-xl "
        >
          <Icons.bell className="w-4 h-4 text-black " />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="p-0 border-none ring-none shadow-none"
      >
        <div className="w-[500px] h-[400px] shadow bg-white p-2 rounded-xl border">
          <div className="w-full border-b h-[70px] flex items-center justify-start">
            <p className="text-xl font-bold">الإشعارات</p>
          </div>
          {notifications.length === 0 ? (
            <div className="w-full h-[330px] flex flex-col justify-center items-center gap-y-5">
              <Image
                alt="verified image"
                src="/notifications.svg"
                width={300}
                height={300}
              />
              <p className="text-md text-center text-gray-500">
                لا يوجد إشعارات غير مقروءة بعد
              </p>
            </div>
          ) : (
            <div className="w-full h-[330px] flex flex-col justify-center items-center gap-y-5">
              <ScrollArea className="h-[330px] w-full ">blabla</ScrollArea>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
