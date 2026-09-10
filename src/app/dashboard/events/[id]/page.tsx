"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  EyeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilSquareIcon,
  QrCodeIcon,
  TicketIcon,
  UserGroupIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type Organizer = {
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
};

type Event = {
  _id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: number;
  capacity: number;
  organizer: Organizer;
};

type User = {
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
};

type Booking = {
  _id: string;
  bookingReference: string;
  quantity: number;
  totalAmount: number;
};

type Ticket = {
  _id: string;
  ticketNumber: string;
  status: "valid" | "used" | "cancelled";
  createdAt: string;
  user?: User;
  booking?: Booking;
};

type Statistics = {
  capacity: number;
  ticketsSold: number;
  ticketsRemaining: number;
  totalBookings: number;
  totalRevenue: number;
  checkedInTickets: number;
  validTickets: number;
  cancelledTickets: number;
  salesPercentage: number;
  checkInPercentage: number;
};

type TicketStatus = "all" | "valid" | "used" | "cancelled";

export default function OrganizerEventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TicketStatus>("all");

  async function fetchEventAnalytics() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/organizer/events/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch event analytics."
        );
      }

      setEvent(data.event);
      setStatistics(data.statistics);
      setTickets(data.tickets || []);
    } catch (error) {
      console.error(
        "Failed to fetch event analytics:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load event analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchEventAnalytics();
    }
  }, [id]);

  const filteredTickets = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return tickets.filter((ticket) => {
      const attendeeName =
        `${ticket.user?.firstName || ""} ${
          ticket.user?.lastName || ""
        }`.trim();

      const matchesSearch =
        !searchTerm ||
        attendeeName.toLowerCase().includes(searchTerm) ||
        ticket.user?.email
          ?.toLowerCase()
          .includes(searchTerm) ||
        ticket.ticketNumber
          .toLowerCase()
          .includes(searchTerm) ||
        ticket.booking?.bookingReference
          ?.toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-KE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatShortDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
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

  function getAttendeeName(ticket: Ticket) {
    return (
      `${ticket.user?.firstName || ""} ${
        ticket.user?.lastName || ""
      }`.trim() || "Unknown attendee"
    );
  }

  function getInitials(ticket: Ticket) {
    const name = getAttendeeName(ticket);

    if (name === "Unknown attendee") {
      return "?";
    }

    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  if (loading) {
    return (
      <main className="w-full bg-background text-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <div className="h-3 w-32 rounded bg-card" />
                <div className="h-9 w-64 rounded bg-card sm:h-11 sm:w-96" />
                <div className="h-4 w-72 rounded bg-card sm:w-[28rem]" />
              </div>

              <div className="flex gap-3">
                <div className="h-11 w-28 rounded-xl bg-card" />
                <div className="h-11 w-36 rounded-xl bg-card" />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="h-56 bg-background-secondary sm:h-72 lg:h-80" />

              <div className="space-y-4 p-5 sm:p-6">
                <div className="h-5 w-24 rounded bg-background-secondary" />
                <div className="h-8 w-3/4 rounded bg-background-secondary sm:h-10" />
                <div className="h-4 w-full max-w-xl rounded bg-background-secondary" />

                <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                  <div className="h-10 w-28 rounded-xl bg-background-secondary" />
                  <div className="h-10 w-40 rounded-xl bg-background-secondary" />
                  <div className="h-10 w-32 rounded-xl bg-background-secondary" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-2xl border border-border bg-card"
                />
              ))}
            </div>

            <div className="h-48 rounded-2xl border border-border bg-card" />

            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl border border-border bg-card"
                />
              ))}
            </div>

            <div className="h-96 rounded-2xl border border-border bg-card" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !event || !statistics) {
    return (
      <main className="w-full bg-background text-foreground">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
              <InformationCircleIcon className="h-7 w-7" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-red-400">
              Event Analytics
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Event analytics unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-foreground-secondary">
              {error || "Unable to load this event."}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={fetchEventAnalytics}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover sm:w-auto"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Try Again
              </button>

              <Link
                href="/dashboard/events"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-hover px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background-secondary sm:w-auto"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to My Events
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const eventDate = formatDate(event.date);

  const salesPercentage = Math.min(
    Math.max(statistics.salesPercentage || 0, 0),
    100
  );

  const checkInPercentage = Math.min(
    Math.max(statistics.checkInPercentage || 0, 0),
    100
  );

  return (
    <main className="w-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <section>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
                <Link
                  href="/dashboard/events"
                  className="transition hover:text-foreground"
                >
                  My Events
                </Link>

                <span>/</span>

                <span className="truncate text-foreground-secondary">
                  Event Analytics
                </span>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                  Event Analytics
                </span>
              </div>

              <h1 className="mt-4 break-words text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary sm:text-base">
                Monitor ticket sales, revenue, attendance, and
                attendee activity for this event.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <Link
                href={`/dashboard/events/${event._id}/edit`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-hover px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-accent/50 hover:bg-card sm:w-auto"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Edit Event
              </Link>

              <Link
                href={`/events/${event._id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all duration-200 hover:bg-accent-hover sm:w-auto"
              >
                <EyeIcon className="h-4 w-4" />
                View Public Event
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative h-64 overflow-hidden bg-background-secondary sm:h-80 lg:h-[26rem]">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/10 text-accent">
                    <TicketIcon className="h-10 w-10" />
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex max-w-full truncate rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md sm:text-xs">
                    {event.category || "Event"}
                  </span>

                  <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md sm:text-xs">
                    {formatCurrency(event.price)}
                  </span>
                </div>

                <h2 className="mt-4 max-w-4xl break-words text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {event.title}
                </h2>

                <div className="mt-4 flex flex-col gap-2 text-sm text-gray-200 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
                  <span className="inline-flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 shrink-0" />
                    <span>{event.location || "Location unavailable"}</span>
                  </span>

                  <span className="hidden sm:inline">•</span>

                  <span className="inline-flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4 shrink-0" />
                    <span>{eventDate}</span>
                  </span>

                  <span className="hidden sm:inline">•</span>

                  <span className="inline-flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 shrink-0" />
                    <span>{event.time || "Time unavailable"}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:flex-wrap sm:p-5">
              <Link
                href={`/dashboard/events/${event._id}/edit`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover sm:w-auto"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Edit Event
              </Link>

              <Link
                href={`/events/${event._id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-hover px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background-secondary sm:w-auto"
              >
                <EyeIcon className="h-4 w-4" />
                View Public Event
              </Link>

              <Link
                href="/dashboard/organizer/tickets"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-hover px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background-secondary sm:w-auto"
              >
                <QrCodeIcon className="h-4 w-4" />
                Verify Tickets
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 sm:mt-10">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
              Performance Overview
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Event performance
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Tickets Sold"
              value={statistics.ticketsSold.toLocaleString("en-KE")}
              description={`of ${statistics.capacity.toLocaleString(
                "en-KE"
              )} capacity`}
              icon={<TicketIcon className="h-5 w-5" />}
            />

            <StatCard
              label="Tickets Remaining"
              value={statistics.ticketsRemaining.toLocaleString(
                "en-KE"
              )}
              description="Available tickets"
              icon={<UsersIcon className="h-5 w-5" />}
            />

            <StatCard
              label="Total Revenue"
              value={formatCurrency(statistics.totalRevenue)}
              description="From confirmed bookings"
              icon={<CurrencyDollarIcon className="h-5 w-5" />}
            />

            <StatCard
              label="Checked In"
              value={statistics.checkedInTickets.toLocaleString(
                "en-KE"
              )}
              description={`${checkInPercentage}% of tickets sold`}
              icon={<CheckCircleIcon className="h-5 w-5" />}
            />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Sales Performance
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Ticket sales
              </h2>

              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                {statistics.ticketsSold.toLocaleString("en-KE")} of{" "}
                {statistics.capacity.toLocaleString("en-KE")}{" "}
                available tickets have been sold.
              </p>
            </div>

            <div className="shrink-0">
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                {salesPercentage}%
              </p>

              <p className="mt-1 text-xs text-foreground-muted">
                capacity filled
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div
              className="h-3 overflow-hidden rounded-full bg-background-secondary"
              role="progressbar"
              aria-valuenow={salesPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Ticket sales progress"
            >
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{
                  width: `${salesPercentage}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
            <span>
              {statistics.ticketsSold.toLocaleString("en-KE")} sold
            </span>

            <span>
              {statistics.ticketsRemaining.toLocaleString("en-KE")}{" "}
              remaining
            </span>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
              Attendance
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Attendance overview
            </h2>

            <p className="mt-1 text-sm leading-6 text-foreground-secondary">
              Current ticket and check-in status for this event.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AttendanceCard
              label="Valid Tickets"
              value={statistics.validTickets}
              description="Ready for entry"
              icon={<TicketIcon className="h-5 w-5" />}
            />

            <AttendanceCard
              label="Checked In"
              value={statistics.checkedInTickets}
              description={`${checkInPercentage}% attendance rate`}
              icon={<CheckCircleIcon className="h-5 w-5" />}
            />

            <AttendanceCard
              label="Cancelled"
              value={statistics.cancelledTickets}
              description="Cancelled or invalidated"
              icon={<XCircleIcon className="h-5 w-5" />}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Check-in progress
                </p>

                <p className="mt-1 text-xs leading-5 text-foreground-secondary">
                  Percentage of sold tickets that have been checked
                  in.
                </p>
              </div>

              <p className="text-2xl font-bold">
                {checkInPercentage}%
              </p>
            </div>

            <div
              className="mt-5 h-2.5 overflow-hidden rounded-full bg-background-secondary"
              role="progressbar"
              aria-valuenow={checkInPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Check-in progress"
            >
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{
                  width: `${checkInPercentage}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Attendee Management
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                  Attendees
                </h2>

                <p className="mt-1 text-sm leading-6 text-foreground-secondary">
                  Showing{" "}
                  {filteredTickets.length.toLocaleString("en-KE")}{" "}
                  of {tickets.length.toLocaleString("en-KE")}{" "}
                  ticket{tickets.length !== 1 ? "s" : ""}.
                </p>
              </div>

              {tickets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <StatusSummary
                    label="Valid"
                    value={statistics.validTickets}
                    icon={
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                    }
                  />

                  <StatusSummary
                    label="Checked In"
                    value={statistics.checkedInTickets}
                    icon={
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                    }
                  />

                  <StatusSummary
                    label="Cancelled"
                    value={statistics.cancelledTickets}
                    icon={<XCircleIcon className="h-3.5 w-3.5" />}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-border bg-background-secondary/40 p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="min-w-0">
                <label
                  htmlFor="attendee-search"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-foreground-muted"
                >
                  Search attendees
                </label>

                <div className="relative">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />

                  <input
                    id="attendee-search"
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Name, email, ticket number or booking reference..."
                    className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-foreground-muted focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="status-filter"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-foreground-muted"
                >
                  Ticket status
                </label>

                <div className="relative">
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as TicketStatus
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option value="all">All Tickets</option>
                    <option value="valid">Valid</option>
                    <option value="used">Checked In</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {(search || statusFilter !== "all") && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs text-foreground-muted">
                  Active filters:
                </span>

                {search && (
                  <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground-secondary">
                    <MagnifyingGlassIcon className="h-3.5 w-3.5 shrink-0" />
                    Search: &quot;{search}&quot;
                  </span>
                )}

                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground-secondary">
                    <TicketIcon className="h-3.5 w-3.5" />
                    Status:{" "}
                    {statusFilter === "used"
                      ? "Checked In"
                      : statusFilter}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-foreground-secondary transition hover:bg-card hover:text-foreground"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {tickets.length === 0 ? (
            <div className="px-6 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <TicketIcon className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No tickets issued yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">
                Attendee tickets will appear here after bookings
                are completed and tickets are generated.
              </p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="px-6 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background-secondary text-foreground-muted">
                <MagnifyingGlassIcon className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No attendees found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">
                No tickets match your current search or status
                filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border lg:hidden">
                {filteredTickets.map((ticket) => {
                  const attendeeName =
                    getAttendeeName(ticket);

                  return (
                    <div
                      key={ticket._id}
                      className="p-5 transition hover:bg-background-secondary/30 sm:p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent/10 text-xs font-bold text-accent">
                          {ticket.user?.imageUrl ? (
                            <img
                              src={ticket.user.imageUrl}
                              alt={attendeeName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(ticket)
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="truncate font-semibold">
                                {attendeeName}
                              </p>

                              {ticket.user?.email && (
                                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-foreground-muted">
                                  <EnvelopeIcon className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">
                                    {ticket.user.email}
                                  </span>
                                </p>
                              )}
                            </div>

                            <StatusBadge
                              status={ticket.status}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <InfoItem
                          label="Ticket"
                          value={ticket.ticketNumber}
                          mono
                          icon={<TicketIcon className="h-3.5 w-3.5" />}
                        />

                        <InfoItem
                          label="Booking"
                          value={
                            ticket.booking
                              ?.bookingReference || "N/A"
                          }
                          mono
                          icon={<QrCodeIcon className="h-3.5 w-3.5" />}
                        />

                        <InfoItem
                          label="Issued"
                          value={formatShortDate(
                            ticket.createdAt
                          )}
                          icon={
                            <CalendarDaysIcon className="h-3.5 w-3.5" />
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[950px]">
                  <thead className="border-b border-border bg-background-secondary/50">
                    <tr>
                      <TableHeading>Attendee</TableHeading>
                      <TableHeading>Ticket Number</TableHeading>
                      <TableHeading>Booking Reference</TableHeading>
                      <TableHeading>Status</TableHeading>
                      <TableHeading>Issued</TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTickets.map((ticket) => {
                      const attendeeName =
                        getAttendeeName(ticket);

                      return (
                        <tr
                          key={ticket._id}
                          className="border-b border-border last:border-0 transition hover:bg-background-secondary/50"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent/10 text-xs font-bold text-accent">
                                {ticket.user?.imageUrl ? (
                                  <img
                                    src={
                                      ticket.user.imageUrl
                                    }
                                    alt={attendeeName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  getInitials(ticket)
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[220px] truncate font-medium">
                                  {attendeeName}
                                </p>

                                {ticket.user?.email && (
                                  <p className="mt-1 flex max-w-[240px] items-center gap-1.5 truncate text-xs text-foreground-muted">
                                    <EnvelopeIcon className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">
                                      {ticket.user.email}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-background-secondary px-2.5 py-1.5 font-mono text-xs text-foreground-secondary">
                              <TicketIcon className="h-3.5 w-3.5 text-foreground-muted" />
                              {ticket.ticketNumber}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground-secondary">
                              <QrCodeIcon className="h-3.5 w-3.5 text-foreground-muted" />
                              {ticket.booking
                                ?.bookingReference || "N/A"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={ticket.status}
                            />
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-2 text-sm text-foreground-secondary">
                              <CalendarDaysIcon className="h-4 w-4 text-foreground-muted" />
                              {formatShortDate(
                                ticket.createdAt
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <section className="mt-8">
          <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  Event Management
                </p>

                <h2 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                  Continue managing this event.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
                  Edit your event details, review your other events,
                  or verify attendee tickets before entry.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                <Link
                  href="/dashboard/events"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-hover px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-card sm:w-auto"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  My Events
                </Link>

                <Link
                  href="/dashboard/organizer/tickets"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover sm:w-auto"
                >
                  <QrCodeIcon className="h-4 w-4" />
                  Verify Tickets
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-200 group-hover:scale-105">
          {icon}
        </div>
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

function AttendanceCard({
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
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background-secondary text-foreground-secondary transition-transform duration-200 group-hover:scale-105">
          {icon}
        </div>

        <span className="rounded-full border border-border bg-background-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
          Current
        </span>
      </div>

      <p className="mt-6 text-sm font-medium text-foreground-secondary">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold tracking-tight">
        {value.toLocaleString("en-KE")}
      </p>

      <p className="mt-2 text-xs text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

function StatusSummary({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-secondary px-3 py-1.5 text-xs text-foreground-secondary">
      <span className="text-foreground-muted">{icon}</span>
      <span className="font-semibold text-foreground">
        {value.toLocaleString("en-KE")}
      </span>
      {label}
    </span>
  );
}

function InfoItem({
  label,
  value,
  mono = false,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-background-secondary p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
        {icon}
        {label}
      </p>

      <p
        className={`mt-1 truncate text-xs text-foreground-secondary ${
          mono ? "font-mono" : "font-medium"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "valid" | "used" | "cancelled";
}) {
  const styles = {
    valid:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    used:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
    cancelled:
      "border-red-500/20 bg-red-500/10 text-red-400",
  };

  const labels = {
    valid: "Valid",
    used: "Checked In",
    cancelled: "Cancelled",
  };

  const icons = {
    valid: <CheckCircleIcon className="h-3.5 w-3.5" />,
    used: <CheckCircleIcon className="h-3.5 w-3.5" />,
    cancelled: <XCircleIcon className="h-3.5 w-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${styles[status]}`}
    >
      {icons[status]}
      {labels[status]}
    </span>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-foreground-muted">
      {children}
    </th>
  );
}