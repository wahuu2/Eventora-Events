import { requireAdmin } from "@/lib/auth";
import Payment from "@/database/payment.model";

import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  ReceiptPercentIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default async function AdminPaymentsPage() {
  const result = await requireAdmin();

  if (!result.authorized) {
    return null;
  }

  const payments = await Payment.find({})
    .populate("user", "firstName lastName email")
    .populate("booking", "bookingReference totalAmount status")
    .sort({ createdAt: -1 })
    .lean();

  const totalPayments = payments.length;

  const successfulPayments = payments.filter(
    (payment) => payment.status === "successful"
  ).length;

  const pendingPayments = payments.filter(
    (payment) =>
      payment.status === "pending" ||
      payment.status === "processing"
  ).length;

  const failedPayments = payments.filter(
    (payment) => payment.status === "failed"
  ).length;

  const successfulRevenue = payments
    .filter((payment) => payment.status === "successful")
    .reduce(
      (total, payment) =>
        total + (Number(payment.amount) || 0),
      0
    );

  const successRate =
    totalPayments > 0
      ? Math.round((successfulPayments / totalPayments) * 100)
      : 0;

  const paymentMethods = payments.reduce<Record<string, number>>(
    (acc, payment) => {
      const method = String(payment.method || "Unknown").toLowerCase();

      acc[method] = (acc[method] || 0) + 1;

      return acc;
    },
    {}
  );

  const topPaymentMethod =
    Object.entries(paymentMethods).sort(
      ([, countA], [, countB]) => countB - countA
    )[0]?.[0] || "N/A";

  return (
    <div className="min-h-screen bg-background">
      {/* PAGE HEADER */}
      <section className="border-b border-border">
        <div className="container-responsive py-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                  <BanknotesIcon className="h-5 w-5 text-accent" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Platform Management
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Payments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
                Monitor transaction activity, payment methods,
                processing status, and successful platform revenue.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-border bg-card px-5 py-4 sm:w-fit">
              <div className="flex items-center gap-2">
                <ReceiptPercentIcon className="h-4 w-4 text-foreground-muted" />

                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                  Total Payments
                </p>
              </div>

              <p className="mt-2 text-2xl font-black">
                {totalPayments}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="container-responsive py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Payments"
            value={totalPayments}
            description="All payment records"
            icon={Squares2X2Icon}
            accent
          />

          <StatCard
            label="Successful"
            value={successfulPayments}
            description="Completed payments"
            icon={CheckCircleIcon}
          />

          <StatCard
            label="Pending"
            value={pendingPayments}
            description="Pending or processing"
            icon={ClockIcon}
          />

          <StatCard
            label="Failed"
            value={failedPayments}
            description="Unsuccessful payments"
            icon={ExclamationCircleIcon}
          />
        </div>
      </section>

      {/* REVENUE + PERFORMANCE */}
      <section className="container-responsive pb-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* REVENUE */}
          <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/10 p-5 sm:p-6">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-accent/10 bg-accent/5" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-accent" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    Successful Revenue
                  </p>
                </div>

                <p className="mt-2 break-words text-2xl font-black tracking-tight sm:text-3xl">
                  {formatAmount(successfulRevenue)}
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-foreground-secondary">
                  Total value of successfully completed payments.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-background text-xs font-black text-accent">
                KES
              </div>
            </div>
          </div>

          {/* PAYMENT PERFORMANCE */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground-muted">
                  Payment Performance
                </p>

                <p className="mt-2 text-2xl font-black">
                  {successRate}%
                </p>

                <p className="mt-1 text-xs text-foreground-muted">
                  Successful payment rate
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
                <CheckCircleIcon className="h-5 w-5 text-accent" />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-background-secondary">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{
                  width: `${Math.min(successRate, 100)}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-[10px] font-semibold text-foreground-muted">
              <span>
                {successfulPayments} successful
              </span>

              <span>
                {failedPayments} failed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PAYMENT INSIGHTS */}
      <section className="container-responsive pb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InsightCard
            label="Successful Revenue"
            value={formatAmount(successfulRevenue)}
            description="Confirmed platform payment value"
            icon={BanknotesIcon}
          />

          <InsightCard
            label="Primary Method"
            value={formatMethod(topPaymentMethod)}
            description="Most frequently used payment method"
            icon={CreditCardIcon}
          />

          <InsightCard
            label="Transaction Records"
            value={totalPayments}
            description="Payment records currently stored"
            icon={ReceiptPercentIcon}
          />
        </div>
      </section>

      {/* PAYMENTS TABLE */}
      <section className="container-responsive pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border px-4 py-5 sm:px-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <ReceiptPercentIcon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold">
                  Payment Activity
                </h2>

                <p className="mt-1 text-xs text-foreground-muted">
                  Latest transactions appear first.
                </p>
              </div>
            </div>

            <span className="w-fit shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground-secondary">
              {totalPayments} payments
            </span>
          </div>

          {payments.length === 0 ? (
            <div className="px-5 py-14 text-center sm:px-6 sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
                <ReceiptPercentIcon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-bold">
                No payments found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-foreground-muted">
                No payment transactions have been recorded on
                the platform yet.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-left">
                    <TableHeading>
                      Customer
                    </TableHeading>

                    <TableHeading>
                      Booking
                    </TableHeading>

                    <TableHeading>
                      Amount
                    </TableHeading>

                    <TableHeading>
                      Method
                    </TableHeading>

                    <TableHeading>
                      Status
                    </TableHeading>

                    <TableHeading>
                      Transaction
                    </TableHeading>

                    <TableHeading align="right">
                      Date
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => {
                    const user = payment.user as
                      | {
                          firstName?: string;
                          lastName?: string;
                          email?: string;
                        }
                      | null;

                    const booking = payment.booking as
                      | {
                          bookingReference?: string;
                          totalAmount?: number;
                          status?: string;
                        }
                      | null;

                    const customerName =
                      `${user?.firstName || ""} ${
                        user?.lastName || ""
                      }`.trim() || "Unknown Customer";

                    return (
                      <tr
                        key={payment._id.toString()}
                        className="border-b border-border last:border-0 transition-colors hover:bg-background-secondary/60"
                      >
                        {/* CUSTOMER */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-sm font-black text-accent">
                              {getInitials(
                                user?.firstName,
                                user?.lastName
                              )}
                            </div>

                            <div className="min-w-0 max-w-[190px]">
                              <p className="truncate text-sm font-bold">
                                {customerName}
                              </p>

                              <p className="mt-1 truncate text-[10px] text-foreground-muted">
                                {user?.email ||
                                  "No email available"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* BOOKING */}
                        <td className="px-5 py-5">
                          <div className="min-w-0">
                            <span className="inline-block max-w-[180px] truncate rounded-lg border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] font-semibold text-foreground-secondary">
                              {booking?.bookingReference ||
                                "N/A"}
                            </span>

                            {booking?.status && (
                              <p className="mt-2 text-[10px] text-foreground-muted">
                                Booking: {booking.status}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="px-5 py-5">
                          <span className="whitespace-nowrap text-sm font-black">
                            {formatAmount(
                              Number(payment.amount) || 0
                            )}
                          </span>
                        </td>

                        {/* METHOD */}
                        <td className="px-5 py-5">
                          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-background px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                            <CreditCardIcon className="h-3.5 w-3.5 text-accent" />

                            {formatMethod(
                              String(payment.method || "Unknown")
                            )}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-5">
                          <PaymentStatusBadge
                            status={String(payment.status || "unknown")}
                          />
                        </td>

                        {/* TRANSACTION */}
                        <td className="px-5 py-5">
                          <span className="block max-w-[180px] truncate font-mono text-[10px] text-foreground-muted">
                            {payment.transactionReference ||
                              "Not assigned"}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-5 text-right">
                          <span className="whitespace-nowrap text-xs text-foreground-secondary">
                            {formatDate(payment.createdAt)}
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
/* STAT CARD */
/* ========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent?: boolean;
}) {
  return (
    <div
      className={`card-responsive rounded-2xl border p-5 transition-all duration-200 ${
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
            accent
              ? "bg-accent"
              : "bg-foreground-muted"
          }`}
        />
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

/* ========================================================= */
/* INSIGHT CARD */
/* ========================================================= */

function InsightCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-border-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground-muted">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

/* ========================================================= */
/* PAYMENT STATUS */
/* ========================================================= */

function PaymentStatusBadge({
  status,
}: {
  status: string;
}) {
  const normalizedStatus = status.toLowerCase();

  const isSuccessful = normalizedStatus === "successful";
  const isPending =
    normalizedStatus === "pending" ||
    normalizedStatus === "processing";
  const isFailed = normalizedStatus === "failed";

  const Icon = isSuccessful
    ? CheckCircleIcon
    : isPending
      ? ClockIcon
      : isFailed
        ? ExclamationCircleIcon
        : ReceiptPercentIcon;

  const styles = isSuccessful
    ? "border-accent/30 bg-accent/10 text-accent"
    : isPending
      ? "border-border bg-background-secondary text-foreground-secondary"
      : isFailed
        ? "border-border bg-background text-foreground-muted"
        : "border-border bg-background text-foreground-muted";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${styles}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {status}
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

  return `${first}${last}`.toUpperCase() || "U";
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: number) {
  return `KES ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatMethod(method: string) {
  return method
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}