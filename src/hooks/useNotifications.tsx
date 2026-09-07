"use client";

import { useEffect, useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/notifications");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch notifications"
        );
      }

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unexpected error fetching notifications"
      );

      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      setProcessingId(notificationId);

      const res = await fetch(
        `/api/notifications/${notificationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            read: true,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to mark notification as read"
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId ||
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read"
      );
    } finally {
      setProcessingId(null);
    }
  }

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchData,
    markAsRead,
    processingId,
  };
}