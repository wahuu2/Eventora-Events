"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  UsersIcon,
  CalendarDaysIcon,
  TicketIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

type Analytics = {
  users: {
    total: number;
    organizers: number;
    admins: number;
  };
  events: {
    total: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
  revenue: {
    confirmedBookingRevenue: number;
  };
  tickets: {
    total: number;
    valid: number;
    used: number;
    cancelled: number;
  };
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/analytics",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load analytics"
          );
        }

        setAnalytics(data.analytics);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-responsive py-10 sm:py-16">
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>

            <h1 className="mt-4 text-lg font-bold">
              Analytics unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              {error ||
                "Unable to load platform analytics."}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground-secondary transition hover:bg-background hover:text-foreground"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Overview
              </Link>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bookingConfirmationRate =
    analytics.bookings.total > 0
      ? Math.round(
          (analytics.bookings.confirmed /
            analytics.bookings.total) *
            100
        )
      : 0;

  const ticketUsageRate =
    analytics.tickets.total > 0
      ? Math.round(
          (analytics.tickets.used /
            analytics.tickets.total) *
            100
        )
      : 0;

  const regularUsers = Math.max(
    analytics.users.total -
      analytics.users.organizers -
      analytics.users.admins,
    0
  );

  const organizerShare = getPercentage(
    analytics.users.organizers,
    analytics.users.total
  );

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <section className="border-b border-border bg-background-secondary/30">
        <div className="container-responsive py-7 sm:py-9 lg:py-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
                  <ChartBarIcon className="h-4 w-4" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                  Platform Intelligence
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Analytics
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary">
                Monitor Eventora&apos;s users, events,
                bookings, revenue, and ticket activity from
                one place.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-accent/20 bg-accent/10 p-4 sm:p-5 lg:w-auto lg:min-w-[260px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                    Confirmed Revenue
                  </p>

                  <p className="mt-2 truncate text-2xl font-black tracking-tight sm:text-3xl">
                    {formatAmount(
                      analytics.revenue
                        .confirmedBookingRevenue
                    )}
                  </p>

                  <p className="mt-1 text-xs text-foreground-muted">
                    From confirmed bookings
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background/30 text-accent">
                  <CurrencyDollarIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIMARY METRICS */}
      <section className="container-responsive py-5 sm:py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Users"
            value={analytics.users.total}
            detail={`${analytics.users.organizers} organizers`}
            icon={<UsersIcon className="h-5 w-5" />}
          />

          <MetricCard
            label="Events"
            value={analytics.events.total}
            detail="Platform events"
            icon={
              <CalendarDaysIcon className="h-5 w-5" />
            }
          />

          <MetricCard
            label="Bookings"
            value={analytics.bookings.total}
            detail={`${bookingConfirmationRate}% confirmed`}
            icon={<TicketIcon className="h-5 w-5" />}
          />

          <MetricCard
            label="Tickets"
            value={analytics.tickets.total}
            detail={`${ticketUsageRate}% used`}
            icon={<ChartBarIcon className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* MAIN ANALYTICS */}
      <section className="container-responsive pb-5 sm:pb-6">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {/* USERS */}
          <AnalyticsCard
            title="User Composition"
            description="Breakdown of platform accounts"
            icon={
              <UserGroupIcon className="h-5 w-5" />
            }
          >
            <div className="space-y-5">
              <ProgressRow
                label="Regular Users"
                value={regularUsers}
                total={analytics.users.total}
              />

              <ProgressRow
                label="Organizers"
                value={analytics.users.organizers}
                total={analytics.users.total}
                accent
              />

              <ProgressRow
                label="Administrators"
                value={analytics.users.admins}
                total={analytics.users.total}
              />
            </div>
          </AnalyticsCard>

          {/* BOOKINGS */}
          <AnalyticsCard
            title="Booking Status"
            description="Current booking distribution"
            icon={
              <TicketIcon className="h-5 w-5" />
            }
          >
            <div className="space-y-5">
              <ProgressRow
                label="Confirmed"
                value={analytics.bookings.confirmed}
                total={analytics.bookings.total}
                accent
              />

              <ProgressRow
                label="Pending"
                value={analytics.bookings.pending}
                total={analytics.bookings.total}
              />

              <ProgressRow
                label="Cancelled"
                value={analytics.bookings.cancelled}
                total={analytics.bookings.total}
              />
            </div>
          </AnalyticsCard>

          {/* TICKETS */}
          <AnalyticsCard
            title="Ticket Status"
            description="Digital ticket lifecycle"
            icon={
              <CheckCircleIcon className="h-5 w-5" />
            }
          >
            <div className="space-y-5">
              <ProgressRow
                label="Valid"
                value={analytics.tickets.valid}
                total={analytics.tickets.total}
                accent
              />

              <ProgressRow
                label="Used"
                value={analytics.tickets.used}
                total={analytics.tickets.total}
              />

              <ProgressRow
                label="Cancelled"
                value={analytics.tickets.cancelled}
                total={analytics.tickets.total}
              />
            </div>
          </AnalyticsCard>
        </div>
      </section>

      {/* QUICK INSIGHTS */}
      <section className="container-responsive pb-5 sm:pb-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <InsightCard
            label="Booking Conversion"
            value={`${bookingConfirmationRate}%`}
            description="Of all bookings are confirmed"
            icon={
              <ArrowTrendingUpIcon className="h-5 w-5" />
            }
            accent
          />

          <InsightCard
            label="Ticket Utilization"
            value={`${ticketUsageRate}%`}
            description="Of issued tickets have been used"
            icon={<CheckCircleIcon className="h-5 w-5" />}
          />

          <InsightCard
            label="Organizer Share"
            value={`${organizerShare}%`}
            description="Of total accounts are organizers"
            icon={<UserGroupIcon className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* PERFORMANCE SUMMARY */}
      <section className="container-responsive pb-8 sm:pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border px-4 py-5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold">
                Platform Performance
              </h2>

              <p className="mt-1 text-xs leading-5 text-foreground-muted">
                Key operational indicators across Eventora.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Live platform metrics
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4">
            <PerformanceItem
              label="Booking Conversion"
              value={`${bookingConfirmationRate}%`}
              description="Bookings confirmed"
              icon={
                <ArrowTrendingUpIcon className="h-4 w-4" />
              }
            />

            <PerformanceItem
              label="Ticket Utilization"
              value={`${ticketUsageRate}%`}
              description="Tickets already used"
              icon={
                <CheckCircleIcon className="h-4 w-4" />
              }
            />

            <PerformanceItem
              label="Organizer Share"
              value={`${organizerShare}%`}
              description="Of total accounts"
              icon={
                <UserGroupIcon className="h-4 w-4" />
              }
            />

            <PerformanceItem
              label="Revenue"
              value={formatAmount(
                analytics.revenue
                  .confirmedBookingRevenue
              )}
              description="From confirmed bookings"
              icon={
                <CurrencyDollarIcon className="h-4 w-4" />
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------- */
/* METRIC CARD */
/* -------------------------------- */

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:shadow-lg hover:shadow-black/10 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight sm:mt-4">
            {value.toLocaleString("en-KE")}
          </p>

          <p className="mt-1 truncate text-xs text-foreground-muted">
            {detail}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-accent transition-all duration-200 group-hover:border-accent/30 group-hover:bg-accent/10">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* ANALYTICS CARD */
/* -------------------------------- */

function AnalyticsCard({
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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-accent">
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

/* -------------------------------- */
/* PROGRESS ROW */
/* -------------------------------- */

function ProgressRow({
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
        <span className="min-w-0 truncate text-xs font-semibold">
          {label}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs font-bold text-foreground-secondary">
            {value.toLocaleString("en-KE")}
          </span>

          <span className="text-[10px] text-foreground-muted">
            ({percentage}%)
          </span>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            accent
              ? "bg-accent"
              : "bg-foreground-muted"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------- */
/* INSIGHT CARD */
/* -------------------------------- */

function InsightCard({
  label,
  value,
  description,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${
        accent
          ? "border-accent/20 bg-accent/10"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
              accent
                ? "text-accent"
                : "text-foreground-muted"
            }`}
          >
            {label}
          </p>

          <p className="mt-3 text-2xl font-black tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs leading-5 text-foreground-muted">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            accent
              ? "border-accent/20 bg-background/30 text-accent"
              : "border-border bg-background text-foreground-muted"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* PERFORMANCE ITEM */
/* -------------------------------- */

function PerformanceItem({
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
    <div className="border-b border-border p-4 last:border-b-0 sm:border-r sm:p-5 sm:nth-[2n]:border-r-0 xl:border-b-0 xl:border-r xl:nth-[2n]:border-r xl:last:border-r-0">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
          {label}
        </p>

        <span className="text-accent">
          {icon}
        </span>
      </div>

      <p className="mt-3 truncate text-xl font-black sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------- */
/* SKELETON */
/* -------------------------------- */

function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-background-secondary/30">
        <div className="container-responsive py-8 sm:py-10">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-card" />

          <div className="mt-4 h-3 w-36 animate-pulse rounded bg-card" />

          <div className="mt-4 h-10 w-48 animate-pulse rounded bg-card sm:w-56" />

          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-card" />

          <div className="mt-6 h-24 w-full animate-pulse rounded-2xl bg-card sm:w-64" />
        </div>
      </section>

      <div className="container-responsive py-5 sm:py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>

        <div className="mt-5 h-48 animate-pulse rounded-2xl border border-border bg-card" />
      </div>
    </div>
  );
}

/* -------------------------------- */
/* HELPERS */
/* -------------------------------- */

function formatAmount(amount: number) {
  return `KES ${Number(amount || 0).toLocaleString(
    "en-KE"
  )}`;
}

function getPercentage(
  value: number,
  total: number
) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}