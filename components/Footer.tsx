import Link from "next/link";

const categories = [
  "Nightlife & Parties",
  "Fashion & Pageants",
  "Education",
  "Concerts & Live Music",
  "Comedy",
  "Arts & Crafts",
  "Community",
  "Charity",
  "Family",
  "Sports & Gaming",
  "Food & Drink",
  "Networking & Conferences",
  "Religion & Spirituality",
  "Film, Theatre & Performing Arts",
  "Travel & Outdoors",
  "Health & Wellness",
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b1026] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.7fr_1.8fr]">
          {/* Brand + Contact */}
<div>
  <Link
    href="/"
    className="group inline-flex items-center gap-3"
    aria-label="Eventora home"
  >
    <div className="flex h-11 w-[35px] shrink-0 items-center justify-center overflow-hidden rounded-xl transition-transform duration-200 group-hover:scale-105">
      <img
        src="/og-eventora.png"
        alt="E"
        width={25}
        height={4}
        className="h-4 w-[25px] object-contain"
      />
    </div>

    <div>
      <span className="block text-xl font-bold tracking-tight text-white">
        Eventora
      </span>

      <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
        Events made simple
      </span>
    </div>
  </Link>

  <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
    Discover events, book experiences, manage your tickets, and
    connect with opportunities worth experiencing.
  </p>

  {/* Contact */}
  <div className="mt-7 space-y-3 text-sm">
    <a
      href="mailto:support@eventora.co.ke"
      className="flex items-center gap-3 text-white/55 transition-colors hover:text-accent"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-xs">
        @
      </span>

      support@eventora.co.ke
    </a>

    <a
      href="tel:+254741492515"
      className="flex items-center gap-3 text-white/55 transition-colors hover:text-accent"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-xs">
        ☎
      </span>

      +254 741 492 515
    </a>

    <a
      href="https://wa.me/254741492515"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-white/55 transition-colors hover:text-accent"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-xs">
        W
      </span>

      WhatsApp
    </a>

    <div className="flex items-start gap-3 text-white/55">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-xs">
        ⌖
      </span>

      <span>
        Nairobi, Kenya
        <br />
        Serving events across Kenya
      </span>
    </div>
  </div>

  {/* Socials */}
  <div className="mt-7 flex items-center gap-2">
    <a
      href="#"
      aria-label="Eventora Instagram"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-xs font-bold text-white/60 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
    >
      IG
    </a>

    <a
      href="#"
      aria-label="Eventora X"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-xs font-bold text-white/60 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
    >
      X
    </a>

    <a
      href="#"
      aria-label="Eventora Facebook"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-xs font-bold text-white/60 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
    >
      f
    </a>

    <a
      href="#"
      aria-label="Eventora TikTok"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-xs font-bold text-white/60 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
    >
      TT
    </a>

    <a
      href="#"
      aria-label="Eventora YouTube"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-xs font-bold text-white/60 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
    >
      YT
    </a>
  </div>
</div>

          {/* Information + Explore */}
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-1">
            <div>
              <h3 className="text-sm font-bold text-white">
                Information
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <Link
                  href="/"
                  className="block text-white/50 transition-colors hover:text-accent"
                >
                  About Eventora
                </Link>

                <Link
                  href="/events"
                  className="block text-white/50 transition-colors hover:text-accent"
                >
                  Browse Events
                </Link>

                <Link
                  href="/sign-up"
                  className="block text-white/50 transition-colors hover:text-accent"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                Platform
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <p className="text-white/50">Event discovery</p>
                <p className="text-white/50">Online booking</p>
                <p className="text-white/50">M-Pesa payments</p>
                <p className="text-white/50">Digital tickets</p>
                <p className="text-white/50">Organizer tools</p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Categories
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  href="/events"
                  className="text-xs leading-5 text-white/45 transition-colors hover:text-accent"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Eventora. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Terms & Conditions
            </Link>

            <span className="text-white/25">
              Discover. Connect. Experience.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}