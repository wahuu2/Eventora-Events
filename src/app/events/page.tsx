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

const categoryDetails: Record<
  string,
  {
    number: string;
    description: string;
    icon: string;
  }
> = {
  Music: {
    number: "01",
    description: "Concerts, live shows & festivals",
    icon: "♫",
  },
  Sports: {
    number: "02",
    description: "Matches, tournaments & fitness",
    icon: "⚽",
  },
  Technology: {
    number: "03",
    description: "Tech, innovation & digital events",
    icon: "⌘",
  },
  Business: {
    number: "04",
    description: "Networking, conferences & business",
    icon: "▣",
  },
  Education: {
    number: "05",
    description: "Workshops, training & learning",
    icon: "▤",
  },
  Entertainment: {
    number: "06",
    description: "Comedy, lifestyle & experiences",
    icon: "✦",
  },
  "Food & Drink": {
    number: "07",
    description: "Food experiences, dining & tastings",
    icon: "♨",
  },
  "Arts & Culture": {
    number: "08",
    description: "Art, culture, exhibitions & heritage",
    icon: "◈",
  },
  Networking: {
    number: "09",
    description: "Meetups, communities & connections",
    icon: "◎",
  },
  "Christian Events": {
    number: "10",
    description: "Worship, conferences & faith events",
    icon: "✝",
  },
};

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

  const [category, setCategory] = useState(() => {
    if (typeof window === "undefined") {
      return "All";
    }

    const urlCategory = new URLSearchParams(
      window.location.search
    ).get("category");

    return urlCategory && categories.includes(urlCategory)
      ? urlCategory
      : "All";
  });

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

        if (category !== "All") {
          params.set("category", category);
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
          throw new Error(
            data.message || "Failed to load events."
          );
        }

        setEvents(
          Array.isArray(data.events) ? data.events : []
        );
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
  }, [
    search,
    category,
    location,
    dateFilter,
    priceFilter,
    sort,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "All" ||
    location !== "All" ||
    dateFilter !== "All" ||
    priceFilter !== "All" ||
    sort !== "soonest";

  const hasSecondaryFilters =
    priceFilter !== "All" || sort !== "soonest";

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setLocation("All");
    setDateFilter("All");
    setPriceFilter("All");
    setSort("soonest");

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);

      url.searchParams.delete("category");

      window.history.replaceState(
        {},
        "",
        url.toString()
      );
    }
  }

  function selectCategory(selectedCategory: string) {
    setCategory(selectedCategory);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);

      if (selectedCategory === "All") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set(
          "category",
          selectedCategory
        );
      }

      window.history.replaceState(
        {},
        "",
        url.toString()
      );
    }
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
      {/* NAVBAR */}
      <Navbar />

      {/* DISCOVER + CATEGORIES + FILTERS */}
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

        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* DISCOVER + CATEGORIES */}
          <div className="border-b border-border py-8 sm:py-14 lg:py-20">
            <div>
              <div className="flex flex-col gap-5 border-b border-border pb-7 sm:gap-6 sm:pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background-secondary px-3 py-1.5 text-[9px] font-semibold text-foreground-secondary sm:px-3.5 sm:py-2 sm:text-xs">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />

                    <span className="truncate">
                      Discover events across Kenya
                    </span>
                  </div>

                  <div className="mt-5 sm:mt-7">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent sm:text-[11px]">
                      Explore by category
                    </p>

                    <h1 className="mt-2 max-w-3xl text-[1.85rem] font-black leading-[1.06] tracking-[-0.035em] text-foreground xs:text-[2.1rem] sm:text-4xl md:text-5xl">
                      Find something worth experiencing.
                    </h1>

                    <p className="mt-3 max-w-xl text-xs leading-5 text-foreground-secondary sm:mt-4 sm:text-base sm:leading-7">
                      From live music and sports to technology,
                      business, culture, and entertainment, discover
                      experiences happening around Kenya.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => selectCategory("All")}
                  className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 sm:w-fit ${
                    category === "All"
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border bg-card text-foreground-secondary hover:border-border-hover hover:bg-card-hover hover:text-foreground"
                  }`}
                >
                  View all events
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              {/* CATEGORY CARDS */}
              <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
                {categories.map((categoryName) => {
                  const details =
                    categoryDetails[categoryName];

                  const active =
                    category === categoryName;

                  return (
                    <button
                      key={categoryName}
                      type="button"
                      onClick={() =>
                        selectCategory(categoryName)
                      }
                      aria-pressed={active}
                      className={`group relative flex min-h-[126px] min-w-0 flex-col overflow-hidden rounded-xl border p-3.5 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 sm:min-h-[165px] sm:rounded-2xl sm:p-5 ${
                        active
                          ? "border-accent/50 bg-accent/10 shadow-lg shadow-accent/5"
                          : "border-border bg-card/70 hover:border-accent/40 hover:bg-card-hover"
                      }`}
                    >
                      <span
                        className={`absolute right-3 top-3 text-[8px] font-bold tracking-[0.16em] transition-colors duration-200 sm:right-4 sm:top-4 sm:text-[10px] ${
                          active
                            ? "text-accent"
                            : "text-foreground-muted group-hover:text-accent"
                        }`}
                      >
                        {details.number}
                      </span>

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm transition-all duration-300 group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-xl sm:text-lg ${
                          active
                            ? "border-accent/40 bg-accent/15 text-accent"
                            : "border-accent/20 bg-accent/10 text-accent"
                        }`}
                      >
                        {details.icon}
                      </div>

                      <p
                        className={`mt-3 text-[11px] font-bold leading-4 transition-colors duration-200 sm:mt-5 sm:text-sm sm:leading-5 ${
                          active
                            ? "text-accent"
                            : "text-foreground group-hover:text-accent"
                        }`}
                      >
                        {categoryName}
                      </p>

                      <p className="mt-1 line-clamp-2 text-[9px] leading-3.5 text-foreground-muted sm:mt-1.5 sm:text-[11px] sm:leading-5">
                        {details.description}
                      </p>

                      <div
                        className={`mt-auto flex items-center gap-1 pt-2 text-[8px] font-bold transition-colors duration-200 sm:pt-4 sm:text-[10px] ${
                          active
                            ? "text-accent"
                            : "text-foreground-secondary group-hover:text-accent"
                        }`}
                      >
                        {active ? "Selected" : "Explore"}

                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="border-b border-border py-5 sm:py-7 lg:py-8">
            <div className="rounded-2xl border border-border bg-background-secondary p-3 shadow-sm sm:p-5 lg:p-6">
              {/* SEARCH */}
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-foreground-muted sm:left-4">
                  <SearchIcon className="h-5 w-5" />
                </div>

                <label
                  htmlFor="event-search"
                  className="sr-only"
                >
                  Search events
                </label>

                <input
                  id="event-search"
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search events, locations, or descriptions..."
                  autoComplete="off"
                  className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-11 text-sm text-foreground outline-none transition-all placeholder:text-foreground-muted hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/10 sm:h-14 sm:pl-12 sm:text-base"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-background-secondary hover:text-foreground sm:right-3"
                    aria-label="Clear search"
                  >
                    <span className="text-lg leading-none">
                      ×
                    </span>
                  </button>
                )}
              </div>

              {/* PRIMARY FILTERS */}
              <div className="mt-3.5 sm:mt-5">
                <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4">
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
                        (item) =>
                          item.value === dateFilter
                      )?.label ?? "All Dates"
                    }
                    options={dateFilters.map(
                      (item) => item.label
                    )}
                    onChange={(label) => {
                      const selected =
                        dateFilters.find(
                          (item) =>
                            item.label === label
                        );

                      if (selected) {
                        setDateFilter(selected.value);
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowMoreFilters(
                        (current) => !current
                      )
                    }
                    className={`flex min-h-11 items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-all sm:px-4 sm:py-3 ${
                      showMoreFilters ||
                      hasSecondaryFilters
                        ? "border-accent/40 bg-accent/10"
                        : "border-border bg-card hover:border-border-hover hover:bg-card-hover"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[8px] font-bold uppercase tracking-wider text-foreground-muted sm:text-[10px]">
                        More Filters
                      </span>

                      <span className="mt-0.5 block truncate text-xs font-semibold text-foreground sm:text-sm">
                        {hasSecondaryFilters
                          ? "Filters applied"
                          : "Price & sorting"}
                      </span>
                    </span>

                    <span
                      className={`ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground-secondary transition-transform duration-200 ${
                        showMoreFilters
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      <ChevronDownIcon />
                    </span>
                  </button>
                </div>
              </div>

              {/* SECONDARY FILTERS */}
              {showMoreFilters && (
                <div className="mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2 sm:gap-6">
                  <FilterGroup title="Price">
                    <FilterButtons
                      items={priceFilters.map(
                        (item) => item.label
                      )}
                      activeValue={
                        priceFilters.find(
                          (item) =>
                            item.value === priceFilter
                        )?.label ?? "All Prices"
                      }
                      onSelect={(label) => {
                        const selected =
                          priceFilters.find(
                            (item) =>
                              item.label === label
                          );

                        if (selected) {
                          setPriceFilter(
                            selected.value
                          );
                        }
                      }}
                    />
                  </FilterGroup>

                  <FilterGroup title="Sort by">
                    <FilterButtons
                      items={sortOptions.map(
                        (item) => item.label
                      )}
                      activeValue={
                        sortOptions.find(
                          (item) => item.value === sort
                        )?.label ?? "Soonest"
                      }
                      onSelect={(label) => {
                        const selected =
                          sortOptions.find(
                            (item) =>
                              item.label === label
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
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="mr-0.5 text-[10px] font-semibold text-foreground-muted sm:text-xs">
                      Active:
                    </span>

                    {search.trim() && (
                      <FilterTag
                        label={`"${search.trim()}"`}
                        onRemove={() => setSearch("")}
                      />
                    )}

                    {category !== "All" && (
                      <FilterTag
                        label={category}
                        onRemove={() =>
                          selectCategory("All")
                        }
                      />
                    )}

                    {location !== "All" && (
                      <FilterTag
                        label={location}
                        onRemove={() =>
                          setLocation("All")
                        }
                      />
                    )}

                    {dateFilter !== "All" && (
                      <FilterTag
                        label={
                          dateFilters.find(
                            (item) =>
                              item.value === dateFilter
                          )?.label ?? dateFilter
                        }
                        onRemove={() =>
                          setDateFilter("All")
                        }
                      />
                    )}

                    {priceFilter !== "All" && (
                      <FilterTag
                        label={
                          priceFilters.find(
                            (item) =>
                              item.value === priceFilter
                          )?.label ?? priceFilter
                        }
                        onRemove={() =>
                          setPriceFilter("All")
                        }
                      />
                    )}

                    {sort !== "soonest" && (
                      <FilterTag
                        label={
                          sortOptions.find(
                            (item) =>
                              item.value === sort
                          )?.label ?? sort
                        }
                        onRemove={() =>
                          setSort("soonest")
                        }
                      />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="self-start text-xs font-bold text-accent transition-colors hover:text-foreground sm:self-auto"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="mb-6 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent sm:text-[11px]">
                Discover
              </p>

              <h2 className="mt-1.5 text-xl font-bold tracking-tight sm:mt-2 sm:text-3xl md:text-4xl">
                {category !== "All"
                  ? `${category} Events`
                  : "Upcoming Events"}
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-5 text-foreground-muted sm:text-sm sm:leading-6">
                {category !== "All"
                  ? `Explore upcoming ${category.toLowerCase()} events and find something worth attending.`
                  : "Explore experiences happening soon and find something worth attending."}
              </p>
            </div>

            {!loading && !fetchError && (
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-[11px] text-foreground-muted sm:text-sm">
                  {events.length}{" "}
                  {events.length === 1
                    ? "event"
                    : "events"}
                </span>

                {hasActiveFilters && (
                  <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[9px] font-semibold text-accent sm:px-3 sm:py-1.5 sm:text-xs">
                    Filtered
                  </span>
                )}
              </div>
            )}
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <div className="aspect-[16/9] animate-pulse bg-background-secondary sm:aspect-[16/10]" />

                    <div className="space-y-3.5 p-3.5 sm:space-y-4 sm:p-6">
                      <div className="h-3 w-20 animate-pulse rounded bg-border" />

                      <div className="h-5 w-4/5 animate-pulse rounded bg-border" />

                      <div className="h-3 w-full animate-pulse rounded bg-border" />

                      <div className="h-3 w-2/3 animate-pulse rounded bg-border" />

                      <div className="border-t border-border pt-3.5 sm:pt-4">
                        <div className="h-3 w-1/2 animate-pulse rounded bg-border" />

                        <div className="mt-3 h-3 w-2/5 animate-pulse rounded bg-border" />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="h-5 w-20 animate-pulse rounded bg-border" />

                        <div className="h-4 w-24 animate-pulse rounded bg-border" />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : fetchError ? (
            <div className="rounded-2xl border border-danger/30 bg-card px-5 py-12 text-center sm:px-8 sm:py-20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-danger/20 bg-danger/10 text-danger">
                <span className="text-xl font-bold">
                  !
                </span>
              </div>

              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-danger sm:mt-6 sm:text-[11px]">
                Something went wrong
              </p>

              <h3 className="mt-2 text-lg font-bold sm:text-2xl">
                We couldn't load the events
              </h3>

              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-foreground-secondary sm:text-sm sm:leading-7">
                {fetchError}
              </p>

              <button
                type="button"
                onClick={retryEvents}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-accent-hover sm:mt-7 sm:w-auto"
              >
                Try Again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card px-5 py-12 text-center sm:px-8 sm:py-20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border-hover bg-background-secondary text-accent">
                <SearchIcon className="h-6 w-6" />
              </div>

              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-accent sm:mt-6 sm:text-[11px]">
                No results
              </p>

              <h3 className="mt-2 text-lg font-bold sm:text-2xl">
                No events found
              </h3>

              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-foreground-secondary sm:text-sm sm:leading-7">
                We couldn't find any events matching
                your current search and filters. Try
                changing your criteria or clearing the
                filters.
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-accent-hover sm:mt-7 sm:w-auto"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                />
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
  const [imageError, setImageError] =
    useState(false);

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
      {/* EVENT IMAGE */}
      <div className="relative aspect-[16/9] overflow-hidden bg-background-secondary sm:aspect-[16/10]">
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
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-sm font-bold text-accent sm:h-12 sm:w-12 sm:text-lg">
                E
              </div>

              <p className="mt-2.5 text-[11px] font-medium text-foreground-muted sm:mt-3 sm:text-xs">
                Eventora
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

        {/* DATE */}
        <div className="absolute left-3 top-3 overflow-hidden rounded-lg border border-white/15 bg-black/70 text-center backdrop-blur-md sm:left-4 sm:top-4 sm:rounded-xl">
          <div className="min-w-[45px] px-2 py-1.5 sm:min-w-[52px] sm:px-2.5 sm:py-2">
            <p className="text-sm font-bold leading-none text-white sm:text-lg">
              {dateParts.day}
            </p>

            <p className="mt-1 text-[7px] font-bold uppercase tracking-wider text-accent sm:text-[9px]">
              {dateParts.month}
            </p>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="absolute right-3 top-3 max-w-[58%] sm:right-4 sm:top-4">
          <span className="inline-flex max-w-full truncate rounded-lg border border-white/10 bg-black/65 px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[10px]">
            {event.category}
          </span>
        </div>

        {/* PRICE */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
          <span className="rounded-lg border border-white/10 bg-black/70 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-md sm:px-3 sm:text-xs">
            {event.price === 0
              ? "FREE"
              : `KES ${event.price.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* EVENT CONTENT */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-6">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-tight tracking-tight transition-colors group-hover:text-accent sm:text-xl">
          {event.title}
        </h3>

        <p className="mt-2.5 line-clamp-2 text-[11px] leading-5 text-foreground-secondary sm:mt-3 sm:text-sm sm:leading-6">
          {event.description}
        </p>

        {/* EVENT META */}
        <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          <EventMeta
            icon={<LocationIcon />}
            label="Location"
            value={event.location}
            truncate
          />

          <div className="grid grid-cols-1 gap-2.5 xs:grid-cols-2 sm:gap-3">
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

        {/* CARD ACTION */}
        <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-3.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
          <div className="min-w-0">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-foreground-muted sm:text-[10px]">
              Admission
            </p>

            <p className="mt-1 truncate text-xs font-bold text-foreground sm:text-sm">
              {event.price === 0
                ? "Free entry"
                : `KES ${event.price.toLocaleString()}`}
            </p>
          </div>

          <span className="inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-lg border border-border bg-background-secondary px-3 py-2 text-[11px] font-bold text-accent transition-all group-hover:border-accent/30 group-hover:bg-accent group-hover:text-white sm:w-auto sm:text-sm">
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
    <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-foreground-muted sm:text-[10px]">
          {label}
        </p>

        <p
          className={`mt-0.5 text-[11px] font-medium text-foreground-secondary sm:text-sm ${
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
      <h3 className="mb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-foreground-muted sm:text-[11px]">
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
      <div className="flex w-max min-w-full gap-1.5 sm:gap-2">
        {items.map((item) => {
          const active = activeValue === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              aria-pressed={active}
              className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] font-semibold transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${
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
    <div className="min-w-0">
      <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-wider text-foreground-muted sm:mb-2 sm:text-[10px]">
        {title}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-11 w-full appearance-none rounded-xl border border-border bg-card px-3 pr-10 text-xs font-semibold text-foreground outline-none transition-all hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/10 sm:px-4 sm:text-sm"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
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
      className="inline-flex max-w-full items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-accent transition-colors hover:border-accent/40 hover:bg-accent/15 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
    >
      <span className="max-w-[140px] truncate sm:max-w-[180px]">
        {label}
      </span>

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