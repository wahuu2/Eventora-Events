import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Bars3Icon,
  CalendarDaysIcon,
  ChevronDownIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b1026]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">

        {/* BRAND */}
<Link
  href="/"
  className="group flex shrink-0 items-center gap-2.5"
  aria-label="Eventora home"
>
  <div className="flex h-10 w-[35px] items-center justify-center overflow-hidden rounded-xl transition-all duration-200 group-hover:scale-105">
    <img
      src="/og-eventora.png"
      alt="E"
      width={25}
      height={4}
      className="h-4 w-[25px] object-contain"
    />
  </div>

  <div className="hidden sm:block">
    <p className="text-lg font-bold tracking-tight text-white">
      Eventora
    </p>

    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/40">
      Events made simple
    </p>
  </div>
</Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 md:flex">

          {/* Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/65 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>

          {/* Explore */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/65 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            Explore Events
          </Link>

          {/* Categories */}
          <Link
            href="/events"
            className="inline-flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/65 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
          >
            Categories
            <ChevronDownIcon className="h-3.5 w-3.5" />
          </Link>

          {/* Organizer */}
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/65 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
          >
            <PlusCircleIcon className="h-4 w-4" />
            For Organizers
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="hidden rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white lg:inline-flex"
          >
            Dashboard
          </Link>

          {/* Sign In */}
          <Link
            href="/sign-in"
            className="hidden px-3 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:text-white sm:inline-flex"
          >
            Sign In
          </Link>

          {/* Get Started */}
          <Link
            href="/sign-up"
            className="hidden min-h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 sm:inline-flex"
          >
            Get Started
          </Link>

          {/* User */}
          <div className="ml-1 border-l border-white/10 pl-2 sm:ml-2 sm:pl-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 sm:h-10 sm:w-10",
                },
              }}
            />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:bg-white/[0.08] hover:text-white md:hidden"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <div className="border-t border-white/10 bg-[#0b1026]/95 md:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-5 py-3 sm:px-6">

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/events"
            className="flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/10"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            Explore
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/sign-up"
            className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            For Organizers
          </Link>
        </div>
      </div>
    </nav>
  );
}