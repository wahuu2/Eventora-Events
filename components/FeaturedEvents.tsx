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
        const response = await fetch("/api/events", {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load events.");
        }

        setEvents(
          Array.isArray(data.events) ? data.events.slice(0, 3) : []
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch featured events:", error);
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

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-KE", {
      month: "short",
      year: "numeric",
    }).toUpperCase();
  }

  if (loading) {
    return (
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]"
          >
            <div className="h-48 animate-pulse bg-white/[0.06]" />

            <div className="space-y-4 p-6">
              <div className="h-5 w-3/4 animate-pulse rounded bg-white/[0.08]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.08]" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.08]" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-white/[0.08]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-12 text-center">
        <p className="text-sm font-semibold text-white">
          No featured events available
        </p>

        <p className="mt-2 text-sm text-white/45">
          Check back soon for upcoming events on Eventora.
        </p>

        <Link
          href="/events"
          className="mt-5 inline-flex items-center rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
        >
          Browse Events
          <span className="ml-2">→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Link
          key={event._id}
          href={`/events/${event._id}`}
          className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/[0.09]"
        >
          {/* EVENT IMAGE */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-lg font-bold text-accent">
                    E
                  </div>

                  <p className="mt-3 text-xs font-medium text-white/40">
                    Eventora
                  </p>
                </div>
              </div>
            )}

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            {/* Category */}
            <div className="absolute left-5 top-5">
              <span className="inline-flex max-w-[220px] truncate rounded-lg border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {event.category}
              </span>
            </div>

            {/* Date */}
            <div className="absolute bottom-5 left-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {formatDate(event.date)}
              </p>
            </div>

            {/* Arrow */}
            <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>

          {/* EVENT INFORMATION */}
          <div className="p-6">
            <h3 className="line-clamp-2 text-lg font-bold leading-tight text-white transition-colors group-hover:text-accent">
              {event.title}
            </h3>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">
              {event.description}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Location
                </p>

                <p className="mt-1 truncate text-xs font-medium text-white/55">
                  {event.location}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Admission
                </p>

                <p className="mt-1 text-xs font-bold text-accent">
                  {event.price === 0
                    ? "FREE"
                    : `KES ${event.price.toLocaleString()}`}
                </p>
              </div>
            </div>

            <div className="mt-5 flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-xs font-bold text-white transition-all duration-200 group-hover:border-accent/30 group-hover:bg-accent">
              View Event
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}