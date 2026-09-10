"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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
  organizer?: Organizer;
};

type Booking = {
  id: string;
  bookingReference: string;
  quantity: number;
  totalAmount: number;
  status: string;
};

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { isSignedIn } = useUser();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/events/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch event");
        }

        setEvent(data.event);
      } catch (error) {
        console.error("Failed to fetch event:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load event"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEvent();
    }
  }, [id]);

  async function handleBooking() {
    if (!event) return;

    if (!isSignedIn) {
      window.location.href = `/sign-in?redirect_url=/events/${event._id}`;
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");
      setBooking(null);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event._id,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create booking");
      }

      setBooking(data.booking);
    } catch (error) {
      console.error("Booking error:", error);

      setBookingError(
        error instanceof Error ? error.message : "Failed to create booking"
      );
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="h-5 w-28 animate-pulse rounded bg-border" />

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[16/10] animate-pulse bg-background-secondary sm:aspect-[16/9]" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="h-4 w-24 animate-pulse rounded bg-border" />
              <div className="mt-4 h-10 w-full animate-pulse rounded bg-border" />
              <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-border" />

              <div className="mt-8 space-y-4">
                <div className="h-12 animate-pulse rounded bg-background-secondary" />
                <div className="h-12 animate-pulse rounded bg-background-secondary" />
                <div className="h-12 animate-pulse rounded bg-background-secondary" />
              </div>

              <div className="mt-8 h-14 animate-pulse rounded-xl bg-border" />
            </div>
          </div>

          <div className="mt-8 max-w-4xl space-y-4">
            <div className="h-4 w-28 animate-pulse rounded bg-border" />
            <div className="h-8 w-64 animate-pulse rounded bg-border" />
            <div className="h-4 w-full animate-pulse rounded bg-border" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-border" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-border" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5M12 16h.01" />
              </svg>
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-red-400">
              Event unavailable
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Event not found
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-foreground-secondary sm:text-base">
              {error ||
                "The event you are looking for does not exist or is no longer available."}
            </p>

            <Link
              href="/events"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover sm:w-auto"
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const eventDate = new Date(event.date);

  const formattedDate = eventDate.toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const shortDate = eventDate.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const organizerName =
    event.organizer?.firstName || event.organizer?.lastName
      ? `${event.organizer?.firstName || ""} ${
          event.organizer?.lastName || ""
        }`.trim()
      : "Event Organizer";

  const totalPrice = event.price * quantity;

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground"
          >
            <span className="text-base">←</span>
            <span>All Events</span>
          </Link>

        </div>
      </header>

      {/* Event Hero */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/5">
            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/8] lg:aspect-[16/7]">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <span className="inline-flex rounded-lg border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs">
                  {event.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-xs">
                  Eventora
                </p>

                <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                  {shortDate}
                  {event.time ? ` • ${event.time}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
            {/* Event Information */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
                <span className="text-accent">{event.category}</span>
                <span className="text-foreground-muted">•</span>
                <span className="text-foreground-muted">Event details</span>
              </div>

              <h1 className="mt-3 max-w-4xl break-words text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              {/* Key Event Details */}
              <div className="mt-7 grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-2">
                <div className="flex min-w-0 items-start gap-3 border-b border-border p-4 sm:border-r sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="17"
                        rx="2"
                      />
                      <path d="M16 2v4M8 2v4M3 9h18" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                      Date
                    </p>

                    <p className="mt-1.5 break-words text-sm font-semibold">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3 border-b border-border p-4 sm:border-b-0 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                      Time
                    </p>

                    <p className="mt-1.5 text-sm font-semibold">
                      {event.time || "Time to be announced"}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3 p-4 sm:border-r sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
                      <circle cx="12" cy="10" r="2.2" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                      Location
                    </p>

                    <p className="mt-1.5 break-words text-sm font-semibold">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3 p-4 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M4 7h16M4 12h16M4 17h10" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                      Capacity
                    </p>

                    <p className="mt-1.5 text-sm font-semibold">
                      {event.capacity} people
                    </p>
                  </div>
                </div>
              </div>

              {/* About Event */}
              <div className="mt-10 border-t border-border pt-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  About this event
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  What to expect
                </h2>

                <div className="mt-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-foreground-secondary sm:text-base sm:leading-8">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Organizer */}
              <div className="mt-10 border-t border-border pt-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  Organizer
                </p>

                <div className="mt-4 flex items-center gap-4">
                  {event.organizer?.imageUrl ? (
                    <img
                      src={event.organizer.imageUrl}
                      alt={organizerName}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
                      {organizerName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="break-words text-base font-bold">
                      {organizerName}
                    </p>

                    {event.organizer?.email && (
                      <p className="mt-1 break-all text-sm text-foreground-muted">
                        {event.organizer.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <aside className="min-w-0 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/5">
                {/* Booking Header */}
                <div className="border-b border-border p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                        Tickets
                      </p>

                      <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                        Book this event
                      </h2>
                    </div>

                    <span className="rounded-lg border border-border bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {/* Price */}
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                        From
                      </p>

                      <p className="mt-1 text-3xl font-bold tracking-tight">
                        {event.price === 0
                          ? "Free"
                          : `KES ${event.price.toLocaleString()}`}
                      </p>
                    </div>

                    <p className="text-xs text-foreground-muted">
                      per ticket
                    </p>
                  </div>

                  {/* Event Date/Location */}
                  <div className="mt-6 space-y-3 rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="17"
                          rx="2"
                        />
                        <path d="M16 2v4M8 2v4M3 9h18" />
                      </svg>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
                          When
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {shortDate}
                          {event.time ? ` • ${event.time}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-border pt-3">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      >
                        <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
                        <circle cx="12" cy="10" r="2.2" />
                      </svg>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
                          Where
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mt-6 border-t border-border pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          Number of tickets
                        </p>

                        <p className="mt-1 text-xs text-foreground-muted">
                          Choose your quantity
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center rounded-xl border border-border bg-background p-1">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((current) =>
                              Math.max(1, current - 1)
                            )
                          }
                          disabled={quantity <= 1 || bookingLoading}
                          aria-label="Decrease ticket quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors hover:bg-card-hover hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          −
                        </button>

                        <span className="flex h-9 min-w-10 items-center justify-center px-2 text-sm font-bold">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((current) => current + 1)
                          }
                          disabled={bookingLoading}
                          aria-label="Increase ticket quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors hover:bg-card-hover hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                        Total
                      </p>

                      <p className="mt-1 text-xs text-foreground-muted">
                        {quantity}{" "}
                        {quantity === 1 ? "ticket" : "tickets"}
                      </p>
                    </div>

                    <p className="text-xl font-bold tracking-tight">
                      {event.price === 0
                        ? "Free"
                        : `KES ${totalPrice.toLocaleString()}`}
                    </p>
                  </div>

                  {/* Booking Error */}
                  {bookingError && (
                    <div
                      className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4"
                      role="alert"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-sm font-bold text-red-400">
                          !
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-red-400">
                            Booking could not be completed
                          </p>

                          <p className="mt-1 text-xs leading-5 text-red-400/80">
                            {bookingError}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Success */}
                  {booking && (
                    <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10 font-bold text-green-400">
                          ✓
                        </span>

                        <div className="min-w-0">
                          <p className="font-semibold text-green-400">
                            Booking created
                          </p>

                          <p className="mt-1 text-xs leading-5 text-green-400/80">
                            Your reservation has been successfully created.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-green-500/20 pt-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                          Booking reference
                        </p>

                        <p className="mt-1 break-all font-mono text-sm font-semibold">
                          {booking.bookingReference}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-xs text-foreground-muted">
                            Status
                          </span>

                          <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold capitalize text-green-400">
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold transition-all hover:bg-card-hover"
                      >
                        View Booking
                        <span className="ml-2">→</span>
                      </Link>
                    </div>
                  )}

                  {/* Book Button */}
                  {!booking && (
                    <button
                      type="button"
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {bookingLoading ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {isSignedIn
                            ? "Confirm Booking"
                            : "Sign In to Book"}
                          <span className="ml-2">→</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="mt-5 border-t border-border pt-5">
                    <div className="flex items-start gap-3">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                        />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>

                      <p className="text-xs leading-5 text-foreground-muted">
                        Your booking is processed securely through the
                        Eventora booking system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="mt-4 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                      Event capacity
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {event.capacity} people
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="8" r="3" />
                      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                      <path d="M16 11a3 3 0 1 0 0-6M18 14c2.2.8 3.5 2.8 3.5 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}