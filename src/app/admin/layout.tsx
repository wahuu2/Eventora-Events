import { redirect } from "next/navigation";
import Link from "next/link";
import AdminTopBar from "./AdminTopBar";

import { requireAdmin } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

import {
  Squares2X2Icon,
  UsersIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  TicketIcon,
  CreditCardIcon,
  BellIcon,
  ChartBarIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const adminNavigation = [
  {
    label: "Overview",
    href: "/admin",
    description: "System overview",
    icon: <Squares2X2Icon className="h-5 w-5" />,
  },
  {
    label: "Users",
    href: "/admin/users",
    description: "Platform accounts",
    icon: <UsersIcon className="h-5 w-5" />,
  },
  {
    label: "Organizers",
    href: "/admin/organizers",
    description: "Event creators",
    icon: <UserGroupIcon className="h-5 w-5" />,
  },
  {
    label: "Events",
    href: "/admin/events",
    description: "Platform events",
    icon: <CalendarDaysIcon className="h-5 w-5" />,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    description: "Booking activity",
    icon: <TicketIcon className="h-5 w-5" />,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    description: "Transactions",
    icon: <CreditCardIcon className="h-5 w-5" />,
  },
  {
    label: "Tickets",
    href: "/admin/tickets",
    description: "Digital tickets",
    icon: <TicketIcon className="h-5 w-5" />,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    description: "System activity",
    icon: <BellIcon className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    description: "Platform insights",
    icon: <ChartBarIcon className="h-5 w-5" />,
  },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await requireAdmin();

  if (!result.authorized) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===================================================== */}
      {/* DESKTOP SIDEBAR */}
      {/* ===================================================== */}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-border bg-background-secondary lg:flex lg:flex-col">
        {/* Brand */}
        <div className="border-b border-border px-6 py-6">
          <Link
            href="/admin"
            className="group flex items-center gap-3"
            aria-label="Eventora admin home"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-transform duration-200 group-hover:scale-105">
              <img
                src="/og-eventora.png"
                alt="Eventora"
                width={28}
                height={18}
                className="h-[18px] w-7 object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="text-lg font-black tracking-tight">
                Eventora
              </p>

              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Control Center
              </p>
            </div>
          </Link>
        </div>

        {/* Administrator Identity */}
        <div className="px-5 py-5">
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-bold text-accent">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Administrator
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />

                  <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                    System Access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted">
            Platform
          </p>

          <nav className="space-y-1">
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-200 hover:border-border hover:bg-background"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background-secondary text-foreground-muted transition-all duration-200 group-hover:border-accent/30 group-hover:bg-accent/10 group-hover:text-accent">
                  {item.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {item.label}
                  </span>

                  <span className="mt-0.5 block truncate text-[10px] text-foreground-muted">
                    {item.description}
                  </span>
                </span>

                <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-foreground-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-4">
          <Link
            href="/dashboard"
            className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-all duration-200 hover:border-border-hover hover:bg-background-secondary"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">
                Return to Eventora
              </p>

              <p className="mt-1 truncate text-[10px] text-foreground-muted">
                User dashboard
              </p>
            </div>

            <ArrowLeftIcon className="h-4 w-4 shrink-0 text-foreground-muted transition-all group-hover:-translate-x-1 group-hover:text-foreground" />
          </Link>
        </div>
      </aside>

      {/* ===================================================== */}
      {/* MAIN ADMIN AREA */}
      {/* ===================================================== */}

      <div className="lg:pl-72">
        {/* ================================================= */}
        {/* TOP BAR */}
        {/* ================================================= */}

        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="container-responsive">
            <div className="flex min-h-16 items-center gap-3">
              {/* Mobile Brand */}
              <Link
                href="/admin"
                className="flex min-w-0 items-center gap-2.5 lg:hidden"
                aria-label="Eventora admin home"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src="/og-eventora.png"
                    alt="Eventora"
                    width={25}
                    height={16}
                    className="h-4 w-[25px] object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black">
                    Eventora
                  </p>

                  <p className="text-[9px] font-bold uppercase tracking-wider text-accent">
                    Admin
                  </p>
                </div>
              </Link>

              {/* Desktop Context */}
              <div className="hidden items-center gap-3 lg:flex">
                <span className="text-xs font-medium text-foreground-muted">
                  Eventora
                </span>

                <span className="text-foreground-muted">
                  /
                </span>

                <span className="text-xs font-semibold">
                  Administration
                </span>
              </div>

              {/* Right Side */}
              <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                {/* Admin Status */}
                <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                    Admin Mode
                  </span>
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications + User */}
                <AdminTopBar />
                
              </div>
            </div>
          </div>
        </header>

        {/* ================================================= */}
        {/* MOBILE NAVIGATION */}
        {/* ================================================= */}

        <div className="border-b border-border bg-background-secondary lg:hidden">
          <div className="container-responsive">
            <nav
              className="flex gap-2 overflow-x-auto py-3"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {adminNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:border-accent/30 hover:bg-card"
                >
                  <span className="text-accent transition-transform duration-200 group-hover:scale-105">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ================================================= */}
        {/* ADMIN CONTENT */}
        {/* ================================================= */}

        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}