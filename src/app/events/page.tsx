"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  {
    number: "01",
    title: "Music",
    description: "Concerts, live shows & festivals",
    icon: "♫",
  },
  {
    number: "02",
    title: "Sports",
    description: "Matches, tournaments & fitness",
    icon: "⚽",
  },
  {
    number: "03",
    title: "Technology",
    description: "Tech, innovation & digital events",
    icon: "⌘",
  },
  {
    number: "04",
    title: "Business",
    description: "Networking, conferences & business",
    icon: "▣",
  },
  {
    number: "05",
    title: "Education",
    description: "Workshops, training & learning",
    icon: "▤",
  },
  {
    number: "06",
    title: "Entertainment",
    description: "Comedy, lifestyle & experiences",
    icon: "✦",
  },
];

const locations = ["All", "Juja", "Nairobi", "Thika", "Kiambu"];

const dateFilters = [
  { label: "All Dates", value: "All" },
  { label: "Today", value: "Today" },
  { label: "This Week", value: "Week" },
  { label: "This Month", value: "Month" },
];

const priceFilters = [
  { label: "All Prices", value: "All" },
  { label: "Free", value: "Free" },
  { label: "Paid", value: "Paid" },
];

const sortOptions = [
  { label: "Soonest", value: "soonest" },
  { label: "Latest", value: "latest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sort, setSort] = useState("soonest");

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvents() {
      try {
        setLoading(true);
        setFetchError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (location !== "All") {
          params.set("location", location);
        }

        if (dateFilter !== "All") {
          params.set("date", dateFilter.toLowerCase());
        }

        if (priceFilter !== "All") {
          params.set("price", priceFilter.toLowerCase());
        }

        if (sort !== "soonest") {
          params.set("sort", sort);
        }

        const queryString = params.toString();

        const response = await fetch(
          `/api/events${queryString ? `?${queryString}` : ""}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load events.");
        }

        setEvents(Array.isArray(data.events) ? data.events : []);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Failed to fetch events:", error);

        setEvents([]);

        setFetchError(
          error instanceof Error
            ? error.message
            : "Unable to load events. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchEvents();

    return () => {
      controller.abort();
    };
  }, [search, location, dateFilter, priceFilter, sort]);

  const hasActiveFilters =
    search.trim() !== "" ||
    location !== "All" ||
    dateFilter !== "All" ||
    priceFilter !== "All" ||
    sort !== "soonest";

  const hasSecondaryFilters =
    priceFilter !== "All" || sort !== "soonest";

  function clearFilters() {
    setSearch("");
    setLocation("All");
    setDateFilter("All");
    setPriceFilter("All");
    setSort("soonest");
  }

  function retryEvents() {
    setFetchError("");
    setLoading(true);

    setSearch((current) => `${current} `);

    setTimeout(() => {
      setSearch((current) => current.trim());
    }, 0);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />

      {/* =====================================================
          DISCOVER + CATEGORIES + SEARCH + FILTERS
      ====================================================== */}

      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* DISCOVER + CATEGORIES */}

          <div className="border-b border-border py-12 sm:py-16 lg:py-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background-secondary px-3.5 py-2 text-xs font-semibold text-foreground-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Discover events across Kenya
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  Explore by category
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                  Find something worth experiencing.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-foreground-secondary sm:text-base">
                  Explore different types of events and discover what is
                  happening around Kenya.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                  <Link
                    key={category.number}
                    href="/events"
                    className="group rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-card-hover"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-lg text-accent transition-transform duration-300 group-hover:scale-105">
                      {category.icon}
                    </div>

                    <p className="mt-5 text-sm font-bold text-foreground">
                      {category.title}
                    </p>

                    <p className="mt-1.5 text-[11px] leading-5 text-foreground-muted">
                      {category.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* SEARCH + FILTERS */}

          <div className="border-b border-border py-6 sm:py-8">
            <div className="rounded-2xl border border-border bg-background-secondary p-4 shadow-sm sm:p-5 lg:p-6">
              {/* SEARCH */}

              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-foreground-muted">
                  <SearchIcon className="h-5 w-5" />
                </div>

                <label htmlFor="event-search" className="sr-only">
                  Search events
                </label>

                <input
                  id="event-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, locations, or descriptions..."
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-foreground-muted hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/10 sm:h-14 sm:text-base"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-background-secondary hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                )}
              </div>

              {/* LOCATION + DATE + MORE FILTERS */}

              <div className="mt-5">
                <div className="grid gap-5 sm:grid-cols-3">
                  <FilterSelectGroup
                    title="Location"
                    value={location}
                    options={locations}
                    onChange={setLocation}
                  />

                  <FilterSelectGroup
                    title="Date"
                    value={
                      dateFilters.find(
                        (item) => item.value === dateFilter
                      )?.label ?? "All Dates"
                    }
                    options={dateFilters.map((item) => item.label)}
                    onChange={(label) => {
                      const selected = dateFilters.find(
                        (item) => item.label === label
                      );

                      if (selected) {
                        setDateFilter(selected.value);
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowMoreFilters((current) => !current)
                    }
                    className={`flex min-h-11 items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                      showMoreFilters || hasSecondaryFilters
                        ? "border-accent/40 bg-accent/10"
                        : "border-border bg-card hover:border-border-hover hover:bg-card-hover"
                    }`}
                  >
                    <span>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                        More Filters
                      </span>

                      <span className="mt-0.5 block text-sm font-semibold text-foreground">
                        {hasSecondaryFilters
                          ? "Filters applied"
                          : "Price & sorting"}
                      </span>
                    </span>

                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-foreground-secondary transition-transform duration-200 ${
                        showMoreFilters ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDownIcon />
                    </span>
                  </button>
                </div>
              </div>

              {/* MORE FILTERS */}

              {showMoreFilters && (
                <div className="mt-5 grid gap-6 border-t border-border pt-5 sm:grid-cols-2">
                  <FilterGroup title="Price">
                    <FilterButtons
                      items={priceFilters.map((item) => item.label)}
                      activeValue={
                        priceFilters.find(
                          (item) => item.value === priceFilter
                        )?.label ?? "All Prices"
                      }
                      onSelect={(label) => {
                        const selected = priceFilters.find(
                          (item) => item.label === label
                        );

                        if (selected) {
                          setPriceFilter(selected.value);
                        }
                      }}
                    />
                  </FilterGroup>

                  <FilterGroup title="Sort by">
                    <FilterButtons
                      items={sortOptions.map((item) => item.label)}
                      activeValue={
                        sortOptions.find(
                          (item) => item.value === sort
                        )?.label ?? "Soonest"
                      }
                      onSelect={(label) => {
                        const selected = sortOptions.find(
                          (item) => item.label === label
                        );

                        if (selected) {
                          setSort(selected.value);
                        }
                      }}
                    />
                  </FilterGroup>
                </div>
              )}

              {/* ACTIVE FILTERS */}

              {hasActiveFilters && (
                <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-foreground-muted">
                      Active:
                    </span>

                    {search.trim() && (
                      <FilterTag
                        label={`"${search.trim()}"`}
                        onRemove={() => setSearch("")}
                      />
                    )}

                    {location !== "All" && (
                      <FilterTag
                        label={location}
                        onRemove={() => setLocation("All")}
                      />
                    )}

                    {dateFilter !== "All" && (
                      <FilterTag
                        label={
                          dateFilters.find(
                            (item) => item.value === dateFilter
                          )?.label ?? dateFilter
                        }
                        onRemove={() => setDateFilter("All")}
                      />
                    )}

                    {priceFilter !== "All" && (
                      <FilterTag
                        label={
                          priceFilters.find(
                            (item) => item.value === priceFilter
                          )?.label ?? priceFilter
                        }
                        onRemove={() => setPriceFilter("All")}
                      />
                    )}

                    {sort !== "soonest" && (
                      <FilterTag
                        label={
                          sortOptions.find(
                            (item) => item.value === sort
                          )?.label ?? sort
                        }
                        onRemove={() => setSort("soonest")}
                      />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="shrink-0 text-xs font-bold text-accent transition-colors hover:text-foreground"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          EVENTS
      ====================================================== */}

      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Discover
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Upcoming Events
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-foreground-muted">
                Explore experiences happening soon and find
                something worth attending.
              </p>
            </div>

            {!loading && !fetchError && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground-muted">
                  {events.length}{" "}
                  {events.length === 1 ? "event" : "events"}
                </span>

                {hasActiveFilters && (
                  <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                    Filtered
                  </span>
                )}
              </div>
            )}
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="aspect-[16/10] animate-pulse bg-background-secondary" />

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
          ) : fetchError ? (
            <div className="rounded-2xl border border-danger/30 bg-card px-5 py-16 text-center sm:px-8 sm:py-20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-danger/20 bg-danger/10 text-danger">
                <span className="text-xl font-bold">!</span>
              </div>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-danger">
                Something went wrong
              </p>

              <h3 className="mt-2 text-xl font-bold sm:text-2xl">
                We couldn't load the events
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-foreground-secondary">
                {fetchError}
              </p>

              <button
                type="button"
                onClick={retryEvents}
                className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-accent-hover sm:w-auto"
              >
                Try Again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card px-5 py-16 text-center sm:px-8 sm:py-20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border-hover bg-background-secondary text-accent">
                <SearchIcon className="h-6 w-6" />
              </div>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                No results
              </p>

              <h3 className="mt-2 text-xl font-bold sm:text-2xl">
                No events found
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-foreground-secondary">
                We couldn't find any events matching your
                current search and filters. Try changing your
                criteria or clearing the filters.
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-accent-hover sm:w-auto"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function EventCard({ event }: { event: Event }) {
  const [imageError, setImageError] = useState(false);

  const dateParts = (() => {
    const date = new Date(event.date);

    if (Number.isNaN(date.getTime())) {
      return {
        day: "--",
        month: "---",
        full: "Date unavailable",
      };
    }

    return {
      day: date.toLocaleDateString("en-KE", {
        day: "2-digit",
      }),
      month: date.toLocaleDateString("en-KE", {
        month: "short",
      }),
      full: date.toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  })();

  return (
    <Link
      href={`/events/${event._id}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

        <div className="absolute left-4 top-4 overflow-hidden rounded-xl border border-white/15 bg-black/70 text-center backdrop-blur-md">
          <div className="min-w-[52px] px-2.5 py-2">
            <p className="text-lg font-bold leading-none text-white">
              {dateParts.day}
            </p>

            <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-accent">
              {dateParts.month}
            </p>
          </div>
        </div>

        <div className="absolute right-4 top-4 max-w-[55%]">
          <span className="inline-flex max-w-full truncate rounded-lg border border-white/10 bg-black/65 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            {event.category}
          </span>
        </div>

        <div className="absolute bottom-4 right-4">
          <span className="rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            {event.price === 0
              ? "FREE"
              : `KES ${event.price.toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="line-clamp-2 text-lg font-bold leading-tight tracking-tight transition-colors group-hover:text-accent sm:text-xl">
          {event.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground-secondary">
          {event.description}
        </p>

        <div className="mt-5 space-y-3">
          <EventMeta
            icon={<LocationIcon />}
            label="Location"
            value={event.location}
            truncate
          />

          <div className="grid grid-cols-2 gap-3">
            <EventMeta
              icon={<CalendarIcon />}
              label="Date"
              value={dateParts.full}
            />

            {event.time ? (
              <EventMeta
                icon={<ClockIcon />}
                label="Time"
                value={event.time}
              />
            ) : (
              <div />
            )}
          </div>
        </div>

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

          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background-secondary px-3 py-2 text-xs font-bold text-accent transition-all group-hover:border-accent/30 group-hover:bg-accent group-hover:text-white sm:text-sm">
            View Event

            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

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

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
        {title}
      </h3>

      {children}
    </div>
  );
}

function FilterButtons({
  items,
  activeValue,
  onSelect,
}: {
  items: string[];
  activeValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <div className="flex w-max min-w-full gap-2">
        {items.map((item) => {
          const active = activeValue === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              aria-pressed={active}
              className={`shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${
                active
                  ? "border-accent bg-accent text-white shadow-lg shadow-blue-500/10"
                  : "border-border bg-background text-foreground-secondary hover:border-border-hover hover:bg-card hover:text-foreground"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterSelectGroup({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
        {title}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-10 text-sm font-semibold text-foreground outline-none transition-all hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/10"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
}

function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:border-accent/40 hover:bg-accent/15"
    >
      <span className="max-w-[180px] truncate">{label}</span>

      <span
        aria-hidden="true"
        className="text-sm leading-none"
      >
        ×
      </span>
    </button>
  );
}

function SearchIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

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
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />
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