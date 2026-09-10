"use client";

import { useEffect, useState } from "react";
import {
  BellIcon,
  CheckIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  TicketIcon,
  InformationCircleIcon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

type Preferences = {
  bookingConfirmed: boolean;
  paymentSuccessful: boolean;
  ticketGenerated: boolean;
  eventUpdated: boolean;
  eventCancelled: boolean;
  eventReminder: boolean;
};

const defaultPreferences: Preferences = {
  bookingConfirmed: true,
  paymentSuccessful: true,
  ticketGenerated: true,
  eventUpdated: true,
  eventCancelled: true,
  eventReminder: true,
};

const preferenceItems: {
  key: keyof Preferences;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "bookingConfirmed",
    title: "Booking confirmations",
    description:
      "Get notified when your event booking is confirmed.",
    icon: <CheckIcon className="h-5 w-5" />,
  },
  {
    key: "paymentSuccessful",
    title: "Successful payments",
    description:
      "Get notified when a payment has been successfully completed.",
    icon: <CreditCardIcon className="h-5 w-5" />,
  },
  {
    key: "ticketGenerated",
    title: "Ticket delivery",
    description:
      "Get notified when your event tickets are ready.",
    icon: <TicketIcon className="h-5 w-5" />,
  },
  {
    key: "eventUpdated",
    title: "Event updates",
    description:
      "Get notified when an event you booked is updated.",
    icon: <CalendarDaysIcon className="h-5 w-5" />,
  },
  {
    key: "eventCancelled",
    title: "Event cancellations",
    description:
      "Get notified when an event you booked is cancelled.",
    icon: <XMarkIcon className="h-5 w-5" />,
  },
  {
    key: "eventReminder",
    title: "Event reminders",
    description:
      "Receive reminders about upcoming events.",
    icon: <BellIcon className="h-5 w-5" />,
  },
];

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] =
    useState<keyof Preferences | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchPreferences() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/notifications/preferences"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch notification preferences."
        );
      }

      setPreferences({
        bookingConfirmed:
          data.preferences.bookingConfirmed,
        paymentSuccessful:
          data.preferences.paymentSuccessful,
        ticketGenerated:
          data.preferences.ticketGenerated,
        eventUpdated:
          data.preferences.eventUpdated,
        eventCancelled:
          data.preferences.eventCancelled,
        eventReminder:
          data.preferences.eventReminder,
      });
    } catch (error) {
      console.error(
        "Failed to fetch notification preferences:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load notification preferences."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPreferences();
  }, []);

  async function togglePreference(
    key: keyof Preferences
  ) {
    if (savingKey) return;

    const previousValue = preferences[key];
    const newValue = !previousValue;

    setSavingKey(key);
    setMessage("");
    setError("");

    // Optimistic UI update
    setPreferences((current) => ({
      ...current,
      [key]: newValue,
    }));

    try {
      const response = await fetch(
        "/api/notifications/preferences",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [key]: newValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update notification preference."
        );
      }

      setMessage(
        `${preferenceItems.find(
          (item) => item.key === key
        )?.title} ${newValue ? "enabled" : "disabled"}.`
      );
    } catch (error) {
      console.error(
        "Failed to update notification preference:",
        error
      );

      // Restore previous value if saving failed
      setPreferences((current) => ({
        ...current,
        [key]: previousValue,
      }));

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update notification preference."
      );
    } finally {
      setSavingKey(null);
    }
  }

  const enabledCount = Object.values(preferences).filter(
    Boolean
  ).length;

  const allEnabled =
    enabledCount === preferenceItems.length;

  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                  <BellIcon className="h-5 w-5 text-accent" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    Account Settings
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Notification Preferences
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground-secondary sm:text-base">
                Control which Eventora notifications you receive
                about your bookings, payments, tickets, and events.
              </p>
            </div>

            {!loading && (
              <div className="flex shrink-0 items-center gap-3">
                <div className="rounded-xl border border-border bg-background-secondary px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
                    Active preferences
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {enabledCount} of {preferenceItems.length} enabled
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Status */}
      {message && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 sm:p-5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
            <CheckIcon className="h-5 w-5 text-green-400" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-green-400">
              Preferences saved
            </p>

            <p className="mt-1 text-xs leading-5 text-green-400/80">
              {message}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <InformationCircleIcon className="h-5 w-5 text-red-400" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-400">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm leading-6 text-red-400/80">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchPreferences}
              disabled={loading}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground-secondary transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowPathIcon
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Preferences Card */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background-secondary">
                <BellIcon className="h-5 w-5 text-accent" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                  Notifications
                </p>

                <h2 className="mt-1 text-lg font-bold tracking-tight">
                  Choose what reaches you
                </h2>

                <p className="mt-1.5 text-sm leading-6 text-foreground-muted">
                  Manage each notification type individually.
                </p>
              </div>
            </div>

            {!loading && (
              <div className="flex items-center gap-2 text-xs font-medium text-foreground-muted">
                <span
                  className={`h-2 w-2 rounded-full ${
                    allEnabled
                      ? "bg-green-400"
                      : "bg-accent"
                  }`}
                />

                {allEnabled
                  ? "All notifications enabled"
                  : `${enabledCount} notification types active`}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="divide-y divide-border">
            {preferenceItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-4 p-5 sm:p-6"
              >
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-background-secondary" />

                <div className="min-w-0 flex-1">
                  <div className="h-4 w-48 max-w-full animate-pulse rounded bg-background-secondary" />

                  <div className="mt-3 h-3 w-full max-w-2xl animate-pulse rounded bg-background-secondary" />

                  <div className="mt-3 h-2.5 w-16 animate-pulse rounded bg-background-secondary" />
                </div>

                <div className="h-7 w-12 shrink-0 animate-pulse rounded-full bg-background-secondary" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {preferenceItems.map((item) => {
              const enabled = preferences[item.key];
              const saving = savingKey === item.key;

              return (
                <div
                  key={item.key}
                  className={`group relative flex gap-4 p-4 transition-colors sm:p-6 ${
                    enabled
                      ? "bg-card hover:bg-card-hover"
                      : "bg-background-secondary/20 hover:bg-background-secondary/40"
                  }`}
                >
                  {/* Active indicator */}
                  <div
                    className={`absolute bottom-0 left-0 top-0 w-0.5 transition-colors ${
                      enabled
                        ? "bg-accent"
                        : "bg-transparent"
                    }`}
                  />

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
                      enabled
                        ? "border-accent/20 bg-accent/10 text-accent"
                        : "border-border bg-background-secondary text-foreground-muted"
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1 pr-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3
                          className={`break-words text-sm font-semibold sm:text-base ${
                            enabled
                              ? "text-foreground"
                              : "text-foreground-secondary"
                          }`}
                        >
                          {item.title}
                        </h3>

                        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-foreground-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          enabled
                            ? "bg-accent"
                            : "bg-foreground-muted"
                        }`}
                      />

                      <span
                        className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                          enabled
                            ? "text-accent"
                            : "text-foreground-muted"
                        }`}
                      >
                        {enabled ? "Enabled" : "Disabled"}
                      </span>

                      {saving && (
                        <span className="ml-1 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground-muted">
                          <ArrowPathIcon className="h-3 w-3 animate-spin" />
                          Saving
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      togglePreference(item.key)
                    }
                    disabled={savingKey !== null}
                    aria-label={`${
                      enabled ? "Disable" : "Enable"
                    } ${item.title}`}
                    aria-pressed={enabled}
                    className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-card ${
                      enabled
                        ? "bg-accent shadow-lg shadow-blue-500/10"
                        : "bg-border-hover"
                    } ${
                      savingKey !== null
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                        enabled ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Summary */}
      {!loading && (
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
              Enabled
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {enabledCount}
              </span>

              <span className="pb-0.5 text-sm text-foreground-muted">
                active
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
              Disabled
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {preferenceItems.length - enabledCount}
              </span>

              <span className="pb-0.5 text-sm text-foreground-muted">
                inactive
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
              Coverage
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {Math.round(
                  (enabledCount /
                    preferenceItems.length) *
                    100
                )}
                %
              </span>

              <span className="pb-0.5 text-sm text-foreground-muted">
                enabled
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Information */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <InformationCircleIcon className="h-5 w-5 text-accent" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-foreground">
              About notification settings
            </h2>

            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              These preferences control the notification types
              generated for your Eventora account. Turning a
              preference off does not delete notifications that
              already exist.
            </p>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-foreground-secondary">
              <span>
                You can update these settings whenever you want.
              </span>
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}