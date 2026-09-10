import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import Event from "@/database/event.model";

import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  Squares2X2Icon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

export default async function AdminEventsPage() {
  const result = await requireAdmin();

  if (!result.authorized) {
    return null;
  }

  const events = await Event.find({})
    .populate("organizer", "firstName lastName email")
    .sort({ createdAt: -1 })
    .lean();

  const totalEvents = events.length;

  const now = new Date();

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= now
  ).length;

  const pastEvents = totalEvents - upcomingEvents;

  const upcomingPercentage =
    totalEvents > 0
      ? Math.round((upcomingEvents / totalEvents) * 100)
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
                  <CalendarDaysIcon className="h-4 w-4" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                  Platform Management
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Events
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary">
                Monitor every event published across Eventora
                and review organizers, schedules, locations,
                and event status.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-accent/20 bg-accent/10 p-4 sm:p-5 lg:w-auto lg:min-w-[220px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                    Total Events
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight">
                    {totalEvents.toLocaleString("en-KE")}
                  </p>

                  <p className="mt-1 text-xs text-foreground-muted">
                    Published on Eventora
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background/30 text-accent">
                  <CalendarDaysIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="container-responsive py-5 sm:py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total Events"
            value={totalEvents}
            description="All platform events"
            icon={<CalendarDaysIcon className="h-5 w-5" />}
            accent
          />

          <StatCard
            label="Upcoming"
            value={upcomingEvents}
            description="Events still ahead"
            icon={<ClockIcon className="h-5 w-5" />}
          />

          <StatCard
            label="Past Events"
            value={pastEvents}
            description="Events already held"
            icon={<ArchiveBoxIcon className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* EVENT SUMMARY */}
      <section className="container-responsive pb-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-5 sm:p-6 lg:col-span-2">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Upcoming Events
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  {upcomingEvents.toLocaleString("en-KE")}
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-foreground-secondary">
                  Events scheduled for today or a future date.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background text-accent">
                <ClockIcon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                  Platform Share
                </span>

                <span className="text-xs font-bold text-accent">
                  {upcomingPercentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-background-secondary">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{
                    width: `${Math.min(
                      upcomingPercentage,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                  Event Mix
                </p>

                <p className="mt-2 text-3xl font-black tracking-tight">
                  {totalEvents.toLocaleString("en-KE")}
                </p>

                <p className="mt-1 text-xs text-foreground-muted">
                  Total published events
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <Squares2X2Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                  Upcoming
                </p>

                <p className="mt-1 text-lg font-black text-accent">
                  {upcomingEvents}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                  Past
                </p>

                <p className="mt-1 text-lg font-black">
                  {pastEvents}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS TABLE */}
      <section className="container-responsive pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border bg-background-secondary/40 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="h-4 w-4 text-accent" />

                <h2 className="text-base font-bold">
                  Platform Events
                </h2>
              </div>

              <p className="mt-1 text-xs leading-5 text-foreground-muted">
                Latest events appear first.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />

              <span className="text-xs font-semibold text-foreground-secondary">
                {totalEvents.toLocaleString("en-KE")} events
              </span>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="px-5 py-16 text-center sm:px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <CalendarDaysIcon className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-sm font-bold">
                No events found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-foreground-muted">
                No events have been created on the platform yet.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-left">
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Event
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Organizer
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Date
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Location
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Event ID
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => {
                    const eventDate = new Date(event.date);
                    const isUpcoming = eventDate >= now;

                    const organizer = event.organizer as
                      | {
                          firstName?: string;
                          lastName?: string;
                          email?: string;
                        }
                      | null;

                    const organizerName =
                      `${organizer?.firstName || ""} ${
                        organizer?.lastName || ""
                      }`.trim() || "Unknown Organizer";

                    return (
                      <tr
                        key={event._id.toString()}
                        className="group border-b border-border last:border-0 transition-colors duration-200 hover:bg-background-secondary/60"
                      >
                        {/* EVENT */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition-colors group-hover:border-accent/30 group-hover:bg-accent/15">
                              <CalendarDaysIcon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 max-w-[260px]">
                              <p className="truncate text-sm font-bold">
                                {event.title}
                              </p>

                              <p className="mt-1 text-[10px] text-foreground-muted">
                                Event listing
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ORGANIZER */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-xs font-bold text-foreground-muted">
                              {getInitials(
                                organizer?.firstName,
                                organizer?.lastName
                              )}
                            </div>

                            <div className="min-w-0 max-w-[200px]">
                              <p className="truncate text-sm font-semibold">
                                {organizerName}
                              </p>

                              <p className="mt-1 truncate text-[10px] text-foreground-muted">
                                {organizer?.email ||
                                  "No email available"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-5">
                          <div>
                            <p className="whitespace-nowrap text-sm font-semibold">
                              {formatDate(event.date)}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-[10px] text-foreground-muted">
                              <ClockIcon className="h-3 w-3" />
                              {formatTime(event.date)}
                            </p>
                          </div>
                        </td>

                        {/* LOCATION */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 shrink-0 text-accent" />

                            <span className="block max-w-[190px] truncate text-sm text-foreground-secondary">
                              {event.location ||
                                "Location not specified"}
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-5">
                          <StatusBadge
                            isUpcoming={isUpcoming}
                          />
                        </td>

                        {/* ID */}
                        <td className="px-5 py-5 text-right">
                          <span className="inline-block rounded-lg border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] font-semibold text-foreground-muted">
                            {event._id
                              .toString()
                              .slice(-8)}
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

        {events.length > 0 && (
          <div className="mt-4 flex flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-foreground-muted">
              Showing all published platform events
            </p>

            <p className="text-[10px] text-foreground-muted">
              {upcomingEvents} upcoming · {pastEvents} past
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
  isUpcoming,
}: {
  isUpcoming: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
        isUpcoming
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-border bg-background-secondary text-foreground-muted"
      }`}
    >
      {isUpcoming ? (
        <CheckCircleIcon className="h-3.5 w-3.5" />
      ) : (
        <ArchiveBoxIcon className="h-3.5 w-3.5" />
      )}

      {isUpcoming ? "Upcoming" : "Past"}
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

function formatTime(date: Date | string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "--:--";
  }

  return parsedDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}