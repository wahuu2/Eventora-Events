"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

import { useNotifications } from "../../hooks/useNotifications";

import {
  BellIcon,
  CheckCircleIcon,
  CreditCardIcon,
  TicketIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

function getNotificationIcon(type: string) {
  const iconClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border";

  switch (type) {
    case "booking_confirmed":
    case "success":
      return (
        <div
          className={`${iconClass} border-accent/20 bg-accent/10 text-accent`}
        >
          <CheckCircleIcon className="h-5 w-5" />
        </div>
      );

    case "payment_successful":
      return (
        <div
          className={`${iconClass} border-accent/20 bg-accent/10 text-accent`}
        >
          <CreditCardIcon className="h-5 w-5" />
        </div>
      );

    case "ticket_generated":
      return (
        <div
          className={`${iconClass} border-accent/20 bg-accent/10 text-accent`}
        >
          <TicketIcon className="h-5 w-5" />
        </div>
      );

    case "event_updated":
      return (
        <div
          className={`${iconClass} border-accent/20 bg-accent/10 text-accent`}
        >
          <ArrowPathIcon className="h-5 w-5" />
        </div>
      );

    case "event_cancelled":
    case "error":
      return (
        <div
          className={`${iconClass} border-red-500/20 bg-red-500/10 text-red-400`}
        >
          <XCircleIcon className="h-5 w-5" />
        </div>
      );

    case "event_reminder":
      return (
        <div
          className={`${iconClass} border-accent/20 bg-accent/10 text-accent`}
        >
          <ClockIcon className="h-5 w-5" />
        </div>
      );

    case "warning":
      return (
        <div
          className={`${iconClass} border-yellow-500/20 bg-yellow-500/10 text-yellow-400`}
        >
          <ExclamationTriangleIcon className="h-5 w-5" />
        </div>
      );

    default:
      return (
        <div
          className={`${iconClass} border-border bg-background-secondary text-foreground-muted`}
        >
          <InformationCircleIcon className="h-5 w-5" />
        </div>
      );
  }
}

function formatDate(date: string) {
  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  const now = new Date();

  const difference =
    now.getTime() - notificationDate.getTime();

  if (difference < 0) {
    return notificationDate.toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year:
        notificationDate.getFullYear() !== now.getFullYear()
          ? "numeric"
          : undefined,
    });
  }

  const minutes = Math.floor(
    difference / (1000 * 60)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return notificationDate.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year:
      notificationDate.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

export default function AdminTopBar() {
  const [open, setOpen] = useState(false);

  const {
    unreadCount,
    notifications,
    loading,
    error,
    refetch,
    markAsRead,
    processingId,
  } = useNotifications();

  return (
    <>
      {/* Notifications */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
            open
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-transparent text-foreground-secondary hover:border-border hover:bg-card hover:text-foreground"
          }`}
          aria-label="Notifications"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <BellIcon className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <>
            {/* Mobile Backdrop */}
            <button
              type="button"
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/30 sm:hidden"
            />

            {/* Notification Dropdown */}
            <div className="fixed left-4 right-4 top-[4.5rem] z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-[400px]">
              {/* Header */}
              <div className="border-b border-border bg-background-secondary/70 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                      <BellIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold">
                        Notifications
                      </h3>

                      <p className="mt-0.5 text-xs text-foreground-muted">
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${
                              unreadCount === 1 ? "" : "s"
                            }`
                          : "You're all caught up"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setOpen(false)}
                    className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
                  >
                    View all
                  </Link>
                </div>
              </div>

              {/* Notifications */}
              <div className="max-h-[min(60vh,460px)] overflow-y-auto">
                {loading ? (
                  <div className="space-y-2 p-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 rounded-xl border border-border bg-background p-3.5"
                      >
                        <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-border" />

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-3 w-3/4 animate-pulse rounded bg-border" />
                          <div className="h-3 w-full animate-pulse rounded bg-border" />
                          <div className="h-2.5 w-1/4 animate-pulse rounded bg-border" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="px-5 py-10 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-red-300">
                      Unable to load notifications
                    </p>

                    <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-foreground-muted">
                      Something went wrong while retrieving your
                      notifications.
                    </p>

                    <button
                      type="button"
                      onClick={refetch}
                      className="mt-4 rounded-lg border border-border-hover px-3.5 py-2 text-xs font-semibold text-foreground-secondary transition-all hover:bg-background hover:text-foreground"
                    >
                      Try again
                    </button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background-secondary text-foreground-muted">
                      <BellIcon className="h-6 w-6" />
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      No notifications yet
                    </p>

                    <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-foreground-muted">
                      Important booking, payment, ticket, and
                      event updates will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map(
                    (notification: Notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          !notification.read &&
                          markAsRead(notification.id)
                        }
                        disabled={
                          processingId === notification.id
                        }
                        className={`group flex w-full gap-3 border-b border-border p-4 text-left transition-all duration-200 ${
                          notification.read
                            ? "bg-card hover:bg-background-secondary"
                            : "bg-background-secondary/70 hover:bg-background-secondary"
                        } ${
                          processingId === notification.id
                            ? "cursor-wait opacity-50"
                            : ""
                        }`}
                      >
                        {getNotificationIcon(notification.type)}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p
                              className={`min-w-0 break-words text-sm leading-5 ${
                                notification.read
                                  ? "font-medium text-foreground-secondary"
                                  : "font-bold text-foreground"
                              }`}
                            >
                              {notification.title}
                            </p>

                            {!notification.read && (
                              <span
                                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent shadow-sm shadow-blue-500/40"
                                aria-label="Unread"
                              />
                            )}
                          </div>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-foreground-muted">
                            {notification.message}
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-[10px] font-medium text-foreground-muted/70">
                              {formatDate(notification.createdAt)}
                            </p>

                            {!notification.read && (
                              <span className="text-[10px] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                                Mark read
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  )
                )}
              </div>

              {/* Footer */}
              {notifications.length > 10 && (
                <div className="border-t border-border bg-background-secondary/50 p-3">
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setOpen(false)}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-foreground-secondary transition-all hover:bg-card hover:text-foreground"
                  >
                    View all notifications

                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* User */}
      <div className="ml-1 border-l border-border pl-2 sm:ml-2 sm:pl-3">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 sm:h-10 sm:w-10",
            },
          }}
        />
      </div>
    </>
  );
}