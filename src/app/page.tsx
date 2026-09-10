import Link from "next/link";
import { redirect } from "next/navigation";

import FeaturedEvents from "@/components/FeaturedEvents";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

const categories = [
  {
    number: "01",
    title: "Music",
    description: "Concerts, live shows & nightlife",
    icon: "♫",
  },
  {
    number: "02",
    title: "Sports",
    description: "Games, tournaments & fitness",
    icon: "◈",
  },
  {
    number: "03",
    title: "Conferences",
    description: "Business, tech & networking",
    icon: "▦",
  },
  {
    number: "04",
    title: "Festivals",
    description: "Culture, food & entertainment",
    icon: "✦",
  },
  {
    number: "05",
    title: "Business",
    description: "Workshops, expos & meetups",
    icon: "◇",
  },
  {
    number: "06",
    title: "Lifestyle",
    description: "Experiences, wellness & more",
    icon: "○",
  },
];

const journey = [
  {
    number: "01",
    title: "Discover",
    description: "Find events that match your interests.",
  },
  {
    number: "02",
    title: "Book",
    description: "Reserve your place quickly and securely.",
  },
  {
    number: "03",
    title: "Experience",
    description: "Access your digital ticket and enjoy the event.",
  },
];

const features = [
  {
    number: "01",
    title: "Event Discovery",
    description:
      "Search and filter events by category, location, date, and price to find experiences that match what you are looking for.",
  },
  {
    number: "02",
    title: "Simple Booking",
    description:
      "Reserve your place through a clear and straightforward booking experience designed to keep everything simple.",
  },
  {
    number: "03",
    title: "Digital Tickets",
    description:
      "Access your unique digital ticket from your dashboard and keep your event information available whenever you need it.",
  },
  {
    number: "04",
    title: "Organizer Tools",
    description:
      "Create events, manage bookings, monitor attendees, and understand event performance from one centralized dashboard.",
  },
];

