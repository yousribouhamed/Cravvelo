"use client";

import { useEffect, useState, type FC } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { Button } from "@ui/components/ui/button";
import { Icons } from "../my-icons";
import { useMounted } from "@/src/hooks/use-mounted";
import { pusherClient } from "@/src/lib/pusher";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Notification } from "database";
import { Archive, MailWarning } from "lucide-react";
import { trpc } from "@/src/app/_trpc/client";
import { Badge } from "@ui/components/ui/badge";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/components/ui/tabs";
import { Package } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import Image from "next/image";
import { cn } from "@ui/lib/utils";

function timeSince(createdAt: Date): string {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000); // seconds in a year
  if (interval > 1) {
    return `منذ ${interval} سنوات`;
  } else if (interval === 1) {
    return "منذ سنة واحدة";
  }

  interval = Math.floor(seconds / 2592000); // seconds in a month
  if (interval > 1) {
    return `منذ ${interval} أشهر`;
  } else if (interval === 1) {
    return "منذ شهر واحد";
  }

  interval = Math.floor(seconds / 604800); // seconds in a week
  if (interval > 1) {
    return `منذ ${interval} أسابيع`;
  } else if (interval === 1) {
    return "منذ أسبوع واحد";
  }

  interval = Math.floor(seconds / 86400); // seconds in a day
  if (interval > 1) {
    return `منذ ${interval} أيام`;
  } else if (interval === 1) {
    return "منذ يوم واحد";
  }

  interval = Math.floor(seconds / 3600); // seconds in an hour
  if (interval > 1) {
    return `منذ ${interval} ساعات`;
  } else if (interval === 1) {
    return "منذ ساعة واحدة";
  }

  interval = Math.floor(seconds / 60); // seconds in a minute
  if (interval > 1) {
    return `منذ ${interval} دقائق`;
  } else if (interval === 1) {
    return "منذ دقيقة واحدة";
  }

  if (seconds < 10) {
    return "الآن";
  }

  return `منذ ${seconds} ثواني`;
}

interface NotificationsProps {
  notifications: Notification[];
  accountId: string;
}

const Notifications: FC<NotificationsProps> = ({
  notifications,
  accountId,
}) => {
  const isMounted = useMounted();

  const { data: ourNotifications, refetch } = trpc.getAllNotifications.useQuery(
    undefined,
    {
      initialData: notifications,
    }
  );

  const [data, setData] = useState<Notification[]>(ourNotifications);

  const [isNewNotifications, setIsNewNotifications] = useState<number>(
    ourNotifications.filter((item) => item.isRead !== true).length
  );

  useEffect(() => {
    // subscribe to an account id
    pusherClient?.subscribe(accountId ?? "");

    pusherClient?.bind("incomming-notifications", (data: Notification) => {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play();
      setIsNewNotifications((prev) => prev + 1);
      refetch().then(() => {
        setData(ourNotifications);
      });
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
        <div className="w-[500px] h-[450px] shadow bg-white  rounded-xl border">
          <div className="w-full h-[50px] flex items-center justify-start p-4">
            <p className="text-lg font-bold">الإشعارات</p>
          </div>

          <Tabs defaultValue="all" className=" w-full ">
            <TabsList className="w-full flex items-center justify-end h-[40px]   border-b">
              <TabsTrigger value="archived">
                مؤرشف
                <Package className="w-4 h-4 ml-2" />
              </TabsTrigger>
              <TabsTrigger value="all">الكل</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ScrollArea className="h-[330px] w-full flex flex-col gap-y-2  ">
                {data.map((item) => (
                  <div
                    key={item.id}
                    className={`w-full h-[75px] flex items-center justify-between border-b p-4   gap-x-4  ${
                      item.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="w-[50px] h-full flex items-center justify-center gap-x-2">
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Archive className="w-4 h-4 text-black" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ارشفت هذا الاشعار</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center justify-end gap-x-3">
                      <div className="flex flex-col h-full w-fit items-start justify-between  gap-2">
                        <div className="w-full h-[90%] flex items-start justify-start">
                          <span className="text-md font-medium text-black">
                            {" "}
                            {item.content}
                          </span>
                        </div>
                        <div className="flex w-full h-[10%] items-center justify-end gap-x-3">
                          <span className="text-xs  text-gray-500  ">
                            {timeSince(item?.createdAt)}
                          </span>
                          {!item.isRead && (
                            <Badge
                              variant="default"
                              className="bg-[#2ECA8B] text-white"
                            >
                              جديد
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="bg-primary/20 flex items-center justify-center w-[50px] h-[50px] rounded-xl">
                        {/* <Mail className="w-6 h-6 text-primary" /> */}
                        <MailWarning className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="archived">
              <div className="w-full h-[330px] flex flex-col justify-center items-center gap-y-5">
                <Image
                  loading="eager"
                  alt="verified image"
                  src="/notifications.svg"
                  width={300}
                  height={300}
                />
                <p className="text-md text-center text-gray-500">
                  لا يوجد إشعارات غير مقروءة بعد
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* {data.length === 0 ? (
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
                    className="w-full h-[60px] flex items-center justify-between border-b px-4 gap-x-4"
                  >
                    <span className="text-sm  text-gray-500  ">
                      {timeSince(item?.createdAt)}
                    </span>
                    <div className="flex h-full w-fit items-center gap-x-2">
                      <span className="text-md font-bold text-black">
                        {" "}
                        {item.content}
                      </span>
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
          {/* <div className="w-full h-[50px] flex items-start pb-2 justify-center">
            <Button size="sm" onClick={() => router.push("/")} variant="ghost">
              اظهار الكل
            </Button>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
