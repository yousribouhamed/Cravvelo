"use client";

import { useEffect, useState, type FC } from "react";
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
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationsProps {
  notifications: Notification[];
  accountId: string;
}

const Notifications: FC<NotificationsProps> = ({
  notifications,
  accountId,
}) => {
  const isMounted = useMounted();

  const router = useRouter();

  const [data, setData] = useState<Notification[]>(notifications ?? null);

  const [isNewNotifications, setIsNewNotifications] = useState<number>(0);

  useEffect(() => {
    setData(notifications);
    // subscribe to an account id
    pusherClient?.subscribe(accountId ?? "");

    pusherClient?.bind("incomming-notifications", (data: Notification) => {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play();
      console.log(data);
      setIsNewNotifications((prev) => prev + 1);
    });

    return () => {
      pusherClient?.unsubscribe(accountId ?? "");
    };
  }, [notifications, accountId]);

  if (!isMounted) {
    return null;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="bg-white border rounded-xl  relative"
        >
          {isNewNotifications > 0 && (
            <span className="rounded-[50%] w-5 h-5 text-white flex items-center justify-center bg-red-500 absolute top-0 right-0 font-bold text-xs">
              {isNewNotifications}
            </span>
          )}
          <Icons.bell className="w-4 h-4 text-black " />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="p-0 border-none ring-none shadow-none"
      >
        <div className="w-[500px] h-[450px] shadow bg-white p-2 rounded-xl border">
          <div className="w-full border-b h-[70px] flex items-center justify-start">
            <p className="text-xl font-bold">الإشعارات</p>
          </div>
          {data.length === 0 ? (
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
              <ScrollArea className="h-[330px] w-full flex flex-col gap-y-2  ">
                {data.map((item) => (
                  <div
                    key={item.id}
                    className="w-full h-[80px] flex items-center justify-end border-b p-4 gap-x-4"
                  >
                    <span className="text-xl font-bold text-black">
                      {" "}
                      {item.content}
                    </span>
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
          <div className="w-full h-[50px] flex items-start pb-2 justify-center">
            <Button size="sm" onClick={() => router.push("/")} variant="ghost">
              اظهار الكل
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
