import { requireAdmin } from "@/lib/auth";
import User from "@/database/user.model";

import {
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import OrganizerRequestActions from "./OrganizerRequestActions";

export default async function AdminOrganizersPage() {
  const result = await requireAdmin();

  if (!result.authorized) {
    return null;
  }

  const organizers = await User.find({
    role: "organizer",
  })
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  const pendingRequests = await User.find({
    role: "user",
    organizerRequestStatus: "pending",
  })
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  const totalOrganizers = organizers.length;
  const totalPendingRequests = pendingRequests.length;

  return (
    <div className="min-h-screen bg-background">
      {/* PAGE HEADER */}
      <section className="border-b border-border">
        <div className="container-responsive py-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                  <UserGroupIcon className="h-5 w-5 text-accent" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Platform Management
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Organizers
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
                Review organizer applications and manage accounts
                with permission to create events on Eventora.
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 sm:w-fit">
              <HeaderMetric
                label="Organizers"
                value={totalOrganizers}
                icon={UserGroupIcon}
              />

              <HeaderMetric
                label="Pending"
                value={totalPendingRequests}
                icon={ClockIcon}
                accent
              />
            </div>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="container-responsive py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            label="Total Organizers"
            value={totalOrganizers}
            description="Registered event creators"
            icon={UserGroupIcon}
            accent
          />

          <SummaryCard
            label="Pending Requests"
            value={totalPendingRequests}
            description="Applications awaiting review"
            icon={UserPlusIcon}
          />

          <SummaryCard
            label="Organizer Access"
            value="Active"
            description="Authorized to create events"
            icon={ShieldCheckIcon}
          />
        </div>
      </section>

      {/* PENDING REQUESTS */}
      <section className="container-responsive pb-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <SectionHeader
            icon={ClockIcon}
            title="Organizer Requests"
            description="Review users requesting permission to create events."
            count={totalPendingRequests}
            countLabel="pending"
            accent
          />

          {pendingRequests.length === 0 ? (
            <EmptyState
              icon={CheckCircleIcon}
              title="No pending requests"
              description="There are currently no users waiting for organizer approval."
              success
            />
          ) : (
            <div className="table-wrapper">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-left">
                    <TableHeading>Applicant</TableHeading>
                    <TableHeading>Email</TableHeading>
                    <TableHeading>Status</TableHeading>
                    <TableHeading>Joined</TableHeading>
                    <TableHeading align="right">
                      Actions
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {pendingRequests.map((user) => {
                    const fullName =
                      `${user.firstName || ""} ${
                        user.lastName || ""
                      }`.trim() || "Unnamed User";

                    return (
                      <tr
                        key={user._id.toString()}
                        className="border-b border-border last:border-0 transition-colors hover:bg-background-secondary/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              firstName={user.firstName}
                              lastName={user.lastName}
                            />

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-bold">
                                {fullName}
                              </p>

                              <p className="mt-0.5 text-[10px] text-foreground-muted">
                                ID: {user._id.toString().slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="block max-w-[260px] truncate text-sm text-foreground-secondary">
                            {user.email || "No email"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            label="Pending Review"
                            icon={ClockIcon}
                            pending
                          />
                        </td>

                        <td className="px-5 py-4">
                          <span className="whitespace-nowrap text-xs text-foreground-secondary">
                            {formatDate(user.createdAt)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <OrganizerRequestActions
                            userId={user._id.toString()}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* EXISTING ORGANIZERS */}
      <section className="container-responsive pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <SectionHeader
            icon={UserGroupIcon}
            title="Event Organizers"
            description="Accounts with active organizer privileges."
            count={totalOrganizers}
            countLabel="organizers"
          />

          {organizers.length === 0 ? (
            <EmptyState
              icon={UserGroupIcon}
              title="No organizers found"
              description="There are currently no accounts with organizer privileges."
            />
          ) : (
            <div className="table-wrapper">
              <table className="w-full min-w-[780px]">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-left">
                    <TableHeading>Organizer</TableHeading>
                    <TableHeading>Email</TableHeading>
                    <TableHeading>Role</TableHeading>
                    <TableHeading>Joined</TableHeading>
                    <TableHeading align="right">
                      Access
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {organizers.map((organizer) => {
                    const fullName =
                      `${organizer.firstName || ""} ${
                        organizer.lastName || ""
                      }`.trim() || "Unnamed Organizer";

                    return (
                      <tr
                        key={organizer._id.toString()}
                        className="border-b border-border last:border-0 transition-colors hover:bg-background-secondary/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              firstName={organizer.firstName}
                              lastName={organizer.lastName}
                            />

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-bold">
                                {fullName}
                              </p>

                              <p className="mt-0.5 text-[10px] text-foreground-muted">
                                ID:{" "}
                                {organizer._id.toString().slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="block max-w-[260px] truncate text-sm text-foreground-secondary">
                            {organizer.email || "No email"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            label="Organizer"
                            icon={ShieldCheckIcon}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <span className="whitespace-nowrap text-xs text-foreground-secondary">
                            {formatDate(organizer.createdAt)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            Event Access
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
      </section>
    </div>
  );
}

/* ========================================================= */
/* HEADER METRIC */
/* ========================================================= */

function HeaderMetric({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent?: boolean;
}) {
  return (
    <div
      className={`min-w-[130px] rounded-2xl border px-5 py-4 ${
        accent
          ? "border-accent/30 bg-accent/10"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${
            accent ? "text-accent" : "text-foreground-muted"
          }`}
        />

        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
          {label}
        </p>
      </div>

      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

/* ========================================================= */
/* SUMMARY CARD */
/* ========================================================= */

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 ${
        accent
          ? "border-accent/30 bg-accent/10"
          : "border-border bg-card hover:border-border-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            accent
              ? "border-accent/20 bg-accent/10 text-accent"
              : "border-border bg-background text-foreground-muted"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
            accent ? "bg-accent" : "bg-foreground-muted"
          }`}
        />
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-xs text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

/* ========================================================= */
/* SECTION HEADER */
/* ========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
  count,
  countLabel,
  accent = false,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  count: number;
  countLabel: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-4 py-5 sm:px-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
            accent
              ? "border-accent/20 bg-accent/10 text-accent"
              : "border-border bg-background text-foreground-muted"
          }`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold">{title}</h2>

          <p className="mt-1 text-xs text-foreground-muted">
            {description}
          </p>
        </div>
      </div>

      <span
        className={`w-fit rounded-lg border px-3 py-2 text-xs font-semibold ${
          accent
            ? "border-accent/20 bg-accent/10 text-accent"
            : "border-border bg-background text-foreground-secondary"
        }`}
      >
        {count} {countLabel}
      </span>
    </div>
  );
}

/* ========================================================= */
/* EMPTY STATE */
/* ========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
  success = false,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  success?: boolean;
}) {
  return (
    <div className="px-5 py-14 text-center sm:px-6">
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl border ${
          success
            ? "border-accent/20 bg-accent/10 text-accent"
            : "border-border bg-background text-foreground-muted"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-bold">{title}</h3>

      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

/* ========================================================= */
/* AVATAR */
/* ========================================================= */

function Avatar({
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
}) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-sm font-black text-accent">
      {getInitials(firstName, lastName)}
    </div>
  );
}

/* ========================================================= */
/* STATUS BADGE */
/* ========================================================= */

function StatusBadge({
  label,
  icon: Icon,
  pending = false,
}: {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  pending?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
        pending
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-accent/20 bg-accent/10 text-accent"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

/* ========================================================= */
/* TABLE HEADING */
/* ========================================================= */

function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-foreground-muted ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
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

  return `${first}${last}`.toUpperCase() || "O";
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}