"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { api, type AppNotification } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function formatWhen(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await api.listNotifications();
      setNotifications(res.data);
      setUnreadCount(res.unread_count);
    } catch {
      // Silent fail — bell stays usable without blocking the dashboard.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = window.setInterval(loadNotifications, 45_000);
    return () => window.clearInterval(interval);
  }, [loadNotifications]);

  async function handleOpenChange(open: boolean) {
    if (open) {
      await loadNotifications();
    }
  }

  async function handleNotificationClick(notification: AppNotification) {
    if (!notification.read_at) {
      try {
        await api.markNotificationRead(notification.id);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, read_at: new Date().toISOString() }
              : item,
          ),
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch {
        // Continue navigation even if mark-read fails.
      }
    }

    if (notification.meeting_id) {
      router.push(`/dashboard/meetings/${notification.meeting_id}`);
    }
  }

  async function handleMarkAllRead() {
    try {
      await api.markAllNotificationsRead();
      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read_at: item.read_at ?? new Date().toISOString(),
        })),
      );
      setUnreadCount(0);
    } catch {
      // No-op
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <Badge className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>Notifications</span>
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="text-muted-foreground px-3 py-4 text-sm">
            Loading notifications…
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-muted-foreground px-3 py-4 text-sm">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-pointer flex-col items-start gap-1 py-3"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span
                  className={`text-sm leading-5 ${
                    notification.read_at ? "text-muted-foreground" : "font-medium"
                  }`}
                >
                  {notification.message}
                </span>
                {!notification.read_at ? (
                  <span className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                ) : null}
              </div>
              <span className="text-muted-foreground text-xs">
                {formatWhen(notification.created_at)}
              </span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="justify-center text-sm">
            View meetings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
