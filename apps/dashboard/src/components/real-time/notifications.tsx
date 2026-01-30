"use client";

import { useEffect, useState, useCallback, type FC } from "react";
import Link from "next/link";
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
import { maketoast } from "../toasts";
import { timeSince } from "./time";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@ui/lib/utils";
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
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const { data: ourNotifications = [], refetch } =
    trpc.getAllNotifications.useQuery(undefined, {
      initialData: notifications,
      staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
      // If a page passes [] as initialData, we must refetch once to avoid a permanently empty list.
      refetchOnMount: notifications.length === 0,
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    });

  const [data, setData] = useState<Notification[]>(ourNotifications);
  const [isNewNotifications, setIsNewNotifications] = useState<number>(0);

  // Memoized function to update new notifications count
  const updateNewNotificationsCount = useCallback(() => {
    const count = data.filter((item) => item.isRead !== true).length;
    setIsNewNotifications(count);
  }, [data]);

  const readNotification = trpc.makeNotificationRead.useMutation({
    onSuccess: async () => {
      try {
        await refetch();
        updateNewNotificationsCount();
      } catch (error) {
        console.error(
          "Failed to refetch notifications after marking as read:",
          error
        );

        maketoast.errorWithText({ text: t("notifications.ui.errors.updateFailed") });
      }
    },
    onError: (err) => {
      console.error("Failed to mark notification as read:", err);
      maketoast.errorWithText({ text: t("notifications.ui.errors.markReadFailed") });
    },
  });

  const archiveNotification = trpc.makeNotificationArchived.useMutation({
    onSuccess: async () => {
      try {
        await refetch();
      } catch (error) {
        maketoast.errorWithText({ text: t("notifications.ui.errors.updateFailed") });
      }
    },
    onError: (err) => {
      console.error("Failed to archive notification:", err);

      maketoast.errorWithText({ text: t("notifications.ui.errors.archiveFailed") });
    },
  });

  // Update local data when ourNotifications changes
  useEffect(() => {
    setData(ourNotifications);
  }, [ourNotifications]);

  // Update notification count when data changes
  useEffect(() => {
    updateNewNotificationsCount();
  }, [updateNewNotificationsCount]);

  // Pusher subscription effect
  useEffect(() => {
    if (!accountId) return;

    const handleIncomingNotification = async (
      newNotification: Notification
    ) => {
      try {
        // Play notification sound
        const audio = new Audio("/sounds/notification.mp3");
        await audio
          .play()
          .catch((e) => console.warn("Could not play notification sound:", e));

        // Refetch to get latest notifications
        await refetch();
      } catch (error) {
        console.error("Failed to handle incoming notification:", error);
      }
    };

    // Subscribe to pusher channel
    pusherClient?.subscribe(accountId);
    pusherClient?.bind("incomming-notifications", handleIncomingNotification);

    // Cleanup function
    return () => {
      pusherClient?.unbind(
        "incomming-notifications",
        handleIncomingNotification
      );
      pusherClient?.unsubscribe(accountId);
    };
  }, [accountId, refetch]);

  if (!isMounted) {
    return null;
  }

  const unarchivedNotifications = data.filter((item) => !item.isArchived);
  const archivedNotifications = data.filter((item) => item.isArchived);

  const getDisplayText = (notification: Notification) => {
    const md = notification?.metadata as any;
    if (md && typeof md === "object" && typeof md.i18nKey === "string") {
      try {
        return t(md.i18nKey as string, (md.values ?? {}) as any);
      } catch {
        // fall back
      }
    }
    return notification.content;
  };

  const handleMarkAsRead = async (notificationId: string) => {
    // Optimistic UI update
    setData((prevData) =>
      prevData.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );

    try {
      await readNotification.mutateAsync({ id: notificationId });
    } catch (error) {
      // Revert optimistic update on error
      setData((prevData) =>
        prevData.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: false }
            : notification
        )
      );
    }
  };

  const handleArchive = async (notificationId: string) => {
    // Optimistic UI update
    setData((prevData) =>
      prevData.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isArchived: true }
          : notification
      )
    );

    try {
      await archiveNotification.mutateAsync({ id: notificationId });
    } catch (error) {
      // Revert optimistic update on error
      setData((prevData) =>
        prevData.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isArchived: false }
            : notification
        )
      );
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className=" !bg-card dark:bg-card border border-border rounded-xl w-10 h-10 relative hover:bg-accent transition-colors"
          aria-label={
            isNewNotifications > 0
              ? t("notifications.ui.ariaLabelWithNew", { count: isNewNotifications })
              : t("notifications.ui.ariaLabel", { count: isNewNotifications })
          }
        >
          {isNewNotifications > 0 && (
            <span
              className={cn(
                "rounded-full w-5 h-5 text-white flex items-center justify-center bg-red-500 absolute -top-1 font-bold text-xs shadow-lg",
                isRTL ? "-left-1" : "-right-1"
              )}
            >
              {isNewNotifications > 99 ? "99+" : isNewNotifications}
            </span>
          )}
          <Icons.bell className="w-4 h-4 text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={isRTL ? "start" : "end"}
        className="p-0 border-none ring-none shadow-none w-screen h-screen sm:w-[500px] sm:h-[450px]"
      >
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="shadow-lg bg-popover border border-border rounded-xl"
        >
          <div
            className={cn(
              "w-full h-[50px] flex items-center p-4 border-b border-border",
              isRTL ? "justify-end" : "justify-start"
            )}
          >
            <p className="text-lg font-bold text-foreground">
              {t("notifications.ui.title")}
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList
              className={cn(
                "w-full flex items-center h-[50px] border-b border-border bg-muted/30",
                isRTL ? "justify-start" : "justify-end"
              )}
            >
              <TabsTrigger
                value="archived"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                {t("notifications.ui.tabs.archived")}
                <Package className={cn("w-4 h-4", isRTL ? "mr-2" : "ml-2")} />
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                {t("notifications.ui.tabs.all")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ScrollArea className="h-[330px] w-full flex flex-col gap-y-2">
                {unarchivedNotifications.length === 0 ? (
                  <div className="w-full h-[330px] flex flex-col justify-center items-center gap-y-5">
                    <Image
                      loading="eager"
                      alt={t("notifications.ui.emptyStates.noNotificationsAlt")}
                      src="/empty-box.svg"
                      width={150}
                      height={150}
                      className="dark:opacity-80"
                    />
                    <p className="text-md text-center text-muted-foreground">
                      {t("notifications.ui.emptyStates.noUnread")}
                    </p>
                  </div>
                ) : (
                  unarchivedNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`w-full h-[75px] flex items-center justify-between border-b border-border p-4 gap-x-4 transition-colors ${
                        !item.isRead
                          ? "bg-primary/5 hover:bg-primary/10 cursor-pointer"
                          : "hover:bg-muted/30"
                      }`}
                      onClick={() => {
                        if (!item.isRead) {
                          handleMarkAsRead(item.id);
                        }
                        if (item.actionUrl) {
                          router.push(item.actionUrl);
                        }
                      }}
                      role={!item.isRead ? "button" : undefined}
                      tabIndex={!item.isRead ? 0 : undefined}
                      onKeyDown={(e) => {
                        if (
                          !item.isRead &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          handleMarkAsRead(item.id);
                        }
                      }}
                    >
                      <div className="w-[50px] h-full flex items-center justify-center gap-x-2">
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!item.isArchived) {
                                    handleArchive(item.id);
                                  }
                                }}
                                variant="ghost"
                                size="icon"
                                disabled={
                                  item.isArchived ||
                                  archiveNotification.isLoading
                                }
                                aria-label={t("notifications.ui.actions.archive")}
                                className="hover:bg-accent transition-colors"
                              >
                                <Archive className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("notifications.ui.actions.archive")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-x-3",
                          isRTL ? "justify-start" : "justify-end"
                        )}
                      >
                        <div
                          className={cn(
                            "flex flex-col h-full w-fit justify-between gap-2",
                            isRTL ? "items-end" : "items-start"
                          )}
                        >
                          <div
                            className={cn(
                              "w-full h-[90%] flex items-start",
                              isRTL ? "justify-end" : "justify-start"
                            )}
                          >
                            <span className="text-md font-medium text-foreground">
                              {item.actionUrl ? (
                                <Link
                                  href={item.actionUrl}
                                  onClick={(e) => e.stopPropagation()}
                                  className="hover:underline underline-offset-4"
                                >
                                  {getDisplayText(item)}
                                </Link>
                              ) : (
                                getDisplayText(item)
                              )}
                            </span>
                          </div>
                          <div
                            className={cn(
                              "flex w-full h-[10%] items-center gap-x-3",
                              isRTL ? "justify-start" : "justify-end"
                            )}
                          >
                            <span className="text-xs text-muted-foreground">
                              {timeSince(item.createdAt, isRTL ? "ar" : "en")}
                            </span>
                            {!item.isRead && (
                              <Badge
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                {t("notifications.ui.badge.new")}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="bg-primary/20 flex items-center justify-center w-[50px] h-[50px] rounded-xl">
                          <MailWarning className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="archived">
              <ScrollArea className="h-[330px] w-full flex flex-col gap-y-2">
                {archivedNotifications.length === 0 ? (
                  <div className="w-full h-[330px] flex flex-col justify-center items-center gap-y-5">
                    <Image
                      loading="eager"
                      alt={t("notifications.ui.emptyStates.noArchivedAlt")}
                      src="/empty-box.svg"
                      width={150}
                      height={150}
                      className="dark:opacity-80"
                    />
                    <p className="text-md text-center text-muted-foreground">
                      {t("notifications.ui.emptyStates.noArchived")}
                    </p>
                  </div>
                ) : (
                  archivedNotifications.map((item) => (
                    <div
                      key={item.id}
                      className="w-full h-[75px] flex items-center justify-between border-b border-border p-4 gap-x-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-[50px] h-full flex items-center justify-center gap-x-2">
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <Button
                                disabled
                                variant="ghost"
                                size="icon"
                                aria-label={t("notifications.ui.actions.archived")}
                                className="opacity-50"
                              >
                                <Archive className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("notifications.ui.actions.archived")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-x-3",
                          isRTL ? "justify-start" : "justify-end"
                        )}
                      >
                        <div
                          className={cn(
                            "flex flex-col h-full w-fit justify-between gap-2",
                            isRTL ? "items-end" : "items-start"
                          )}
                        >
                          <div
                            className={cn(
                              "w-full h-[90%] flex items-start",
                              isRTL ? "justify-end" : "justify-start"
                            )}
                          >
                            <span className="text-md font-medium text-muted-foreground">
                              {getDisplayText(item)}
                            </span>
                          </div>
                          <div
                            className={cn(
                              "flex w-full h-[10%] items-center gap-x-3",
                              isRTL ? "justify-start" : "justify-end"
                            )}
                          >
                            <span className="text-xs text-muted-foreground">
                              {timeSince(item.createdAt, isRTL ? "ar" : "en")}
                            </span>
                          </div>
                        </div>

                        <div className="bg-muted/50 flex items-center justify-center w-[50px] h-[50px] rounded-xl">
                          <MailWarning className="w-6 h-6 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
