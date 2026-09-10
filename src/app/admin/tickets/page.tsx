import { requireAdmin } from "@/lib/auth";
import Ticket from "@/database/ticket.model";

import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  QrCodeIcon,
  TicketIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default async function AdminTicketsPage() {
  const result = await requireAdmin();

  if (!result.authorized) {
    return null;
  }

  const tickets = await Ticket.find({})
    .populate("user", "firstName lastName email")
    .populate("event", "title date location")
    .populate("booking", "bookingReference status")
    .sort({ createdAt: -1 })
    .lean();

  const totalTickets = tickets.length;

  const validTickets = tickets.filter(
    (ticket) => ticket.status === "valid"
  ).length;

  const usedTickets = tickets.filter(
    (ticket) => ticket.status === "used"
  ).length;

  const cancelledTickets = tickets.filter(
    (ticket) => ticket.status === "cancelled"
  ).length;

  const validRate =
    totalTickets > 0
      ? Math.round((validTickets / totalTickets) * 100)
      : 0;

  const usedRate =
    totalTickets > 0
      ? Math.round((usedTickets / totalTickets) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* PAGE HEADER */}
      <section className="border-b border-border">
        <div className="container-responsive py-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                  <TicketIcon className="h-5 w-5 text-accent" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Platform Management
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Tickets
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
                Monitor digital tickets, ticket status, attendees,
                and the events connected to each ticket.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-border bg-card px-5 py-4 sm:w-fit">
              <div className="flex items-center gap-2">
                <TicketIcon className="h-4 w-4 text-foreground-muted" />

                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                  Total Tickets
                </p>
              </div>

              <p className="mt-2 text-2xl font-black">
                {totalTickets}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="container-responsive py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Tickets"
            value={totalTickets}
            description="All generated tickets"
            icon={TicketIcon}
            accent
          />

          <StatCard
            label="Valid"
            value={validTickets}
            description="Ready for event entry"
            icon={CheckCircleIcon}
          />

          <StatCard
            label="Used"
            value={usedTickets}
            description="Tickets already scanned"
            icon={QrCodeIcon}
          />

          <StatCard
            label="Cancelled"
            value={cancelledTickets}
            description="No longer valid"
            icon={XCircleIcon}
          />
        </div>
      </section>

      {/* TICKET PERFORMANCE */}
      <section className="container-responsive pb-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <PerformanceCard
            label="Valid Ticket Rate"
            value={validRate}
            description="Percentage of generated tickets currently valid."
            icon={CheckCircleIcon}
            supportingText={`${validTickets} valid tickets`}
          />

          <PerformanceCard
            label="Ticket Usage Rate"
            value={usedRate}
            description="Percentage of generated tickets that have been used."
            icon={QrCodeIcon}
            supportingText={`${usedTickets} used tickets`}
          />
        </div>
      </section>

      {/* TICKET ACTIVITY */}
      <section className="container-responsive pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border px-4 py-5 sm:px-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <TicketIcon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold">
                  Digital Ticket Activity
                </h2>

                <p className="mt-1 text-xs text-foreground-muted">
                  Latest generated tickets appear first.
                </p>
              </div>
            </div>

            <span className="w-fit shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground-secondary">
              {totalTickets} tickets
            </span>
          </div>

          {tickets.length === 0 ? (
            <div className="px-5 py-14 text-center sm:px-6 sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <TicketIcon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-bold">
                No tickets found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-foreground-muted">
                No digital tickets have been generated on the
                platform yet.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="w-full min-w-[1150px]">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-left">
                    <TableHeading>
                      Ticket
                    </TableHeading>

                    <TableHeading>
                      Attendee
                    </TableHeading>

                    <TableHeading>
                      Event
                    </TableHeading>

                    <TableHeading>
                      Booking
                    </TableHeading>

                    <TableHeading>
                      Status
                    </TableHeading>

                    <TableHeading align="right">
                      Generated
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => {
                    const user = ticket.user as
                      | {
                          firstName?: string;
                          lastName?: string;
                          email?: string;
                        }
                      | null;

                    const event = ticket.event as
                      | {
                          title?: string;
                          date?: Date | string;
                          location?: string;
                        }
                      | null;

                    const booking = ticket.booking as
                      | {
                          bookingReference?: string;
                          status?: string;
                        }
                      | null;

                    const attendeeName =
                      `${user?.firstName || ""} ${
                        user?.lastName || ""
                      }`.trim() || "Unknown Attendee";

                    return (
                      <tr
                        key={ticket._id.toString()}
                        className="border-b border-border last:border-0 transition-colors hover:bg-background-secondary/60"
                      >
                        {/* TICKET */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                              <QrCodeIcon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 max-w-[190px]">
                              <p className="truncate font-mono text-xs font-bold text-foreground">
                                {ticket.ticketNumber}
                              </p>

                              <p className="mt-1 text-[10px] text-foreground-muted">
                                Digital ticket
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ATTENDEE */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-xs font-black text-foreground-secondary">
                              {getInitials(
                                user?.firstName,
                                user?.lastName
                              )}
                            </div>

                            <div className="min-w-0 max-w-[180px]">
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

                        {/* EVENT */}
                        <td className="px-5 py-5">
                          <div className="min-w-0 max-w-[230px]">
                            <p className="truncate text-sm font-semibold">
                              {event?.title || "Unknown Event"}
                            </p>

                            {event?.location && (
                              <p className="mt-1 truncate text-[10px] text-foreground-muted">
                                {event.location}
                              </p>
                            )}

                            {event?.date && (
                              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-foreground-muted">
                                <CalendarDaysIcon className="h-3 w-3 shrink-0" />
                                {formatDate(event.date)}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* BOOKING */}
                        <td className="px-5 py-5">
                          <div className="min-w-0">
                            <span className="inline-block max-w-[180px] truncate rounded-lg border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] font-semibold text-foreground-secondary">
                              {booking?.bookingReference ||
                                "N/A"}
                            </span>

                            {booking?.status && (
                              <p className="mt-2 text-[10px] text-foreground-muted">
                                Booking: {booking.status}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-5">
                          <TicketStatusBadge
                            status={String(
                              ticket.status || "unknown"
                            )}
                          />
                        </td>

                        {/* GENERATED */}
                        <td className="px-5 py-5 text-right">
                          <span className="whitespace-nowrap text-xs text-foreground-secondary">
                            {formatDate(ticket.createdAt)}
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
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent?: boolean;
}) {
  return (
    <div
      className={`card-responsive rounded-2xl border p-5 transition-all duration-200 ${
        accent
          ? "border-accent/30 bg-accent/10"
          : "border-border bg-card hover:border-border-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            accent
              ? "border-accent/20 bg-accent/10 text-accent"
              : "border-border bg-background text-foreground-muted"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
            accent
              ? "bg-accent"
              : "bg-foreground-muted"
          }`}
        />
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

/* ========================================================= */
/* PERFORMANCE CARD */
/* ========================================================= */

function PerformanceCard({
  label,
  value,
  description,
  icon: Icon,
  supportingText,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  supportingText: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground-muted">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight">
            {value}%
          </p>

          <p className="mt-1 text-xs leading-5 text-foreground-muted">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-accent">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-background-secondary">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{
            width: `${Math.min(Math.max(value, 0), 100)}%`,
          }}
        />
      </div>

      <p className="mt-3 text-[10px] font-semibold text-foreground-muted">
        {supportingText}
      </p>
    </div>
  );
}

/* ========================================================= */
/* TICKET STATUS */
/* ========================================================= */

function TicketStatusBadge({
  status,
}: {
  status: string;
}) {
  const normalizedStatus = status.toLowerCase();

  const isValid = normalizedStatus === "valid";
  const isUsed = normalizedStatus === "used";
  const isCancelled = normalizedStatus === "cancelled";

  const Icon = isValid
    ? CheckCircleIcon
    : isUsed
      ? QrCodeIcon
      : isCancelled
        ? XCircleIcon
        : ClockIcon;

  const styles = isValid
    ? "border-accent/30 bg-accent/10 text-accent"
    : isUsed
      ? "border-border bg-background-secondary text-foreground-secondary"
      : isCancelled
        ? "border-border bg-background text-foreground-muted"
        : "border-border bg-background text-foreground-muted";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${styles}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {status}
    </span>
  );
}

/* ========================================================= */
/* TABLE HEADING */
/* ========================================================= */

function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-foreground-muted ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
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
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}