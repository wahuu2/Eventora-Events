"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  MapPinIcon,
  TicketIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type User = {
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
};

type Event = {
  _id: string;
  title: string;
  image?: string;
  location?: string;
  date?: string;
  time?: string;
};

type Booking = {
  _id: string;
  quantity: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | string;
  bookingReference: string;
  createdAt: string;
  user?: User;
  event?: Event;
};

const statusStyles: Record<string, string> = {
  confirmed:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  pending:
    "border-amber-500/20 bg-amber-500/10 text-amber-400",
  cancelled:
    "border-red-500/20 bg-red-500/10 text-red-400",
};

function getStatusIcon(status: string) {
  if (status === "confirmed") {
    return CheckCircleIcon;
  }

  if (status === "cancelled") {
    return XCircleIcon;
  }

  return ClockIcon;
}

function getStatusClasses(status: string) {
  return (
    statusStyles[status] ||
    "border-border bg-background-secondary text-foreground-secondary"
  );
}

export default function OrganizerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchBookings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/organizer/bookings");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch bookings."
        );
      }

      setBookings(data.bookings);
    } catch (error) {
      console.error(
        "Failed to fetch organizer bookings:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const summary = useMemo(() => {
    return {
      totalBookings: bookings.length,
      totalTickets: bookings.reduce(
        (total, booking) => total + booking.quantity,
        0
      ),
      confirmed: bookings.filter(
        (booking) => booking.status === "confirmed"
      ).length,
      revenue: bookings
        .filter((booking) => booking.status === "confirmed")
        .reduce(
          (total, booking) => total + booking.totalAmount,
          0
        ),
    };
  }, [bookings]);

  function getAttendeeName(user?: User) {
    const name =
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

    return name || "Unknown attendee";
  }

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatCurrency(amount: number) {
    return `KES ${amount.toLocaleString("en-KE")}`;
  }

  return (
    <main className="w-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* Header */}
        <section>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

              <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                      Organizer Workspace
                    </span>
                  </div>

                  <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    Event Bookings
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-secondary sm:text-base">
                    Monitor registrations, attendees, ticket quantities,
                    payments, and booking activity across your events.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                  <Link
                    href="/dashboard/organizer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border-hover px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-accent/40 hover:bg-background-secondary sm:w-auto"
                  >
                    <ArrowRightIcon className="h-4 w-4 rotate-180" />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/events"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/10 transition-all duration-200 hover:bg-accent-hover hover:shadow-accent/20 sm:w-auto"
                  >
                    Manage Events
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error */}
        {!loading && error && (
          <section
            role="alert"
            className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:p-6"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-400">
                    Unable to load bookings
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-300/80">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchBookings}
                className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </section>
        )}

        {/* Summary */}
        {!loading && !error && (
          <section className="mt-8 sm:mt-10">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                Booking Overview
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Your event activity
              </h2>

              <p className="mt-1 text-sm text-foreground-secondary">
                A quick view of your current registration performance.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Total Bookings"
                value={summary.totalBookings.toLocaleString()}
                description="Registrations across your events"
                meta="All bookings"
                icon={CalendarDaysIcon}
              />

              <SummaryCard
                label="Tickets Booked"
                value={summary.totalTickets.toLocaleString()}
                description="Total ticket quantity requested"
                meta="Ticket volume"
                icon={TicketIcon}
              />

              <SummaryCard
                label="Confirmed Bookings"
                value={summary.confirmed.toLocaleString()}
                description="Successfully confirmed registrations"
                meta="Confirmed"
                icon={CheckCircleIcon}
                iconClassName="bg-emerald-500/10 text-emerald-400"
              />

              <SummaryCard
                label="Confirmed Revenue"
                value={formatCurrency(summary.revenue)}
                description="Revenue from confirmed bookings"
                meta="Revenue"
                icon={CurrencyDollarIcon}
              />
            </div>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <section className="mt-8 sm:mt-10">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-background-secondary" />

                  <div className="mt-6 h-4 w-28 animate-pulse rounded bg-background-secondary" />

                  <div className="mt-3 h-9 w-24 animate-pulse rounded bg-background-secondary" />

                  <div className="mt-3 h-3 w-40 animate-pulse rounded bg-background-secondary" />
                </div>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card p-6">
              <div className="h-6 w-36 animate-pulse rounded bg-background-secondary" />

              <div className="mt-2 h-4 w-52 animate-pulse rounded bg-background-secondary" />

              <div className="mt-8 space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex gap-4 border-b border-border pb-4 last:border-0"
                  >
                    <div className="h-10 w-10 animate-pulse rounded-full bg-background-secondary" />

                    <div className="flex-1">
                      <div className="h-4 w-40 animate-pulse rounded bg-background-secondary" />

                      <div className="mt-2 h-3 w-28 animate-pulse rounded bg-background-secondary" />
                    </div>

                    <div className="hidden h-4 w-20 animate-pulse rounded bg-background-secondary sm:block" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <section className="mt-8">
            <div className="rounded-2xl border border-dashed border-border-hover bg-card px-6 py-16 text-center shadow-sm sm:py-20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
                <TicketIcon className="h-7 w-7" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                No activity yet
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                No bookings yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground-secondary">
                Bookings for your events will appear here when attendees
                start registering.
              </p>

              <Link
                href="/dashboard/organizer/events"
                className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover sm:w-auto"
              >
                Manage My Events
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Bookings */}
        {!loading && !error && bookings.length > 0 && (
          <section className="mt-10 sm:mt-12">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                  Registration Activity
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                  All bookings
                </h2>

                <p className="mt-1 text-sm text-foreground-secondary">
                  {bookings.length.toLocaleString()}{" "}
                  {bookings.length === 1 ? "booking" : "bookings"} found
                </p>
              </div>

              <Link
                href="/dashboard/organizer/events"
                className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-hover"
              >
                Manage events
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid gap-4 lg:hidden">
              {bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);

                return (
                  <article
                    key={booking._id}
                    className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-border-hover hover:shadow-md"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          {booking.user?.imageUrl ? (
                            <img
                              src={booking.user.imageUrl}
                              alt=""
                              className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-sm font-bold text-accent">
                              {getAttendeeName(booking.user)
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {getAttendeeName(booking.user)}
                            </p>

                            {booking.user?.email && (
                              <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-foreground-muted">
                                <EnvelopeIcon className="h-3.5 w-3.5 shrink-0" />

                                <p className="truncate">
                                  {booking.user.email}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${getStatusClasses(
                            booking.status
                          )}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-5 rounded-xl border border-border bg-background-secondary p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                          Event
                        </p>

                        <p className="mt-2 truncate font-medium">
                          {booking.event?.title || "Unknown event"}
                        </p>

                        {booking.event?.location && (
                          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-foreground-muted">
                            <MapPinIcon className="h-3.5 w-3.5 shrink-0" />

                            <p className="truncate">
                              {booking.event.location}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
                        <BookingDetail
                          label="Tickets"
                          value={booking.quantity.toString()}
                          icon={TicketIcon}
                        />

                        <BookingDetail
                          label="Amount"
                          value={formatCurrency(booking.totalAmount)}
                          icon={CurrencyDollarIcon}
                        />

                        <BookingDetail
                          label="Booked"
                          value={formatDate(booking.createdAt)}
                          icon={CalendarDaysIcon}
                        />

                        <BookingDetail
                          label="Reference"
                          value={booking.bookingReference}
                          icon={TicketIcon}
                          mono
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:block">
              <div className="table-wrapper overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead className="border-b border-border bg-background-secondary">
                    <tr>
                      <TableHeading label="Attendee" />
                      <TableHeading label="Event" />
                      <TableHeading label="Tickets" />
                      <TableHeading label="Amount" />
                      <TableHeading label="Status" />
                      <TableHeading label="Reference" />
                      <TableHeading label="Date" />
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => {
                      const StatusIcon = getStatusIcon(booking.status);

                      return (
                        <tr
                          key={booking._id}
                          className="border-b border-border transition-colors last:border-0 hover:bg-background-secondary/70"
                        >
                          {/* Attendee */}
                          <td className="px-6 py-5">
                            <div className="flex min-w-[190px] items-center gap-3">
                              {booking.user?.imageUrl ? (
                                <img
                                  src={booking.user.imageUrl}
                                  alt=""
                                  className="h-9 w-9 shrink-0 rounded-full border border-border object-cover"
                                />
                              ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-xs font-bold text-accent">
                                  {getAttendeeName(booking.user)
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate font-medium">
                                  {getAttendeeName(booking.user)}
                                </p>

                                {booking.user?.email && (
                                  <p className="mt-1 max-w-[180px] truncate text-xs text-foreground-muted">
                                    {booking.user.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Event */}
                          <td className="px-6 py-5">
                            <div className="min-w-[200px]">
                              <p className="max-w-[230px] truncate font-medium">
                                {booking.event?.title || "Unknown event"}
                              </p>

                              {booking.event?.location && (
                                <div className="mt-1 flex max-w-[230px] items-center gap-1.5 text-xs text-foreground-muted">
                                  <MapPinIcon className="h-3.5 w-3.5 shrink-0" />

                                  <p className="truncate">
                                    {booking.event.location}
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Tickets */}
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center gap-2">
                              <TicketIcon className="h-4 w-4 text-foreground-muted" />

                              <span className="font-semibold">
                                {booking.quantity}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-5">
                            <span className="whitespace-nowrap font-semibold">
                              {formatCurrency(booking.totalAmount)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClasses(
                                booking.status
                              )}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {booking.status}
                            </span>
                          </td>

                          {/* Reference */}
                          <td className="px-6 py-5">
                            <span className="font-mono text-xs text-foreground-secondary">
                              {booking.bookingReference}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                              <CalendarDaysIcon className="h-4 w-4 text-foreground-muted" />

                              {formatDate(booking.createdAt)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <UserGroupIcon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-semibold">
                        Keep managing your events
                      </p>

                      <p className="mt-1 text-sm leading-6 text-foreground-secondary">
                        View your events to edit details, monitor performance,
                        and manage ticket activity.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/events"
                    className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-border-hover px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-accent/40 hover:bg-background-secondary sm:w-auto"
                  >
                    View My Events
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  description,
  meta,
  icon: Icon,
  iconClassName = "bg-accent/10 text-accent",
}: {
  label: string;
  value: string;
  description: string;
  meta: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-border-hover hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-xs text-foreground-muted">
          {meta}
        </span>
      </div>

      <p className="mt-6 text-sm font-medium text-foreground-secondary">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

function BookingDetail({
  label,
  value,
  icon: Icon,
  mono = false,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
        <Icon className="h-3.5 w-3.5 shrink-0" />

        <span>{label}</span>
      </div>

      <p
        className={`mt-1 break-words text-sm font-semibold ${
          mono
            ? "font-mono text-[11px] text-foreground-secondary"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TableHeading({ label }: { label: string }) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
      {label}
    </th>
  );
}