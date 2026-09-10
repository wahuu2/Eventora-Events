import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import User from "@/database/user.model";

import {
  UsersIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default async function AdminUsersPage() {
  const result = await requireAdmin();

  if (!result.authorized) {
    return null;
  }

  const users = await User.find({})
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  const totalUsers = users.length;

  const admins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const organizers = users.filter(
    (user) => user.role === "organizer"
  ).length;

  const regularUsers = users.filter(
    (user) => user.role === "user"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* ===================================================== */}
      {/* PAGE HEADER */}
      {/* ===================================================== */}

      <section className="border-b border-border bg-background-secondary/30">
        <div className="container-responsive py-7 sm:py-9 lg:py-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            {/* Heading */}
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
                  <UsersIcon className="h-4 w-4" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                  Platform Management
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Users
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary">
                Monitor platform accounts, roles, and user
                activity from one central control panel.
              </p>
            </div>

            {/* Total Accounts */}
            <div className="w-full rounded-2xl border border-accent/20 bg-accent/10 p-4 sm:p-5 lg:w-auto lg:min-w-[220px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                    Total Accounts
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight">
                    {totalUsers.toLocaleString("en-KE")}
                  </p>

                  <p className="mt-1 text-xs text-foreground-muted">
                    Registered on Eventora
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background/30 text-accent">
                  <UsersIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* STAT CARDS */}
      {/* ===================================================== */}

      <section className="container-responsive py-5 sm:py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Users"
            value={totalUsers}
            description="All platform accounts"
            icon={<UsersIcon className="h-5 w-5" />}
            accent
          />

          <StatCard
            label="Regular Users"
            value={regularUsers}
            description="Event attendees"
            icon={
              <UserCircleIcon className="h-5 w-5" />
            }
          />

          <StatCard
            label="Organizers"
            value={organizers}
            description="Event creators"
            icon={
              <UserGroupIcon className="h-5 w-5" />
            }
          />

          <StatCard
            label="Administrators"
            value={admins}
            description="System access"
            icon={
              <ShieldCheckIcon className="h-5 w-5" />
            }
          />
        </div>
      </section>

      {/* ===================================================== */}
      {/* USERS TABLE */}
      {/* ===================================================== */}

      <section className="container-responsive pb-8 sm:pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Table Header */}
          <div className="flex flex-col gap-4 border-b border-border bg-background-secondary/40 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="min-w-0">
              <h2 className="text-base font-bold">
                All Platform Users
              </h2>

              <p className="mt-1 text-xs leading-5 text-foreground-muted">
                Latest accounts appear first.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />

              <span className="text-xs font-semibold text-foreground-secondary">
                {totalUsers.toLocaleString("en-KE")} accounts
              </span>
            </div>
          </div>

          {/* Empty State */}
          {users.length === 0 ? (
            <div className="px-5 py-16 text-center sm:px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <UsersIcon className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-sm font-bold">
                No users found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-foreground-muted">
                There are currently no registered platform
                users.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-left">
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      User
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Email
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Role
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const fullName =
                      `${user.firstName || ""} ${
                        user.lastName || ""
                      }`.trim() || "Unnamed User";

                    return (
                      <tr
                        key={user._id.toString()}
                        className="group border-b border-border last:border-0 transition-colors duration-200 hover:bg-background-secondary/60"
                      >
                        {/* USER */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-sm font-black text-accent transition-colors group-hover:border-accent/30 group-hover:bg-accent/10">
                              {getInitials(
                                user.firstName,
                                user.lastName
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-bold">
                                {fullName}
                              </p>

                              <p className="mt-0.5 text-[10px] text-foreground-muted">
                                ID:{" "}
                                {user._id
                                  .toString()
                                  .slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-5 py-4">
                          <span className="block max-w-[260px] truncate text-sm text-foreground-secondary">
                            {user.email || "No email"}
                          </span>
                        </td>

                        {/* ROLE */}
                        <td className="px-5 py-4">
                          <RoleBadge role={user.role} />
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-4">
                          <span className="whitespace-nowrap text-xs text-foreground-secondary">
                            {formatDate(user.createdAt)}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4 text-right">
                          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer hint */}
        {users.length > 0 && (
          <div className="mt-4 flex items-center justify-between gap-3 px-1">
            <p className="text-[10px] text-foreground-muted">
              Showing all registered platform accounts
            </p>

            <Link
              href="/admin"
              className="group inline-flex items-center gap-1.5 text-[10px] font-semibold text-foreground-muted transition-colors hover:text-foreground"
            >
              Admin Overview
              <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  label,
  value,
  description,
  icon,
  accent = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 sm:p-5 ${
        accent
          ? "border-accent/20 bg-accent/10"
          : "border-border bg-card hover:border-border-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            accent
              ? "border-accent/20 bg-background/30 text-accent"
              : "border-border bg-background text-foreground-muted group-hover:border-accent/30 group-hover:bg-accent/10 group-hover:text-accent"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1 text-right">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight">
            {value.toLocaleString("en-KE")}
          </p>

          <p className="mt-1 truncate text-xs text-foreground-muted">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* ROLE BADGE */
/* ========================================================= */

function RoleBadge({ role }: { role: string }) {
  const roleLabel =
    role.charAt(0).toUpperCase() + role.slice(1);

  const icon =
    role === "admin" ? (
      <ShieldCheckIcon className="h-3.5 w-3.5" />
    ) : role === "organizer" ? (
      <UserGroupIcon className="h-3.5 w-3.5" />
    ) : (
      <UserCircleIcon className="h-3.5 w-3.5" />
    );

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
        role === "admin"
          ? "border-accent/30 bg-accent/10 text-accent"
          : role === "organizer"
            ? "border-border bg-background-secondary text-foreground"
            : "border-border bg-background text-foreground-secondary"
      }`}
    >
      {icon}
      {roleLabel}
    </span>
  );
}

/* ========================================================= */
/* HELPERS */
/* ========================================================= */

function getInitials(
  firstName?: string,
  lastName?: string
) {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";

  return (
    `${first}${last}`.toUpperCase() || "U"
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}