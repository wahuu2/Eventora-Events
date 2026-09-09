"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
};

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFeaturedEvents() {
      try {
        setLoading(true);

        const response = await fetch("/api/events", {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load featured events."
          );
        }

        setEvents(
          Array.isArray(data.events)
            ? data.events.slice(0, 3)
            : []
        );
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Failed to fetch featured events:",
          error
        );

        setEvents([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchFeaturedEvents();

    return () => {
      controller.abort();
    };
  }, []);

  /* =========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            {/* Image skeleton */}
            <div className="h-52 animate-pulse bg-background-secondary sm:h-56" />

            {/* Content skeleton */}
            <div className="space-y-4 p-5 sm:p-6">
              <div className="h-3 w-20 animate-pulse rounded bg-border" />

              <div className="h-5 w-4/5 animate-pulse rounded bg-border" />

              <div className="h-3 w-full animate-pulse rounded bg-border" />

              <div className="h-3 w-2/3 animate-pulse rounded bg-border" />

              <div className="border-t border-border pt-4">
                <div className="h-3 w-1/2 animate-pulse rounded bg-border" />

                <div className="mt-3 h-3 w-2/5 animate-pulse rounded bg-border" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="h-5 w-20 animate-pulse rounded bg-border" />

                <div className="h-4 w-24 animate-pulse rounded bg-border" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* =========================================================
     EMPTY STATE
  ========================================================== */

  if (events.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-card px-5 py-16 text-center sm:px-8 sm:py-20">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border-hover bg-background-secondary text-accent">
          <CalendarIcon />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Coming soon
        </p>

        <h3 className="mt-2 text-xl font-bold sm:text-2xl">
          No featured events available
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-foreground-secondary">
          Check back soon for upcoming events on Eventora.
        </p>

        <Link
          href="/events"
          className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 hover:bg-accent-hover sm:w-auto"
        >
          Browse Events
          <span className="ml-2" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    );
  }

  /* =========================================================
     FEATURED EVENTS
  ========================================================== */

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {events.map((event) => (
        <FeaturedEventCard
          key={event._id}
          event={event}
        />
      ))}
    </div>
  );
}

/* =============================================================
   FEATURED EVENT CARD
============================================================= */

function FeaturedEventCard({
  event,
}: {
  event: Event;
}) {
  const [imageError, setImageError] = useState(false);

  const formattedDate = (() => {
    const date = new Date(event.date);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  })();

  return (
    <Link
      href={`/events/${event._id}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-2xl focus-visible:-translate-y-1"
    >
      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div className="relative aspect-[16/10] overflow-hidden bg-background-secondary">
        {!imageError && event.image ? (
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background-secondary">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-lg font-bold text-accent">
                E
              </div>

              <p className="mt-3 text-xs font-medium text-foreground-muted">
                Eventora
              </p>
            </div>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Category */}
        <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)]">
          <span className="inline-flex max-w-full truncate rounded-lg border border-white/10 bg-black/65 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
            {event.category}
          </span>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 right-4">
          <span className="rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            {event.price === 0
              ? "FREE"
              : `KES ${event.price.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* =====================================================
          INFORMATION
      ====================================================== */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="line-clamp-2 text-lg font-bold leading-tight tracking-tight transition-colors group-hover:text-accent sm:text-xl">
          {event.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground-secondary">
          {event.description}
        </p>

        {/* Metadata */}
        <div className="mt-5 space-y-3 border-t border-border pt-5">
          <EventMeta
            icon={<LocationIcon />}
            label="Location"
            value={event.location}
            truncate
          />

          <EventMeta
            icon={<CalendarIcon />}
            label="Date"
            value={formattedDate}
          />

          {event.time && (
            <EventMeta
              icon={<ClockIcon />}
              label="Time"
              value={event.time}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
              Admission
            </p>

            <p className="mt-1 truncate text-sm font-bold text-foreground">
              {event.price === 0
                ? "Free entry"
                : `KES ${event.price.toLocaleString()}`}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-accent transition-all group-hover:gap-2 group-hover:text-foreground sm:text-sm">
            View Event
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* =============================================================
   EVENT META
============================================================= */

function EventMeta({
  icon,
  label,
  value,
  truncate = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
          {label}
        </p>

        <p
          className={`mt-0.5 text-sm font-medium text-foreground-secondary ${
            truncate ? "truncate" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* =============================================================
   ICONS
============================================================= */

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 9h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}