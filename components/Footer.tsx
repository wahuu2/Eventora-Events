import Link from "next/link";

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

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        {/* =========================================================
            MAIN FOOTER
        ========================================================== */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.8fr_1.5fr] lg:gap-16">
          {/* =======================================================
              BRAND + CONTACT
          ======================================================== */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
              aria-label="Eventora home"
            >
              <div className="flex h-11 w-[35px] shrink-0 items-center justify-center overflow-hidden rounded-xl transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/og-eventora.png"
                  alt="Eventora"
                  width={25}
                  height={16}
                  className="h-4 w-[25px] object-contain"
                />
              </div>

              <div>
                <span className="block text-xl font-bold tracking-tight text-foreground">
                  Eventora
                </span>

                <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-foreground-muted">
                  Events made simple
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-foreground-secondary">
              Discover events, book experiences, manage your tickets, and
              connect with opportunities worth experiencing.
            </p>

            {/* Contact */}
            <div className="mt-7 space-y-3.5 text-sm">
              {/* Email */}
              <a
                href="mailto:support@eventora.co.ke"
                className="group flex items-center gap-3 text-foreground-secondary transition-colors hover:text-accent"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-xs transition-colors group-hover:border-accent/30 group-hover:bg-accent/10">
                  @
                </span>

                <span className="truncate">support@eventora.co.ke</span>
              </a>

              {/* Phone */}
              <a
                href="tel:+254712345678"
                className="group flex items-center gap-3 text-foreground-secondary transition-colors hover:text-accent"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-xs transition-colors group-hover:border-accent/30 group-hover:bg-accent/10">
                  ☎
                </span>

                <span>+254 712345678</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/2547406696404"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-foreground-secondary transition-colors hover:text-accent"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-xs font-semibold transition-colors group-hover:border-accent/30 group-hover:bg-accent/10">
                  W
                </span>

                <span>WhatsApp</span>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3 text-foreground-secondary">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-xs">
                  ⌖
                </span>

                <span className="leading-6">
                  Nairobi, Kenya
                  <br />
                  Serving events across Kenya
                </span>
              </div>
            </div>
          </div>

          {/* =======================================================
              INFORMATION + PLATFORM
          ======================================================== */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-1 lg:gap-9">
            {/* Information */}
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Information
              </h3>

              <div className="mt-4 space-y-3.5 text-sm">
                <Link
                  href="/"
                  className="block text-foreground-secondary transition-colors hover:text-accent"
                >
                  About Eventora
                </Link>

                <Link
                  href="/events"
                  className="block text-foreground-secondary transition-colors hover:text-accent"
                >
                  Browse Events
                </Link>

                <Link
                  href="/sign-up"
                  className="block text-foreground-secondary transition-colors hover:text-accent"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Platform
              </h3>

              <div className="mt-4 space-y-3.5 text-sm">
                <p className="text-foreground-secondary">
                  Event discovery
                </p>

                <p className="text-foreground-secondary">
                  Online booking
                </p>

                <p className="text-foreground-secondary">
                  Digital tickets
                </p>

                <p className="text-foreground-secondary">
                  Organizer tools
                </p>
              </div>
            </div>
          </div>

          {/* =======================================================
              CATEGORIES
          ======================================================== */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Explore Categories
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-foreground-muted">
                  Find events based on what interests you.
                </p>
              </div>

              <Link
                href="/events"
                className="shrink-0 text-xs font-semibold text-accent transition-colors hover:text-foreground"
              >
                View all →
              </Link>
            </div>

            {/* Category Grid */}
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/events?category=${encodeURIComponent(category)}`}
                  className="group flex min-h-[42px] items-center rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-medium leading-5 text-foreground-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-foreground"
                >
                  <span className="min-w-0 truncate">{category}</span>

                  <span className="ml-auto hidden shrink-0 text-accent opacity-0 transition-all duration-200 group-hover:block group-hover:translate-x-0.5 group-hover:opacity-100 sm:inline">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM FOOTER
        ========================================================== */}
        <div className="mt-12 flex flex-col gap-5 border-t border-border pt-7 text-xs text-foreground-muted sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Eventora. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>

            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Terms & Conditions
            </Link>

            <span className="hidden h-3 w-px bg-border sm:block" />

            <span className="text-foreground-muted">
              Discover. Connect. Experience.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}