import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Bars3Icon,
  CalendarDaysIcon,
  ChevronDownIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-xl transition-colors duration-200">
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
            <p className="text-lg font-bold tracking-tight text-foreground">
              Eventora
            </p>

            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-foreground-muted">
              Events made simple
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium text-foreground-secondary transition-all duration-200 hover:bg-card-hover hover:text-foreground"
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium text-foreground-secondary transition-all duration-200 hover:bg-card-hover hover:text-foreground"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            Explore Events
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm font-medium text-foreground-secondary transition-all duration-200 hover:bg-card-hover hover:text-foreground"
          >
            Categories
            <ChevronDownIcon className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium text-foreground-secondary transition-all duration-200 hover:bg-card-hover hover:text-foreground"
          >
            <PlusCircleIcon className="h-4 w-4" />
            For Organizers
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground-secondary transition-all duration-200 hover:border-border-hover hover:bg-card-hover hover:text-foreground lg:inline-flex"
          >
            Dashboard
          </Link>

          <Link
            href="/sign-in"
            className="hidden px-3 py-2.5 text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="hidden min-h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 sm:inline-flex"
          >
            Get Started
          </Link>

          {/* THEME TOGGLE */}
          <ThemeToggle />

          {/* USER */}
          <div className="ml-1 border-l border-border pl-2 sm:ml-2 sm:pl-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 sm:h-10 sm:w-10",
                },
              }}
            />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground-secondary transition-all hover:bg-card-hover hover:text-foreground md:hidden"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <div className="border-t border-border bg-background/95 transition-colors duration-200 md:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-5 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-card-hover hover:text-foreground"
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
            className="flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-card-hover hover:text-foreground"
          >
            Dashboard
          </Link>

          <Link
            href="/sign-up"
            className="flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-card-hover hover:text-foreground"
          >
            For Organizers
          </Link>
        </div>
      </div>
    </nav>
  );
}