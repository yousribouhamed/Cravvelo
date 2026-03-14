"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FC,
  type ComponentProps,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@ui/components/ui/sheet";
import { Button } from "@ui/components/ui/button";
import { Icons } from "../my-icons";
import { useMounted } from "@/src/hooks/use-mounted";
import { pusherClient } from "@/src/lib/pusher";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Notification } from "database";
import { Archive, MailWarning, Package } from "lucide-react";
import { trpc } from "@/src/app/_trpc/client";
import { Badge } from "@ui/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/components/ui/tabs";
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
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: ourNotifications = [], refetch } =
    trpc.getAllNotifications.useQuery(undefined, {
      initialData: notifications,
      staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
      // If a page passes [] as initialData, we must refetch once to avoid a permanently empty list.
      refetchOnMount: notifications.length === 0,
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    });

  const [data, setData] = useState<Notification[]>(ourNotifications);
  const unreadUnarchivedCount = useMemo(
    () => data.filter((item) => !item.isRead && !item.isArchived).length,
    [data]
  );

  const readNotification = trpc.makeNotificationRead.useMutation({
    onSuccess: async () => {
      try {
        await refetch();
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

  const handleItemClick = async (item: Notification) => {
    if (!item.isRead) {
      await handleMarkAsRead(item.id);
    }
    if (item.actionUrl) {
      router.push(item.actionUrl);
      setDesktopOpen(false);
      setMobileOpen(false);
    }
  };

  const NotificationRow = ({
    item,
    archived = false,
  }: {
    item: Notification;
    archived?: boolean;
  }) => {
    const canArchive = !archived && !item.isArchived;
    const isUnread = !archived && !item.isRead;
    return (
      <div
        key={item.id}
        className={cn(
          "group w-full min-h-[86px] border-b border-border px-3 sm:px-4 py-3 transition-colors",
          "flex items-start gap-3",
          isRTL ? "flex-row-reverse text-right" : "text-left",
          isUnread
            ? "bg-primary/5 hover:bg-primary/10 cursor-pointer"
            : "hover:bg-muted/30"
        )}
        onClick={() => void handleItemClick(item)}
        role={!item.isRead ? "button" : undefined}
        tabIndex={!item.isRead ? 0 : undefined}
        onKeyDown={(e) => {
          if (!item.isRead && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            void handleItemClick(item);
          }
        }}
      >
        <div className="shrink-0 pt-0.5">
          <div
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-lg",
              archived ? "bg-muted/40" : "bg-primary/15"
            )}
          >
            <MailWarning
              className={cn(
                "h-5 w-5",
                archived ? "text-muted-foreground" : "text-primary"
              )}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm leading-6 break-words",
              archived ? "text-muted-foreground" : "text-foreground",
              !archived && !item.isRead && "font-semibold"
            )}
          >
            {getDisplayText(item)}
          </p>
          <div
            className={cn(
              "mt-2 flex items-center gap-2",
              isRTL ? "justify-end" : "justify-start"
            )}
          >
            <span className="text-xs text-muted-foreground">
              {timeSince(item.createdAt, isRTL ? "ar" : "en")}
            </span>
            {!archived && !item.isRead && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                {t("notifications.ui.badge.new")}
              </Badge>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canArchive) {
                      void handleArchive(item.id);
                    }
                  }}
                  variant="ghost"
                  size="icon"
                  disabled={!canArchive || archiveNotification.isLoading}
                  aria-label={
                    canArchive
                      ? t("notifications.ui.actions.archive")
                      : t("notifications.ui.actions.archived")
                  }
                  className={cn(
                    "transition-colors",
                    !canArchive && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Archive className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {canArchive
                    ? t("notifications.ui.actions.archive")
                    : t("notifications.ui.actions.archived")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  };

  const NotificationsPanel = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "bg-popover border border-border overflow-hidden",
        mobile ? "h-full rounded-none" : "rounded-xl shadow-xl"
      )}
    >
      <div className="h-14 border-b border-border px-4 flex items-center justify-between bg-card/80 backdrop-blur">
        <p className="text-lg font-semibold text-foreground">
          {t("notifications.ui.title")}
        </p>
        {unreadUnarchivedCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {unreadUnarchivedCount}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="border-b border-border px-2 py-2 bg-muted/20">
          <TabsList
            className={cn(
              "grid h-10 w-full grid-cols-2 bg-background/70",
              isRTL && "[&>*]:flex-row-reverse"
            )}
          >
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              {t("notifications.ui.tabs.all")}
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground gap-2"
            >
              <Package className="h-4 w-4" />
              {t("notifications.ui.tabs.archived")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="m-0">
          <ScrollArea className={cn(mobile ? "h-[calc(100vh-7.5rem)]" : "h-[360px]")}>
            {unarchivedNotifications.length === 0 ? (
              <div className="w-full h-[320px] flex flex-col justify-center items-center gap-y-4 px-4">
                <Image
                  loading="eager"
                  alt={t("notifications.ui.emptyStates.noNotificationsAlt")}
                  src="/empty-box.svg"
                  width={130}
                  height={130}
                  className="dark:opacity-80"
                />
                <p className="text-sm text-center text-muted-foreground">
                  {t("notifications.ui.emptyStates.noUnread")}
                </p>
              </div>
            ) : (
              unarchivedNotifications.map((item) => (
                <NotificationRow key={item.id} item={item} />
              ))
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="archived" className="m-0">
          <ScrollArea className={cn(mobile ? "h-[calc(100vh-7.5rem)]" : "h-[360px]")}>
            {archivedNotifications.length === 0 ? (
              <div className="w-full h-[320px] flex flex-col justify-center items-center gap-y-4 px-4">
                <Image
                  loading="eager"
                  alt={t("notifications.ui.emptyStates.noArchivedAlt")}
                  src="/empty-box.svg"
                  width={130}
                  height={130}
                  className="dark:opacity-80"
                />
                <p className="text-sm text-center text-muted-foreground">
                  {t("notifications.ui.emptyStates.noArchived")}
                </p>
              </div>
            ) : (
              archivedNotifications.map((item) => (
                <NotificationRow key={item.id} item={item} archived />
              ))
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  const NotificationTrigger = ({
    className = "",
    ...props
  }: ComponentProps<typeof Button>) => (
    <Button
      size="icon"
      className={cn(
        "!bg-card dark:bg-card border border-border rounded-xl w-10 h-10 relative hover:bg-accent transition-colors",
        className
      )}
      aria-label={
        unreadUnarchivedCount > 0
          ? t("notifications.ui.ariaLabelWithNew", { count: unreadUnarchivedCount })
          : t("notifications.ui.ariaLabel", { count: unreadUnarchivedCount })
      }
      {...props}
    >
      {unreadUnarchivedCount > 0 && (
        <span
          className={cn(
            "rounded-full min-w-5 h-5 px-1 text-white flex items-center justify-center bg-red-500 absolute -top-1 font-bold text-xs shadow-lg",
            isRTL ? "-left-1" : "-right-1"
          )}
        >
          {unreadUnarchivedCount > 99 ? "99+" : unreadUnarchivedCount}
        </span>
      )}
      <Icons.bell className="w-4 h-4 text-foreground" />
    </Button>
  );

  return (
    <>
      <div className="hidden sm:block">
        <Popover open={desktopOpen} onOpenChange={setDesktopOpen}>
          <PopoverTrigger asChild>
            <NotificationTrigger />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            alignOffset={8}
            sideOffset={10}
            avoidCollisions={false}
            dir={isRTL ? "rtl" : "ltr"}
            className="p-0 w-[460px] border-none shadow-none"
          >
            <NotificationsPanel />
          </PopoverContent>
        </Popover>
      </div>

      <div className="sm:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <NotificationTrigger />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="p-0 w-screen max-w-none h-screen border-none"
          >
            <NotificationsPanel mobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Notifications;
