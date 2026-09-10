import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import Notification from "@/database/notification.model";

import {
  BellIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  UserGroupIcon,
  EnvelopeOpenIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  TicketIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default async function AdminNotificationsPage() {
  const result = await requireAdmin();

  if (!result.authorized) {
    return null;
  }

  const notifications = await Notification.find({})
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 })
    .lean();

  const totalNotifications = notifications.length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  ).length;

  const readNotifications = notifications.filter(
    (notification) => notification.read
  ).length;

  const uniqueUsers = new Set(
    notifications
      .map((notification) =>
        notification.user?._id
          ? notification.user._id.toString()
          : null
      )
      .filter(Boolean)
  ).size;

  const readPercentage =
    totalNotifications > 0
      ? Math.round((readNotifications / totalNotifications) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* PAGE HEADER */}
      <section className="border-b border-border bg-background-secondary/30">
        <div className="container-responsive py-7 sm:py-9 lg:py-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
                  <BellIcon className="h-4 w-4" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                  Platform Management
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Notifications
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary">
                Monitor system notifications, user activity, and
                important communication generated across Eventora.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-accent/20 bg-accent/10 p-4 sm:p-5 lg:w-auto lg:min-w-[220px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                    Total Notifications
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight">
                    {totalNotifications.toLocaleString("en-KE")}
                  </p>

                  <p className="mt-1 text-xs text-foreground-muted">
                    Generated across Eventora
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background/30 text-accent">
                  <BellIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="container-responsive py-5 sm:py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total"
            value={totalNotifications}
            description="All system notifications"
            icon={<BellIcon className="h-5 w-5" />}
            accent
          />

          <StatCard
            label="Unread"
            value={unreadNotifications}
            description="Awaiting user attention"
            icon={<EnvelopeIcon className="h-5 w-5" />}
          />

          <StatCard
            label="Read"
            value={readNotifications}
            description="Already viewed"
            icon={<EnvelopeOpenIcon className="h-5 w-5" />}
          />

          <StatCard
            label="Users Reached"
            value={uniqueUsers}
            description="Unique recipients"
            icon={<UserGroupIcon className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* NOTIFICATION SUMMARY */}
      <section className="container-responsive pb-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-5 sm:p-6 lg:col-span-2">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Notification Engagement
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  {readPercentage}%
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-foreground-secondary">
                  Percentage of platform notifications that have
                  already been viewed by recipients.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background text-accent">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                  Read Rate
                </span>

                <span className="text-xs font-bold text-accent">
                  {readPercentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-background-secondary">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{
                    width: `${Math.min(readPercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                  Current Queue
                </p>

                <p className="mt-2 text-3xl font-black tracking-tight">
                  {unreadNotifications.toLocaleString("en-KE")}
                </p>

                <p className="mt-1 text-xs text-foreground-muted">
                  Notifications awaiting attention
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <EnvelopeIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                  Unread
                </p>

                <p className="mt-1 text-lg font-black text-accent">
                  {unreadNotifications}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                  Read
                </p>

                <p className="mt-1 text-lg font-black">
                  {readNotifications}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTIFICATION ACTIVITY */}
      <section className="container-responsive pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border bg-background-secondary/40 px-4 py-5 sm:px-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <BellIcon className="h-4 w-4 text-accent" />

                <h2 className="text-base font-bold">
                  System Activity
                </h2>
              </div>

              <p className="mt-1 text-xs leading-5 text-foreground-muted">
                Latest notifications appear first.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />

              <span className="text-xs font-semibold text-foreground-secondary">
                {totalNotifications.toLocaleString("en-KE")}{" "}
                notifications
              </span>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="px-5 py-16 text-center sm:px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <BellIcon className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-sm font-bold">
                No notifications found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-foreground-muted">
                No system notifications have been generated yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const user = notification.user as
                  | {
                      _id?: string;
                      firstName?: string;
                      lastName?: string;
                      email?: string;
                    }
                  | null;

                const userName =
                  `${user?.firstName || ""} ${
                    user?.lastName || ""
                  }`.trim() || "Unknown User";

                return (
                  <div
                    key={notification._id.toString()}
                    className={`group px-4 py-5 transition-colors duration-200 sm:px-5 ${
                      notification.read
                        ? "hover:bg-background-secondary/60"
                        : "bg-accent/[0.035] hover:bg-accent/[0.06]"
                    }`}
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      {/* MAIN CONTENT */}
                      <div className="flex min-w-0 gap-3 sm:gap-4">
                        <NotificationIcon
                          type={notification.type}
                          read={notification.read}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                            <h3
                              className={`max-w-full break-words text-sm leading-5 ${
                                notification.read
                                  ? "font-semibold text-foreground-secondary"
                                  : "font-bold text-foreground"
                              }`}
                            >
                              {notification.title}
                            </h3>

                            <span className="w-fit max-w-full rounded-full border border-border bg-background px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-foreground-muted">
                              {formatNotificationType(
                                notification.type
                              )}
                            </span>
                          </div>

                          <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-foreground-secondary">
                            {notification.message}
                          </p>

                          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
                            <div className="flex min-w-0 items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-[10px] font-bold text-accent">
                                {getInitials(
                                  user?.firstName,
                                  user?.lastName
                                )}
                              </div>

                              <span className="max-w-[220px] truncate text-xs font-semibold text-foreground">
                                {userName}
                              </span>
                            </div>

                            <span className="hidden text-border sm:block">
                              •
                            </span>

                            <span className="max-w-full truncate text-xs text-foreground-muted">
                              {user?.email || "No email"}
                            </span>

                            <span className="hidden text-border sm:block">
                              •
                            </span>

                            <span className="text-xs text-foreground-muted">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className="shrink-0 lg:pt-1">
                        <ReadStatus
                          read={notification.read}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="mt-4 flex flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-foreground-muted">
              Showing all system notifications
            </p>

            <p className="text-[10px] text-foreground-muted">
              {unreadNotifications} unread · {readNotifications}{" "}
              read
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  label,
  value,
  description,
  icon,
  accent = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 sm:p-5 ${
        accent
          ? "border-accent/20 bg-accent/10"
          : "border-border bg-card hover:border-border-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            accent
              ? "border-accent/20 bg-background/30 text-accent"
              : "border-border bg-background text-foreground-muted group-hover:border-accent/30 group-hover:bg-accent/10 group-hover:text-accent"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1 text-right">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight">
            {value.toLocaleString("en-KE")}
          </p>

          <p className="mt-1 truncate text-xs text-foreground-muted">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* NOTIFICATION ICON */
/* ========================================================= */

function NotificationIcon({
  type,
  read,
}: {
  type: string;
  read: boolean;
}) {
  const iconClass = "h-5 w-5";

  let icon = <InformationCircleIcon className={iconClass} />;

  if (
    type === "booking_confirmed" ||
    type === "success"
  ) {
    icon = <CheckCircleIcon className={iconClass} />;
  } else if (type === "payment_successful") {
    icon = <CreditCardIcon className={iconClass} />;
  } else if (type === "ticket_generated") {
    icon = <TicketIcon className={iconClass} />;
  } else if (type === "event_updated") {
    icon = <ArrowPathIcon className={iconClass} />;
  } else if (type === "event_cancelled") {
    icon = <ExclamationTriangleIcon className={iconClass} />;
  } else if (type === "event_reminder") {
    icon = <CalendarDaysIcon className={iconClass} />;
  } else if (type === "warning" || type === "error") {
    icon = <ExclamationTriangleIcon className={iconClass} />;
  }

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
        read
          ? "border-border bg-background text-foreground-muted"
          : "border-accent/20 bg-accent/10 text-accent"
      }`}
    >
      {icon}
    </div>
  );
}

/* ========================================================= */
/* READ STATUS */
/* ========================================================= */

function ReadStatus({
  read,
}: {
  read: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
        read
          ? "border-border bg-background text-foreground-muted"
          : "border-accent/30 bg-accent/10 text-accent"
      }`}
    >
      {read ? (
        <EnvelopeOpenIcon className="h-3.5 w-3.5" />
      ) : (
        <EnvelopeIcon className="h-3.5 w-3.5" />
      )}

      {read ? "Read" : "Unread"}
    </span>
  );
}

/* ========================================================= */
/* HELPERS */
/* ========================================================= */

function getInitials(
  firstName?: string,
  lastName?: string
) {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "U";
}

function formatNotificationType(type: string) {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(date: Date | string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}