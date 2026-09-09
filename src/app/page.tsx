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
      <Navbar />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-background">
        <div className="relative h-[650px] overflow-hidden sm:h-[700px] lg:h-[760px]">
          <img
            src="/banner.jpeg"
            alt="Eventora event experience"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-transparent to-purple-950/40" />

          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pb-16 pt-16 lg:px-8">
            <div className="w-full text-center">
              <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/10 px-4 py-2 text-xs font-semibold tracking-wide text-foreground-secondary shadow-xl backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-accent" />
                </span>

                One platform. Every event experience.
              </div>

              <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
                Discover.
                <br />
                <span className="text-accent">Connect.</span>
                <br />
                Experience.
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-foreground-secondary sm:text-lg sm:leading-8">
                Discover events happening around Kenya, book your spot,
                and access your digital ticket — all in one place.
              </p>

              <div className="mx-auto mt-8 max-w-3xl">
                <div className="flex flex-col gap-2 rounded-2xl border border-foreground/20 bg-background/35 p-2 shadow-2xl backdrop-blur-xl sm:flex-row">
                  <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-foreground/[0.08] px-4 text-left">
                    <span className="text-lg text-foreground-muted">⌕</span>

                    <p className="text-sm text-foreground-secondary">
                      Search events, artists or venues
                    </p>
                  </div>

                  <Link
                    href="/events"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-7 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30"
                  >
                    Search Events
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-foreground-muted">
                <span>✓ Digital tickets</span>
                <span>✓ Secure booking</span>
                <span>✓ Kenyan events</span>
              </div>
            </div>
          </div>
        </div>

        {/* JOURNEY */}
        <div className="relative z-20 mx-auto -mt-1 max-w-6xl px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {journey.map((item, index) => (
                <div
                  key={item.number}
                  className={`relative px-6 py-7 ${
                    index !== 0
                      ? "border-t border-border sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-xs font-black text-accent">
                      {item.number}
                    </span>

                    <div>
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
          <section className="mx-auto max-w-7xl px-6 pt-20 lg:px-8 lg:pt-28">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  Explore by category
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                  Find something worth experiencing.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-foreground-secondary sm:text-base">
                  Explore different types of events and discover what is
                  happening around Kenya.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex items-center text-sm font-bold text-accent transition-colors hover:text-foreground"
              >
                View all events
                <span className="ml-2">→</span>
              </Link>
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
          </section>

          {/* FEATURED EVENTS */}
          <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  Featured events
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                  What&apos;s happening?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-foreground-secondary sm:text-base">
                  Discover events you can book through Eventora.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex items-center text-sm font-bold text-accent transition-colors hover:text-foreground"
              >
                Browse all events
                <span className="ml-2">→</span>
              </Link>
            </div>

            <FeaturedEvents />
          </section>

          {/* WHY EVENTORA */}
          <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
            <div className="border-t border-border pt-20 lg:pt-28">
              <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                    Why Eventora
                  </p>

                  <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    Everything you need for the event experience.
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-foreground-secondary sm:text-base">
                    From discovering an event to receiving your ticket,
                    Eventora keeps the entire experience simple and organized.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => (
                    <article
                      key={feature.number}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-card-hover"
                    >
                      <div className="absolute left-0 top-0 h-full w-0.5 bg-accent/0 transition-all duration-300 group-hover:bg-accent" />

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-xs font-black text-accent">
                        {feature.number}
                      </div>

                      <h3 className="mt-5 text-lg font-bold text-foreground">
                        {feature.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-foreground-secondary">
                        {feature.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ORGANIZER */}
          <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
            <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-background-secondary via-background-tertiary to-background-secondary shadow-2xl backdrop-blur-xl">
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-7 sm:p-10 lg:p-12">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-accent" />

                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                      For organizers
                    </p>
                  </div>

                  <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                    Turn your events into experiences people remember.
                  </h2>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-foreground-secondary sm:text-base">
                    Create your account, request organizer access, and wait
                    for administrator approval. Once approved, you can create
                    events, manage bookings, monitor attendees, and track
                    performance from your organizer dashboard.
                  </p>

                  <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <Link
                      href="/sign-up"
                      className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                    >
                      Become an Organizer
                      <span className="ml-2">→</span>
                    </Link>

                    <p className="text-xs text-foreground-muted">
                      Organizer access requires administrator approval.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border bg-background/30 p-6 sm:p-8 lg:border-l lg:border-t-0">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground-muted">
                    Getting started
                  </p>

                  <div className="space-y-3">
                    {organizerSteps.map(([step, title, subtitle], index) => (
                      <div
                        key={step}
                        className="rounded-2xl border border-border bg-card/70 p-5 transition-all duration-200 hover:border-accent/30 hover:bg-card-hover"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-[10px] font-black text-accent">
                            {index + 1}
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
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
          <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-background-secondary via-background-tertiary to-background-secondary p-7 text-foreground shadow-2xl sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-accent" />

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                      Your next experience starts here
                    </p>
                  </div>

                  <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    Find your next event.
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-foreground-secondary sm:text-base">
                    Browse events, book your spot, pay securely, and keep your
                    digital ticket ready for the day.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Link
                    href="/events"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-7 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                  >
                    Explore Events
                    <span className="ml-2">→</span>
                  </Link>

                  <Link
                    href="/sign-up"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-hover bg-foreground/10 px-7 text-sm font-bold text-foreground backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-foreground/15 focus:outline-none focus:ring-2 focus:ring-foreground/30"
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