"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TicketIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

type Booking = {
  _id: string;
  quantity: number;
  totalAmount: number;
  status: string;
  bookingReference: string;
  event: {
    _id: string;
    title: string;
    image: string;
    location: string;
    date: string;
    time: string;
    category: string;
    price: number;
  };
};

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-foreground-muted ring-1 ring-border">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function PaymentMethod({
  title,
  description,
  selected,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-accent bg-accent/10 shadow-lg shadow-blue-500/10"
          : "border-border bg-background-secondary hover:border-border-hover hover:bg-card-hover"
      }`}
    >
      {selected && (
        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
          <CheckCircleIcon className="h-4 w-4" />
        </span>
      )}

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
          selected
            ? "bg-accent text-white"
            : "bg-card text-foreground-secondary ring-1 ring-border group-hover:text-foreground"
        }`}
      >
        {icon}
      </div>

      <div className="mt-4">
        <p className="font-bold text-foreground">{title}</p>

        <p className="mt-1 text-sm leading-5 text-foreground-secondary">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            selected ? "bg-accent" : "bg-foreground-muted"
          }`}
        />

        <span
          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
            selected
              ? "text-accent"
              : "text-foreground-muted"
          }`}
        >
          {selected ? "Selected" : "Select method"}
        </span>
      </div>
    </button>
  );
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    async function fetchBooking() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/bookings/${bookingId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch booking"
          );
        }

        setBooking(data.booking);
      } catch (error) {
        console.error("Failed to fetch booking:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load booking"
        );
      } finally {
        setLoading(false);
      }
    }

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  async function handlePayment() {
    if (!booking) return;

    setPaying(true);
    setError("");
    setSuccess("");

    try {
      const createResponse = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking._id,
          method,
        }),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok || !createData.success) {
        throw new Error(
          createData.message || "Failed to create payment"
        );
      }

      const createdPaymentId = createData.payment.id;

      setPaymentId(createdPaymentId);

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      const processResponse = await fetch("/api/payments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: createdPaymentId,
          action: "success",
        }),
      });

      const processData = await processResponse.json();

      if (!processResponse.ok || !processData.success) {
        throw new Error(
          processData.message || "Payment failed"
        );
      }

      setSuccess(
        "Payment successful. Your booking has been confirmed."
      );

      setTimeout(() => {
        router.push(`/dashboard/bookings/${booking._id}`);
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Payment failed"
      );
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="h-3 w-24 rounded bg-background" />
            <div className="mt-4 h-8 w-64 rounded bg-background" />
            <div className="mt-3 h-4 w-full max-w-lg rounded bg-background" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="h-64 bg-background-secondary sm:h-80" />

              <div className="space-y-6 p-5 sm:p-7">
                <div className="h-5 w-32 rounded bg-background-secondary" />
                <div className="h-8 w-2/3 rounded bg-background-secondary" />

                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-12 rounded-xl bg-background-secondary"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="h-96 rounded-2xl border border-border bg-card" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-center shadow-xl shadow-black/10 sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-lg font-bold text-red-400">
            !
          </div>

          <h1 className="mt-5 text-xl font-bold sm:text-2xl">
            Unable to load payment
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground-secondary">
            {error}
          </p>

          <Link
            href="/dashboard/bookings"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-hover sm:w-auto"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  if (booking.status === "confirmed") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-center shadow-xl shadow-black/10 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <CheckCircleIcon className="h-8 w-8" />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
            Payment Complete
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Booking Already Confirmed
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground-secondary">
            This booking has already been paid for and
            confirmed. No additional payment is required.
          </p>

          <Link
            href={`/dashboard/bookings/${booking._id}`}
            className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-hover sm:w-auto"
          >
            View Booking
            <ArrowLeftIcon className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(
    booking.event.date
  ).toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const amount = booking.totalAmount.toLocaleString("en-KE");

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              Checkout
            </span>

            <span className="text-xs text-foreground-muted">
              /
            </span>

            <Link
              href="/dashboard/bookings"
              className="text-xs font-medium text-foreground-muted transition hover:text-foreground"
            >
              Bookings
            </Link>

            <span className="text-xs text-foreground-muted">
              /
            </span>

            <span className="text-xs font-medium text-foreground-muted">
              Payment
            </span>
          </div>

          <div className="mt-5">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Complete your payment
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary sm:text-base">
              Review your booking and choose how you would
              like to pay.
            </p>
          </div>
        </div>
      </section>

      {/* Main Checkout */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left Side */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* Event Image */}
          <div className="relative h-60 sm:h-72 lg:h-80">
            {booking.event.image ? (
              <img
                src={booking.event.image}
                alt={booking.event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-background-secondary text-4xl font-bold text-foreground-muted">
                E
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <span className="inline-flex max-w-full rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                {booking.event.category}
              </span>

              <h2 className="mt-3 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {booking.event.title}
              </h2>
            </div>
          </div>

          <div className="p-5 sm:p-7 lg:p-8">
            {/* Event Details */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                Your Booking
              </p>

              <h3 className="mt-1.5 text-xl font-bold tracking-tight">
                Event details
              </h3>

              <div className="mt-5 grid gap-4 rounded-2xl border border-border bg-background-secondary/40 p-5 sm:grid-cols-2 sm:p-6">
                <InfoItem
                  label="Location"
                  value={booking.event.location}
                  icon={<MapPinIcon className="h-4 w-4" />}
                />

                <InfoItem
                  label="Date"
                  value={formattedDate}
                  icon={<CalendarDaysIcon className="h-4 w-4" />}
                />

                <InfoItem
                  label="Time"
                  value={booking.event.time}
                  icon={<ClockIcon className="h-4 w-4" />}
                />

                <InfoItem
                  label="Tickets"
                  value={`${booking.quantity} ${
                    booking.quantity === 1
                      ? "ticket"
                      : "tickets"
                  }`}
                  icon={<TicketIcon className="h-4 w-4" />}
                />

                <InfoItem
                  label="Booking Reference"
                  value={booking.bookingReference}
                  icon={<ShieldCheckIcon className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="my-8 border-t border-border" />

            {/* Payment Methods */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                Payment Method
              </p>

              <h3 className="mt-1.5 text-xl font-bold tracking-tight">
                Choose how to pay
              </h3>

              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                Select your preferred payment option.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <PaymentMethod
                  title="M-Pesa"
                  description="Pay securely using M-Pesa."
                  selected={method === "mpesa"}
                  onClick={() => setMethod("mpesa")}
                  icon={<WalletIcon className="h-6 w-6" />}
                />

                <PaymentMethod
                  title="Card"
                  description="Use a debit or credit card."
                  selected={method === "card"}
                  onClick={() => setMethod("card")}
                  icon={<CreditCardIcon className="h-6 w-6" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right Side - Summary */}
        <aside className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border bg-background-secondary/50 p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                Order Summary
              </p>

              <h3 className="mt-1.5 text-xl font-bold tracking-tight">
                Payment details
              </h3>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {booking.event.title}
                  </p>

                  <p className="mt-1 text-xs text-foreground-muted">
                    {booking.quantity}{" "}
                    {booking.quantity === 1
                      ? "ticket"
                      : "tickets"}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  KES {amount}
                </p>
              </div>

              <div className="my-5 border-t border-border" />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-foreground-muted">
                    Ticket price
                  </span>

                  <span className="font-medium">
                    KES{" "}
                    {booking.event.price.toLocaleString(
                      "en-KE"
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-foreground-muted">
                    Quantity
                  </span>

                  <span className="font-medium">
                    × {booking.quantity}
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-border" />

              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
                      Total to Pay
                    </p>

                    <p className="mt-1 text-xs text-foreground-secondary">
                      {method === "mpesa"
                        ? "M-Pesa"
                        : "Card"}
                    </p>
                  </div>

                  <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                    KES {amount}
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4"
                >
                  <p className="text-sm font-medium leading-6 text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  role="status"
                  className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                      <CheckCircleIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-green-400">
                        {success}
                      </p>

                      {paymentId && (
                        <p className="mt-1 text-xs leading-5 text-green-400/70">
                          Payment processed successfully.
                          Redirecting you to your booking...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={paying}
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/10 transition-all duration-200 hover:bg-accent-hover hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paying ? (
                  <span className="flex items-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing Payment...
                  </span>
                ) : (
                  `Pay KES ${amount}`
                )}
              </button>

              {/* Security */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-background-secondary/40 p-3.5">
                <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />

                <div>
                  <p className="text-xs font-semibold">
                    Secure checkout
                  </p>

                  <p className="mt-0.5 text-[11px] leading-5 text-foreground-muted">
                    Your payment details are handled securely.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-[10px] leading-5 text-foreground-muted">
                Development mode — no real payment will be
                charged.
              </p>
            </div>
          </div>

          <Link
            href={`/dashboard/bookings/${booking._id}`}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground-secondary transition-all hover:border-border-hover hover:bg-card-hover hover:text-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Booking
          </Link>
        </aside>
      </div>
    </div>
  );
}