const organizerSteps = [
  ["STEP 01", "Create your account", "Join Eventora"],
  ["STEP 02", "Request organizer access", "Submit your request"],
  ["STEP 03", "Get approved & start creating", "Organizer dashboard access"],
];

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    switch (user.role) {
      case "admin":
        redirect("/admin");
      case "organizer":
        redirect("/dashboard/organizer");
      case "user":
        redirect("/dashboard");
      default:
        break;
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-200">
      {/* FIXED NAVBAR */}
      <div className="fixed inset-x-0 top-0 z-[100]">
        <Navbar />
      </div>

      {/* NAVBAR SPACER */}
      <div className="h-[72px] sm:h-[80px]" />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-background">
        <div className="relative min-h-[calc(100svh-72px)] overflow-hidden sm:min-h-[700px] lg:min-h-[760px]">
          <img
            src="/banner.jpeg"
            alt="Eventora event experience"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/15" />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/45 via-transparent to-purple-950/45" />

          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-7xl items-center px-4 py-12 sm:min-h-[700px] sm:px-6 sm:py-16 lg:min-h-[760px] lg:px-8 lg:py-20">
            <div className="mx-auto w-full max-w-5xl text-center">
              <div className="mx-auto mb-5 inline-flex max-w-[calc(100%-1rem)] items-center justify-center gap-2 rounded-full border border-foreground/20 bg-foreground/10 px-3 py-2 text-[10px] font-semibold tracking-wide text-foreground-secondary shadow-xl backdrop-blur-md sm:mb-7 sm:px-4 sm:text-xs">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-accent" />
                </span>

                <span>One platform. Every event experience.</span>
              </div>

              <h1 className="mx-auto max-w-5xl text-[3.25rem] font-black leading-[0.92] tracking-[-0.055em] text-foreground xs:text-[3.6rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem]">
                Discover.
                <br />
                <span className="text-accent">Connect.</span>
                <br />
                Experience.
              </h1>

              <p className="mx-auto mt-5 max-w-2xl px-2 text-sm leading-6 text-foreground-secondary sm:mt-7 sm:px-0 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                Discover events happening around Kenya, book your spot,
                and access your digital ticket — all in one place.
              </p>

              {/* SEARCH BAR */}
              <div className="mx-auto mt-6 w-full max-w-3xl sm:mt-8">
                <div className="flex flex-col gap-2 rounded-2xl border border-foreground/20 bg-background/40 p-2 shadow-2xl backdrop-blur-xl sm:flex-row">
                  <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl bg-foreground/[0.08] px-4 text-left">
                    <span className="shrink-0 text-lg text-foreground-muted">
                      ⌕
                    </span>

                    <p className="truncate text-xs text-foreground-secondary sm:text-sm">
                      Search events, artists or venues
                    </p>
                  </div>

                  <Link
                    href="/events"
                    className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 sm:w-auto sm:px-7"
                  >
                    Search Events
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>

              {/* TRUST POINTS */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 text-[10px] text-foreground-muted sm:mt-6 sm:gap-x-6 sm:text-xs">
                <span>✓ Digital tickets</span>
                <span>✓ Secure booking</span>
                <span>✓ Kenyan events</span>
              </div>
            </div>
          </div>
        </div>

        {/* JOURNEY */}
        <div className="relative z-20 mx-auto -mt-6 max-w-6xl px-4 sm:-mt-8 sm:px-6 lg:-mt-10 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card/90 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {journey.map((item, index) => (
                <div
                  key={item.number}
                  className={`relative px-5 py-6 sm:px-6 sm:py-7 ${
                    index !== 0
                      ? "border-t border-border sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-xs font-black text-accent">
                      {item.number}
                    </span>

                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-foreground">
                        {item.title}
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-foreground-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-background-secondary via-background-tertiary to-background" />

        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-[30%] h-[32rem] w-[32rem] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">
          {/* CATEGORIES */}
          <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-28">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent sm:text-xs">
                  Explore by category
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  Find something worth experiencing.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-foreground-secondary sm:text-base">
                  Explore different types of events and discover what is
                  happening around Kenya.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex w-fit items-center text-sm font-bold text-accent transition-colors hover:text-foreground"
              >
                View all events
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <Link
                  key={category.number}
                  href={`/events?category=${encodeURIComponent(
                    category.title
                  )}`}
                  className="group rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-card-hover sm:p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-base text-accent transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 sm:text-lg">
                    {category.icon}
                  </div>

                  <p className="mt-4 text-sm font-bold text-foreground sm:mt-5">
                    {category.title}
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5 text-foreground-muted sm:text-[11px]">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* FEATURED EVENTS */}
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent sm:text-xs">
                  Featured events
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  What&apos;s happening?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-foreground-secondary sm:text-base">
                  Discover events you can book through Eventora.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex w-fit items-center text-sm font-bold text-accent transition-colors hover:text-foreground"
              >
                Browse all events
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="mt-8 sm:mt-10">
              <FeaturedEvents />
            </div>
          </section>

          {/* WHY EVENTORA */}
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28">
            <div className="border-t border-border pt-16 sm:pt-20 lg:pt-28">
              <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-14">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent sm:text-xs">
                    Why Eventora
                  </p>

                  <h2 className="mt-4 max-w-xl text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
                    Everything you need for the event experience.
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-foreground-secondary sm:text-base">
                    From discovering an event to receiving your ticket,
                    Eventora keeps the entire experience simple and organized.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {features.map((feature) => (
                    <article
                      key={feature.number}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-card-hover sm:p-7"
                    >
                      <div className="absolute left-0 top-0 h-full w-0.5 bg-accent/0 transition-all duration-300 group-hover:bg-accent" />

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-[10px] font-black text-accent sm:h-10 sm:w-10 sm:text-xs">
                        {feature.number}
                      </div>

                      <h3 className="mt-4 text-base font-bold text-foreground sm:mt-5 sm:text-lg">
                        {feature.title}
                      </h3>

                      <p className="mt-3 text-xs leading-6 text-foreground-secondary sm:text-sm">
                        {feature.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ORGANIZER */}
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28">
            <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-background-secondary via-background-tertiary to-background-secondary shadow-2xl backdrop-blur-xl">
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 sm:p-10 lg:p-12">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-7 bg-accent sm:w-8" />

                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent sm:text-xs">
                      For organizers
                    </p>
                  </div>

                  <h2 className="mt-5 max-w-2xl text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    Turn your events into experiences people remember.
                  </h2>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-foreground-secondary sm:text-base">
                    Create your account, request organizer access, and wait
                    for administrator approval. Once approved, you can create
                    events, manage bookings, monitor attendees, and track
                    performance from your organizer dashboard.
                  </p>

                  <div className="mt-7 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:items-center">
                    <Link
                      href="/sign-up"
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background sm:w-auto"
                    >
                      Become an Organizer
                      <span className="ml-2">→</span>
                    </Link>

                    <p className="text-xs leading-5 text-foreground-muted">
                      Organizer access requires administrator approval.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border bg-background/30 p-5 sm:p-8 lg:border-l lg:border-t-0">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted sm:text-xs">
                    Getting started
                  </p>

                  <div className="space-y-3">
                    {organizerSteps.map(([step, title, subtitle], index) => (
                      <div
                        key={step}
                        className="rounded-2xl border border-border bg-card/70 p-4 transition-all duration-200 hover:border-accent/30 hover:bg-card-hover sm:p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-[10px] font-black text-accent">
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-foreground-muted sm:text-[10px]">
                              {step}
                            </p>

                            <p className="mt-1.5 text-sm font-bold text-foreground">
                              {title}
                            </p>

                            <p className="mt-1 text-xs text-foreground-muted">
                              {subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-background-secondary via-background-tertiary to-background-secondary p-6 text-foreground shadow-2xl sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-7 bg-accent sm:w-8" />

                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                      Your next experience starts here
                    </p>
                  </div>

                  <h2 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
                    Find your next event.
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-foreground-secondary sm:text-base">
                    Browse events, book your spot, pay securely, and keep your
                    digital ticket ready for the day.
                  </p>
                </div>

                <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
                  <Link
                    href="/events"
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-7 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background sm:w-auto"
                  >
                    Explore Events
                    <span className="ml-2">→</span>
                  </Link>

                  <Link
                    href="/sign-up"
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-border-hover bg-foreground/10 px-7 text-sm font-bold text-foreground backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-foreground/15 focus:outline-none focus:ring-2 focus:ring-foreground/30 sm:w-auto"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}