"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  MapPinIcon,
  PhotoIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

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

export default function CreateEventPage() {
  const router = useRouter();

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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageError, setImageError] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    if (name === "image") {
      setImageError(false);
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
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

    if (!form.location.trim()) {
      setError("Please enter the event location.");
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

    if (!form.image.trim()) {
      setError("Please provide an event image URL.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be 0 or greater.");
      return;
    }

    if (
      !Number.isFinite(capacity) ||
      capacity < 1 ||
      !Number.isInteger(capacity)
    ) {
      setError("Capacity must be a whole number greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/events", {
        method: "POST",
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
        throw new Error(data.message || "Failed to create event");
      }

      setSuccess("Event created successfully. Redirecting...");

      window.setTimeout(() => {
        router.push("/dashboard/events");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error("Create event error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create event"
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all placeholder:text-foreground-muted focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "mb-2 block text-sm font-semibold text-foreground";

  return (
    <main className="w-full bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-foreground-muted">
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            My Events
          </Link>

          <span aria-hidden="true">/</span>

          <span className="text-foreground-secondary">
            Create Event
          </span>
        </div>

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Organizer Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Create an Event
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary sm:text-base">
              Add the essential details for your event and publish
              it to the Eventora marketplace.
            </p>
          </div>

          <Link
            href="/dashboard/events"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-hover px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card sm:w-auto"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to My Events
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form
            onSubmit={handleSubmit}
            className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10"
          >
            <div className="border-b border-border px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <CalendarDaysIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Event Details
                  </h2>

                  <p className="mt-1 text-sm text-foreground-muted">
                    Provide clear information so attendees know what
                    to expect.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-7 p-5 sm:p-7">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Event title
                  <span className="ml-1 text-danger">*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  autoComplete="off"
                  placeholder="e.g. Nairobi Tech Summit 2026"
                  className={inputClass}
                />

                <div className="mt-2 flex justify-between gap-3">
                  <p className="text-xs text-foreground-muted">
                    Use a short, recognizable title that attendees
                    can easily understand.
                  </p>

                  <span className="shrink-0 text-xs text-foreground-muted">
                    {form.title.length}/120
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="description"
                    className={labelClass}
                  >
                    Description
                    <span className="ml-1 text-danger">*</span>
                  </label>

                  <span className="shrink-0 text-xs text-foreground-muted">
                    {form.description.length}/2000
                  </span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  rows={7}
                  placeholder="Tell people what your event is about..."
                  className={`${inputClass} resize-y`}
                />

                <p className="mt-2 text-xs text-foreground-muted">
                  Include the purpose of the event, what attendees
                  will experience, and any important information.
                </p>
              </div>

              <div>
                <label htmlFor="image" className={labelClass}>
                  Event image URL
                  <span className="ml-1 text-danger">*</span>
                </label>

                <div className="relative">
                  <PhotoIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />

                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={handleChange}
                    required
                    autoComplete="url"
                    placeholder="https://example.com/event-image.jpg"
                    className={`${inputClass} pl-11`}
                  />
                </div>

                <p className="mt-2 text-xs text-foreground-muted">
                  Use a publicly accessible image URL. A strong
                  landscape image works best for event cards.
                </p>

                {form.image && !imageError && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
                    <div className="relative aspect-video w-full">
                      <img
                        src={form.image}
                        alt="Event image preview"
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                      />

                      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                        <PhotoIcon className="h-3.5 w-3.5" />
                        Image Preview
                      </div>
                    </div>
                  </div>
                )}

                {form.image && imageError && (
                  <div className="mt-4 flex gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4">
                    <InformationCircleIcon className="h-5 w-5 shrink-0 text-danger" />

                    <p className="text-sm leading-5 text-danger">
                      This image could not be loaded. Check the URL
                      and make sure the image is publicly accessible.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  Location
                  <span className="ml-1 text-danger">*</span>
                </label>

                <div className="relative">
                  <MapPinIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />

                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    autoComplete="street-address"
                    placeholder="e.g. Nairobi, Kenya"
                    className={`${inputClass} pl-11`}
                  />
                </div>

                <p className="mt-2 text-xs text-foreground-muted">
                  Enter the venue, building, city, or other useful
                  location information.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className={labelClass}>
                    Date
                    <span className="ml-1 text-danger">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDaysIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />

                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className={labelClass}>
                    Time
                    <span className="ml-1 text-danger">*</span>
                  </label>

                  <div className="relative">
                    <ClockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />

                    <input
                      id="time"
                      name="time"
                      type="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                  <span className="ml-1 text-danger">*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-foreground-muted">
                  Choose the category that best matches your event.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className={labelClass}>
                    Ticket price
                    <span className="ml-1 text-danger">*</span>
                  </label>

                  <div className="relative">
                    <CurrencyDollarIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />

                    <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-xs font-semibold text-foreground-muted">
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
                      inputMode="numeric"
                      placeholder="0"
                      className={`${inputClass} pl-20`}
                    />
                  </div>

                  <p className="mt-2 text-xs text-foreground-muted">
                    Enter 0 for a free event.
                  </p>
                </div>

                <div>
                  <label htmlFor="capacity" className={labelClass}>
                    Capacity
                    <span className="ml-1 text-danger">*</span>
                  </label>

                  <div className="relative">
                    <UserGroupIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />

                    <input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      step="1"
                      value={form.capacity}
                      onChange={handleChange}
                      required
                      inputMode="numeric"
                      placeholder="100"
                      className={`${inputClass} pl-11`}
                    />
                  </div>

                  <p className="mt-2 text-xs text-foreground-muted">
                    Maximum number of attendees your event can
                    accommodate.
                  </p>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="flex gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4"
                >
                  <InformationCircleIcon className="h-5 w-5 shrink-0 text-danger" />

                  <div>
                    <p className="text-sm font-semibold text-danger">
                      Unable to create event
                    </p>

                    <p className="mt-1 text-sm text-danger/90">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {success && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex gap-3 rounded-xl border border-success/30 bg-success/10 p-4"
                >
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-success" />

                  <p className="text-sm font-semibold text-success">
                    {success}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/dashboard/events"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-border-hover px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background sm:w-auto"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/15 transition-all hover:bg-accent-hover hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <ArrowPathIcon
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Creating Event...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4" />
                      Create Event
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <aside className="h-fit space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold text-foreground">
                    Publishing checklist
                  </h2>

                  <p className="text-xs text-foreground-muted">
                    Before creating your event
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <ChecklistItem
                  number="1"
                  title="Clear title"
                  description="Make your event immediately recognizable."
                />

                <ChecklistItem
                  number="2"
                  title="Useful description"
                  description="Explain what attendees can expect."
                />

                <ChecklistItem
                  number="3"
                  title="Strong image"
                  description="Use a high-quality publicly accessible image."
                />

                <ChecklistItem
                  number="4"
                  title="Accurate details"
                  description="Double-check date, time, location, price, and capacity."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
              <div className="flex items-center gap-2 text-accent">
                <InformationCircleIcon className="h-5 w-5" />

                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  Eventora
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-foreground-secondary">
                Your event will become available through the public
                events experience after it is created.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ChecklistItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent">
        {number}
      </span>

      <div>
        <p className="text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-foreground-muted">
          {description}
        </p>
      </div>
    </div>
  );
}