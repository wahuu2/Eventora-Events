"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  InformationCircleIcon,
  MapPinIcon,
  PencilSquareIcon,
  PhotoIcon,
  TagIcon,
  TicketIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

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

const categories = [
  "Music",
  "Sports",
  "Technology",
  "Business",
  "Education",
  "Entertainment",
  "Food & Drink",
  "Arts & Culture",
  "Networking",
  "Christian Events",
];

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    date: "",
    time: "",
    category: "Music",
    price: "",
    capacity: "",
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/events/${id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch event."
          );
        }

        const fetchedEvent: Event = data.event;

        setEvent(fetchedEvent);

        const parsedDate = new Date(fetchedEvent.date);

        setForm({
          title: fetchedEvent.title || "",
          description: fetchedEvent.description || "",
          image: fetchedEvent.image || "",
          location: fetchedEvent.location || "",
          date: Number.isNaN(parsedDate.getTime())
            ? ""
            : parsedDate.toISOString().split("T")[0],
          time: fetchedEvent.time || "",
          category: fetchedEvent.category || "Music",
          price: String(fetchedEvent.price ?? 0),
          capacity: String(fetchedEvent.capacity ?? 1),
        });
      } catch (error) {
        console.error("Failed to fetch event:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load event."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEvent();
    }
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const price = Number(form.price);
    const capacity = Number(form.capacity);

    if (!form.title.trim()) {
      setError("Please enter an event title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter an event description.");
      return;
    }

    if (!form.image.trim()) {
      setError("Please provide an event image URL.");
      return;
    }

    if (!form.location.trim()) {
      setError("Please enter an event location.");
      return;
    }

    if (!form.date) {
      setError("Please select an event date.");
      return;
    }

    if (!form.time) {
      setError("Please select an event time.");
      return;
    }

    if (!form.category) {
      setError("Please select an event category.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a valid amount of 0 KES or more.");
      return;
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
      setError("Capacity must be a whole number greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          image: form.image.trim(),
          location: form.location.trim(),
          date: form.date,
          time: form.time,
          category: form.category,
          price,
          capacity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update event."
        );
      }

      if (data.event) {
        setEvent(data.event);
      }

      setSuccess("Event updated successfully.");

      setTimeout(() => {
        router.push("/dashboard/events");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error("Update event error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update event."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="w-full bg-background text-foreground">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="animate-pulse">
            <div className="h-4 w-28 rounded bg-card" />

            <div className="mt-6 h-10 w-64 rounded-lg bg-card sm:h-12 sm:w-80" />

            <div className="mt-3 h-4 w-full max-w-2xl rounded bg-card" />

            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
              <div className="h-48 bg-background-secondary sm:h-60" />

              <div className="space-y-7 p-5 sm:p-8">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="space-y-3">
                    <div className="h-3 w-28 rounded bg-background-secondary" />
                    <div className="h-12 rounded-xl bg-background-secondary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="w-full bg-background text-foreground">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <XCircleIcon className="h-7 w-7 text-red-400" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-red-400">
              Event Management
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Unable to load event
            </h1>

            <p className="mt-3 text-sm leading-6 text-foreground-secondary">
              {error}
            </p>

            <Link
              href="/dashboard/events"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover sm:w-auto"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to My Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* HEADER */}

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

                <span className="max-w-[220px] truncate text-foreground-secondary">
                  {event?.title || "Event"}
                </span>

                <span>/</span>

                <span>Edit</span>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5">
                <PencilSquareIcon className="h-3.5 w-3.5 text-accent" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                  Organizer Workspace
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Edit Event
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary sm:text-base">
                Update your event details, pricing, capacity, and
                attendee information.
              </p>
            </div>

            <Link
              href={`/dashboard/events/${id}`}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-border-hover px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-card sm:w-auto"
            >
              View Event
              <ArrowLeftIcon className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </section>

        {/* FORM */}

        <section className="mt-8">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            {/* FORM HEADER */}

            <div className="border-b border-border bg-background-secondary/30 p-5 sm:p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                  <PencilSquareIcon className="h-5 w-5 text-accent" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    Event Details
                  </p>

                  <h2 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
                    Update your event
                  </h2>

                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-foreground-secondary">
                    Keep your event information accurate so attendees
                    always see the latest details.
                  </p>
                </div>
              </div>
            </div>

            {/* FORM CONTENT */}

            <div className="space-y-8 p-5 sm:p-6 lg:p-8">
              {/* TITLE */}

              <div>
                <FormLabel
                  htmlFor="title"
                  label="Event title"
                  required
                />

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  placeholder="e.g. CFF Juja Conference"
                  className="form-input"
                />

                <p className="mt-2 text-xs text-foreground-muted">
                  Use a clear title that attendees can easily recognize.
                </p>
              </div>

              {/* DESCRIPTION */}

              <div>
                <FormLabel
                  htmlFor="description"
                  label="Description"
                  required
                />

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={7}
                  maxLength={3000}
                  placeholder="Describe what attendees can expect from this event..."
                  className="form-input resize-y"
                />

                <div className="mt-2 flex justify-between gap-3 text-xs text-foreground-muted">
                  <span>
                    Give attendees enough information to understand the
                    event.
                  </span>

                  <span className="shrink-0 font-medium">
                    {form.description.length}/3000
                  </span>
                </div>
              </div>

              {/* IMAGE */}

              <div>
                <FormLabel
                  htmlFor="image"
                  label="Event image"
                  required
                />

                <div className="relative">
                  <PhotoIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />

                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={handleChange}
                    required
                    placeholder="https://example.com/event-image.jpg"
                    className="form-input pl-12"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-foreground-muted">
                  Use a publicly accessible image URL. This image will
                  appear on your event listing and event page.
                </p>

                {form.image && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background-secondary">
                    <div className="relative">
                      <img
                        src={form.image}
                        alt="Event preview"
                        className="h-48 w-full object-cover sm:h-60"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                        <p className="text-xs font-medium text-white/80">
                          Event image preview
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* LOCATION */}

              <div>
                <FormLabel
                  htmlFor="location"
                  label="Location"
                  required
                />

                <div className="relative">
                  <MapPinIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="e.g. Juja, Kiambu"
                    className="form-input pl-12"
                  />
                </div>
              </div>

              {/* DATE / TIME */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <FormLabel
                    htmlFor="date"
                    label="Event date"
                    required
                  />

                  <div className="relative">
                    <CalendarDaysIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />

                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="form-input pl-12"
                    />
                  </div>
                </div>

                <div>
                  <FormLabel
                    htmlFor="time"
                    label="Event time"
                    required
                  />

                  <div className="relative">
                    <ClockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />

                    <input
                      id="time"
                      name="time"
                      type="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className="form-input pl-12"
                    />
                  </div>
                </div>
              </div>

              {/* CATEGORY */}

              <div>
                <FormLabel
                  htmlFor="category"
                  label="Category"
                  required
                />

                <div className="relative">
                  <TagIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="form-input cursor-pointer pl-12"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRICE / CAPACITY */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <FormLabel
                    htmlFor="price"
                    label="Ticket price"
                    required
                  />

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground-muted">
                      KES
                    </span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      value={form.price}
                      onChange={handleChange}
                      required
                      placeholder="0"
                      className="form-input pl-14"
                    />
                  </div>

                  <p className="mt-2 text-xs text-foreground-muted">
                    Enter 0 if the event is free.
                  </p>
                </div>

                <div>
                  <FormLabel
                    htmlFor="capacity"
                    label="Capacity"
                    required
                  />

                  <div className="relative">
                    <UserGroupIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />

                    <input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      step="1"
                      value={form.capacity}
                      onChange={handleChange}
                      required
                      placeholder="100"
                      className="form-input pl-12"
                    />
                  </div>

                  <p className="mt-2 text-xs text-foreground-muted">
                    Maximum number of attendees allowed.
                  </p>
                </div>
              </div>

              {/* ALERTS */}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                      <XCircleIcon className="h-5 w-5 text-red-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-red-400">
                        Update failed
                      </p>

                      <p className="mt-1 text-sm leading-6 text-red-300/80">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-emerald-400">
                        Event updated
                      </p>

                      <p className="mt-1 text-sm leading-6 text-emerald-300/80">
                        Your event has been updated successfully.
                        Redirecting to your events...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FORM ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-border bg-background-secondary/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:px-8">
              <Link
                href="/dashboard/events"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-hover px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-card sm:w-auto"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all duration-200 hover:bg-accent-hover hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {saving ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* INFORMATION PANEL */}

        <section className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <InformationCircleIcon className="h-5 w-5 text-accent" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold">
                  Before saving
                </h2>

                <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                  Make sure the date, time, location, ticket price,
                  and capacity are correct. Changes will be reflected
                  in the event information shown to attendees.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          min-height: 48px;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: var(--background);
          color: var(--foreground);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          line-height: 1.5rem;
          outline: none;
          transition:
            border-color 200ms ease,
            box-shadow 200ms ease,
            background-color 200ms ease;
        }

        .form-input:hover {
          border-color: var(--border-hover);
        }

        .form-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }

        .form-input::placeholder {
          color: var(--foreground-muted);
        }

        .form-input:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        @media (max-width: 639px) {
          .form-input {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
}

function FormLabel({
  htmlFor,
  label,
  required = false,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-foreground-secondary"
    >
      {label}

      {required && (
        <span className="ml-1 text-accent" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}