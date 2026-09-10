import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import Booking from "@/database/booking.model";

import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TicketIcon,
  UserGroupIcon,
  XCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default async function AdminBookingsPage() {
  const result = await requireAdmin();

  if (!result.authorized) {
    return null;
  }

  const bookings = await Booking.find({})
    .populate("user", "firstName lastName email")
    .populate("event", "title date location")
    .sort({ createdAt: -1 })
    .lean();

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const confirmedRevenue = bookings
    .filter((booking) => booking.status === "confirmed")
    .reduce(
      (total, booking) =>
        total + (Number(booking.totalAmount) || 0),
      0
    );

  const totalTickets = bookings.reduce(
    (total, booking) => total + (Number(booking.quantity) || 0),
    0
  );

  const confirmationRate =
    totalBookings > 0
      ? Math.round((confirmedBookings / totalBookings) * 100)
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
                  <TicketIcon className="h-4 w-4" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                  Platform Management
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Bookings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary">
                Monitor attendee registrations, booking status,
                ticket quantities, and confirmed platform revenue.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-accent/20 bg-accent/10 p-4 sm:p-5 lg:w-auto lg:min-w-[220px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                    Total Bookings
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight">
                    {totalBookings.toLocaleString("en-KE")}
                  </p>

                  <p className="mt-1 text-xs text-foreground-muted">
                    All platform registrations
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background/30 text-accent">
                  <TicketIcon className="h-5 w-5" />
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
            label="Total Bookings"
            value={totalBookings}
            description="All platform bookings"
            icon={<TicketIcon className="h-5 w-5" />}
            accent
          />

          <StatCard
            label="Confirmed"
            value={confirmedBookings}
            description="Successful registrations"
            icon={<CheckCircleIcon className="h-5 w-5" />}
          />

          <StatCard
            label="Pending"
            value={pendingBookings}
            description="Awaiting confirmation"
            icon={<ClockIcon className="h-5 w-5" />}
          />

          <StatCard
            label="Cancelled"
            value={cancelledBookings}
            description="Cancelled bookings"
            icon={<XCircleIcon className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* PLATFORM SUMMARY */}
      <section className="container-responsive pb-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/10 p-5 sm:p-6 lg:col-span-2">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-accent/10 bg-accent/5" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Confirmed Revenue
                </p>

                <p className="mt-2 break-words text-2xl font-black tracking-tight sm:text-3xl">
                  {formatAmount(confirmedRevenue)}
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-foreground-secondary">
                  Revenue generated from confirmed bookings
                  across the platform.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background text-accent">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                  Ticket Volume
                </p>

                <p className="mt-2 text-3xl font-black tracking-tight">
                  {totalTickets.toLocaleString("en-KE")}
                </p>

                <p className="mt-1 text-xs text-foreground-muted">
                  Tickets across all bookings
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <UserGroupIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                  Confirmation Rate
                </span>

                <span className="text-xs font-bold text-accent">
                  {confirmationRate}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-background-secondary">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{
                    width: `${Math.min(confirmationRate, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKINGS TABLE */}
      <section className="container-responsive pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border bg-background-secondary/40 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-4 w-4 text-accent" />

                <h2 className="text-base font-bold">
                  Booking Activity
                </h2>
              </div>

              <p className="mt-1 text-xs leading-5 text-foreground-muted">
                Latest bookings appear first.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />

              <span className="text-xs font-semibold text-foreground-secondary">
                {totalBookings.toLocaleString("en-KE")} bookings
              </span>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="px-5 py-16 text-center sm:px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <TicketIcon className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-sm font-bold">
                No bookings found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-foreground-muted">
                No event bookings have been created on the
                platform yet.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-left">
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Attendee
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Event
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Reference
                    </th>

                    <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Qty
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => {
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
                          date?: Date | string;
                          location?: string;
                        }
                      | null;

                    const attendeeName =
                      `${user?.firstName || ""} ${
                        user?.lastName || ""
                      }`.trim() || "Unknown Attendee";

                    return (
                      <tr
                        key={booking._id.toString()}
                        className="group border-b border-border last:border-0 transition-colors duration-200 hover:bg-background-secondary/60"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-sm font-black text-accent transition-colors group-hover:border-accent/30 group-hover:bg-accent/15">
                              {getInitials(
                                user?.firstName,
                                user?.lastName
                              )}
                            </div>

                            <div className="min-w-0 max-w-[190px]">
                              <p className="truncate text-sm font-bold">
                                {attendeeName}
                              </p>

                              <p className="mt-1 truncate text-[10px] text-foreground-muted">
                                {user?.email ||
                                  "No email available"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="min-w-0 max-w-[220px]">
                            <p className="truncate text-sm font-semibold">
                              {event?.title ||
                                "Unknown Event"}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">
                              <CalendarDaysIcon className="h-3 w-3 shrink-0 text-foreground-muted" />

                              <p className="truncate text-[10px] text-foreground-muted">
                                {event?.date
                                  ? formatDate(event.date)
                                  : event?.location ||
                                    "Date not specified"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-block max-w-[150px] truncate rounded-lg border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] font-semibold text-foreground-secondary transition-colors group-hover:border-border-hover">
                            {booking.bookingReference ||
                              "N/A"}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-center">
                          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-border bg-background px-2 text-xs font-bold">
                            {booking.quantity || 0}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span className="whitespace-nowrap text-sm font-bold">
                            {formatAmount(
                              Number(booking.totalAmount) || 0
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge
                            status={booking.status}
                          />
                        </td>

                        <td className="px-5 py-5 text-right">
                          <span className="whitespace-nowrap text-xs text-foreground-secondary">
                            {formatDate(booking.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {bookings.length > 0 && (
          <div className="mt-4 flex flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-foreground-muted">
              Showing all platform bookings, newest first
            </p>

            <p className="text-[10px] text-foreground-muted">
              {confirmedBookings} confirmed · {pendingBookings}{" "}
              pending · {cancelledBookings} cancelled
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
/* STATUS BADGE */
/* ========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "confirmed"
      ? "border-accent/30 bg-accent/10 text-accent"
      : status === "pending"
        ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
        : status === "cancelled"
          ? "border-red-500/20 bg-red-500/10 text-red-400"
          : "border-border bg-background text-foreground-muted";

  const icon =
    status === "confirmed" ? (
      <CheckCircleIcon className="h-3.5 w-3.5" />
    ) : status === "pending" ? (
      <ClockIcon className="h-3.5 w-3.5" />
    ) : status === "cancelled" ? (
      <XCircleIcon className="h-3.5 w-3.5" />
    ) : (
      <TicketIcon className="h-3.5 w-3.5" />
    );

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${styles}`}
    >
      {icon}
      {status}
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

function formatAmount(amount: number) {
  return `KES ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}