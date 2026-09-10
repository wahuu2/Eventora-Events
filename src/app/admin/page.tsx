import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import User from "@/database/user.model";
import Event from "@/database/event.model";
import Booking from "@/database/booking.model";
import Payment from "@/database/payment.model";
import Ticket from "@/database/ticket.model";
import Notification from "@/database/notification.model";

import {
  UsersIcon,
  CalendarDaysIcon,
  TicketIcon,
  CreditCardIcon,
  UserGroupIcon,
  BellIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default async function AdminDashboardPage() {
  const result = await requireAdmin();

  if (!result.authorized) {
    return null;
  }

  const [
    totalUsers,
    totalOrganizers,
    totalAdmins,
    totalEvents,
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    totalPayments,
    successfulPayments,
    failedPayments,
    totalTickets,
    validTickets,
    usedTickets,
    cancelledTickets,
    totalNotifications,
    unreadNotifications,
    recentUsers,
    recentEvents,
    recentBookings,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "organizer" }),
    User.countDocuments({ role: "admin" }),

    Event.countDocuments({}),

    Booking.countDocuments({}),
    Booking.countDocuments({ status: "confirmed" }),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "cancelled" }),

    Payment.countDocuments({}),
    Payment.countDocuments({ status: "successful" }),
    Payment.countDocuments({ status: "failed" }),

    Ticket.countDocuments({}),
    Ticket.countDocuments({ status: "valid" }),
    Ticket.countDocuments({ status: "used" }),
    Ticket.countDocuments({ status: "cancelled" }),

    Notification.countDocuments({}),
    Notification.countDocuments({ read: false }),

    User.find({})
      .select("firstName lastName email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Event.find({})
      .select("title date location createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Booking.find({})
      .populate("user", "firstName lastName email")
      .populate("event", "title")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const confirmedBookingRecords = await Booking.find({
    status: "confirmed",
  })
    .select("totalAmount")
    .lean();

  const revenue = confirmedBookingRecords.reduce(
    (total, booking) =>
      total + (Number(booking.totalAmount) || 0),
    0
  );

  const regularUsers = Math.max(
    totalUsers - totalOrganizers - totalAdmins,
    0
  );

  const confirmationRate =
    totalBookings > 0
      ? Math.round(
          (confirmedBookings / totalBookings) * 100
        )
      : 0;

  const ticketUsageRate =
    totalTickets > 0
      ? Math.round(
          (usedTickets / totalTickets) * 100
        )
      : 0;

  const paymentSuccessRate =
    totalPayments > 0
      ? Math.round(
          (successfulPayments / totalPayments) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />

        <div className="container-responsive relative py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent shadow-lg shadow-blue-500/30" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Administration
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Platform Overview
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary sm:text-base">
                Monitor Eventora's users, events, bookings,
                payments, tickets, and system activity from one
                central control center.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <QuickLink
                href="/admin/users"
                label="Users"
                value={totalUsers}
                icon={
                  <UsersIcon className="h-4 w-4" />
                }
              />

              <QuickLink
                href="/admin/events"
                label="Events"
                value={totalEvents}
                icon={
                  <CalendarDaysIcon className="h-4 w-4" />
                }
              />

              <QuickLink
                href="/admin/bookings"
                label="Bookings"
                value={totalBookings}
                icon={
                  <TicketIcon className="h-4 w-4" />
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Primary Metrics */}
      <section className="container-responsive py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Users"
            value={totalUsers}
            detail={`${totalOrganizers} organizers`}
            icon={<UsersIcon className="h-5 w-5" />}
          />

          <MetricCard
            label="Total Events"
            value={totalEvents}
            detail="Platform events"
            icon={
              <CalendarDaysIcon className="h-5 w-5" />
            }
          />

          <MetricCard
            label="Total Bookings"
            value={totalBookings}
            detail={`${confirmationRate}% confirmed`}
            icon={<TicketIcon className="h-5 w-5" />}
          />

          <MetricCard
            label="Confirmed Revenue"
            value={formatAmount(revenue)}
            detail={`${successfulPayments} successful payments`}
            icon={
              <BanknotesIcon className="h-5 w-5" />
            }
            accent
          />
        </div>
      </section>

      {/* Secondary Metrics */}
      <section className="container-responsive pb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SmallMetric
            label="Organizers"
            value={totalOrganizers}
            description="Event creators"
            icon={
              <UserGroupIcon className="h-5 w-5" />
            }
          />

          <SmallMetric
            label="Payments"
            value={totalPayments}
            description={`${failedPayments} failed`}
            icon={
              <CreditCardIcon className="h-5 w-5" />
            }
          />

          <SmallMetric
            label="Tickets"
            value={totalTickets}
            description={`${usedTickets} used`}
            icon={
              <TicketIcon className="h-5 w-5" />
            }
          />

          <SmallMetric
            label="Notifications"
            value={totalNotifications}
            description={`${unreadNotifications} unread`}
            icon={<BellIcon className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Platform Health */}
      <section className="container-responsive pb-6">
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Booking Status */}
          <DashboardCard
            title="Booking Status"
            description="Current booking distribution"
            icon={
              <ChartBarIcon className="h-5 w-5" />
            }
          >
            <div className="space-y-5">
              <StatusBar
                label="Confirmed"
                value={confirmedBookings}
                total={totalBookings}
                accent
              />

              <StatusBar
                label="Pending"
                value={pendingBookings}
                total={totalBookings}
              />

              <StatusBar
                label="Cancelled"
                value={cancelledBookings}
                total={totalBookings}
              />
            </div>
          </DashboardCard>

          {/* Ticket Status */}
          <DashboardCard
            title="Ticket Status"
            description="Digital ticket lifecycle"
            icon={<TicketIcon className="h-5 w-5" />}
          >
            <div className="space-y-5">
              <StatusBar
                label="Valid"
                value={validTickets}
                total={totalTickets}
                accent
              />

              <StatusBar
                label="Used"
                value={usedTickets}
                total={totalTickets}
              />

              <StatusBar
                label="Cancelled"
                value={cancelledTickets}
                total={totalTickets}
              />
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-muted">
                  Usage rate
                </span>

                <span className="text-sm font-bold">
                  {ticketUsageRate}%
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* System Summary */}
          <DashboardCard
            title="System Summary"
            description="Current platform composition"
            icon={
              <ArrowTrendingUpIcon className="h-5 w-5" />
            }
          >
            <div className="space-y-4">
              <SummaryRow
                label="Regular Users"
                value={regularUsers}
              />

              <SummaryRow
                label="Organizers"
                value={totalOrganizers}
              />

              <SummaryRow
                label="Administrators"
                value={totalAdmins}
              />

              <SummaryRow
                label="Successful Payments"
                value={successfulPayments}
              />

              <SummaryRow
                label="Unread Notifications"
                value={unreadNotifications}
                accent
              />
            </div>

            <div className="mt-6 rounded-xl border border-border bg-background-secondary/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
                    Payment success
                  </p>

                  <p className="mt-1 text-xs text-foreground-secondary">
                    Successful transactions
                  </p>
                </div>

                <span className="text-lg font-black">
                  {paymentSuccessRate}%
                </span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </section>

      {/* Recent Users + Events */}
      <section className="container-responsive pb-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <ActivityCard
            title="Recent Users"
            description="Latest accounts created on Eventora"
            href="/admin/users"
            linkLabel="View Users"
          >
            {recentUsers.length === 0 ? (
              <EmptyState message="No users found." />
            ) : (
              <div className="divide-y divide-border">
                {recentUsers.map((user) => {
                  const name =
                    `${user.firstName || ""} ${
                      user.lastName || ""
                    }`.trim() || "Unnamed User";

                  return (
                    <div
                      key={user._id.toString()}
                      className="flex min-w-0 items-center gap-3 py-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-xs font-bold text-accent">
                        {getInitials(name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-foreground-muted">
                          {user.email || "No email"}
                        </p>
                      </div>

                      <RoleBadge role={user.role} />
                    </div>
                  );
                })}
              </div>
            )}
          </ActivityCard>

          <ActivityCard
            title="Recent Events"
            description="Latest events added to the platform"
            href="/admin/events"
            linkLabel="View Events"
          >
            {recentEvents.length === 0 ? (
              <EmptyState message="No events found." />
            ) : (
              <div className="divide-y divide-border">
                {recentEvents.map((event) => (
                  <div
                    key={event._id.toString()}
                    className="flex min-w-0 items-center gap-3 py-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-accent">
                      <CalendarDaysIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {event.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-foreground-muted">
                        {event.location ||
                          "Location not specified"}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] font-semibold text-foreground-muted">
                      {formatDate(event.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ActivityCard>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="container-responsive pb-10">
        <ActivityCard
          title="Recent Bookings"
          description="Latest booking activity across the platform"
          href="/admin/bookings"
          linkLabel="View Bookings"
        >
          {recentBookings.length === 0 ? (
            <EmptyState message="No bookings found." />
          ) : (
            <div className="divide-y divide-border">
              {recentBookings.map((booking) => {
                const user = booking.user as
                  | {
                      firstName?: string;
                      lastName?: string;
                      email?: string;
                    }
                  | null;

                const event = booking.event as
                  | {
                      title?: string;
                    }
                  | null;

                const userName =
                  `${user?.firstName || ""} ${
                    user?.lastName || ""
                  }`.trim() || "Unknown User";

                return (
                  <div
                    key={booking._id.toString()}
                    className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-accent">
                        <TicketIcon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {userName}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-foreground-muted">
                          {event?.title ||
                            "Unknown Event"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="text-sm font-bold">
                        {formatAmount(
                          Number(booking.totalAmount) || 0
                        )}
                      </span>

                      <BookingBadge
                        status={booking.status}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ActivityCard>
      </section>
    </div>
  );
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function MetricCard({
  label,
  value,
  detail,
  icon,
  accent = false,
}: {
  label: string;
  value: number | string;
  detail: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border p-5 transition-all duration-200 ${
        accent
          ? "border-accent/30 bg-accent/10 hover:border-accent/50"
          : "border-border bg-card hover:border-border-hover hover:bg-card-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
            {label}
          </p>

          <p className="mt-4 truncate text-2xl font-black tracking-tight sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 truncate text-xs text-foreground-muted">
            {detail}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${
            accent
              ? "border-accent/20 bg-background text-accent"
              : "border-border bg-background text-accent"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SmallMetric({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-border-hover hover:bg-card-hover">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
            {label}
          </p>

          <p className="mt-3 text-2xl font-black">
            {value}
          </p>

          <p className="mt-1 text-xs text-foreground-muted">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-accent transition-transform duration-200 group-hover:scale-105">
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  value,
  icon,
}: {
  href: string;
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group min-w-0 rounded-xl border border-border bg-card px-3 py-3 transition-all duration-200 hover:border-accent/30 hover:bg-background-secondary sm:px-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-accent">
          {icon}
        </span>

        <p className="truncate text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
          {label}
        </p>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-lg font-black">
          {value}
        </p>

        <ArrowRightIcon className="hidden h-3.5 w-3.5 text-foreground-muted transition-transform group-hover:translate-x-0.5 sm:block" />
      </div>
    </Link>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-hover">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-accent">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-foreground-muted">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

function ActivityCard({
  title,
  description,
  href,
  linkLabel,
  children,
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-border-hover">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-bold">
            {title}
          </h2>

          <p className="mt-1 truncate text-xs text-foreground-muted">
            {description}
          </p>
        </div>

        <Link
          href={href}
          className="group inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold transition-all hover:border-accent/30 hover:bg-background-secondary"
        >
          {linkLabel}

          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="px-5">
        {children}
      </div>
    </div>
  );
}

function StatusBar({
  label,
  value,
  total,
  accent = false,
}: {
  label: string;
  value: number;
  total: number;
  accent?: boolean;
}) {
  const percentage =
    total > 0
      ? Math.min(
          Math.round((value / total) * 100),
          100
        )
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              accent
                ? "bg-accent"
                : "bg-foreground-muted"
            }`}
          />

          <span className="text-xs font-semibold">
            {label}
          </span>
        </div>

        <span className="text-xs font-bold text-foreground-secondary">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div
          className={`h-full rounded-full transition-all ${
            accent
              ? "bg-accent"
              : "bg-foreground-muted"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="mt-1.5 text-right text-[10px] text-foreground-muted">
        {percentage}%
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-foreground-secondary">
        {label}
      </span>

      <span
        className={`text-sm font-bold ${
          accent ? "text-accent" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function RoleBadge({
  role,
}: {
  role: string;
}) {
  const isAdmin = role === "admin";
  const isOrganizer = role === "organizer";

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
        isAdmin
          ? "border-accent/20 bg-accent/10 text-accent"
          : isOrganizer
            ? "border-border bg-background-secondary text-foreground-secondary"
            : "border-border bg-background text-foreground-muted"
      }`}
    >
      {role}
    </span>
  );
}

function BookingBadge({
  status,
}: {
  status: string;
}) {
  const normalizedStatus = status.toLowerCase();

  const isConfirmed =
    normalizedStatus === "confirmed";
  const isPending =
    normalizedStatus === "pending";
  const isCancelled =
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled";

  const styles = isConfirmed
    ? "border-green-500/20 bg-green-500/10 text-green-400"
    : isPending
      ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
      : isCancelled
        ? "border-red-500/20 bg-red-500/10 text-red-400"
        : "border-border bg-background text-foreground-muted";

  const icon = isConfirmed ? (
    <CheckCircleIcon className="h-3 w-3" />
  ) : isPending ? (
    <ClockIcon className="h-3 w-3" />
  ) : isCancelled ? (
    <XCircleIcon className="h-3 w-3" />
  ) : null;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${styles}`}
    >
      {icon}
      {status}
    </span>
  );
}

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex min-h-32 items-center justify-center py-10 text-center">
      <p className="text-xs text-foreground-muted">
        {message}
      </p>
    </div>
  );
}

/* ========================================================= */
/* HELPERS */
/* ========================================================= */

function formatAmount(amount: number) {
  return `KES ${Number(amount || 0).toLocaleString(
    "en-KE"
  )}`;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}