"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  Bars3Icon,
  CalendarDaysIcon,
  HomeIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex h-[60px] w-full max-w-7xl items-center justify-between px-4 sm:h-[68px] sm:px-6 lg:px-8">

        {/* BRAND */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-2"
          aria-label="Eventora home"
        >
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
            <img
              src="/og-eventora.png"
              alt="Eventora"
              width={25}
              height={16}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-1 md:flex">

            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium text-foreground-secondary transition-all duration-200 hover:bg-card-hover hover:text-foreground"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              Explore Events
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium text-foreground-secondary transition-all duration-200 hover:bg-card-hover hover:text-foreground"
            >
              <PlusCircleIcon className="h-4 w-4" />
              For Organizers
            </Link>

            <Link
              href="/sign-in"
              className="ml-1 inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-semibold text-foreground-secondary transition-colors hover:bg-card-hover hover:text-foreground"
            >
              Sign In
            </Link>
          </div>

          {/* DESKTOP DIVIDER */}
          <div className="mx-1 hidden h-7 w-px bg-border md:block" />

          {/* THEME TOGGLE */}
          <ThemeToggle />

          {/* USER */}
          <div className="ml-1 border-l border-border pl-2 sm:ml-2 sm:pl-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 sm:h-9 sm:w-9",
                },
              }}
            />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground-secondary transition-all hover:border-border-hover hover:bg-card-hover hover:text-foreground md:hidden"
          >
            {menuOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">

            <div className="grid grid-cols-2 gap-2">

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-all hover:border-border-hover hover:bg-card-hover hover:text-foreground"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>

              <Link
                href="/events"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/10 transition-all hover:bg-accent-hover"
              >
                <CalendarDaysIcon className="h-4 w-4" />
                Explore
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-all hover:border-border-hover hover:bg-card-hover hover:text-foreground"
              >
                Dashboard
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-all hover:border-border-hover hover:bg-card-hover hover:text-foreground"
              >
                <PlusCircleIcon className="h-4 w-4" />
                Organizer
              </Link>

              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="col-span-2 flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-all hover:border-border-hover hover:bg-card-hover hover:text-foreground"
              >
                Sign In
              </Link>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}