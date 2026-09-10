"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function OrganizerRequestPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitRequest() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/organizer-request",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }

      setMessage(data.message);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container-responsive py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              Organizer Access
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Become an Organizer
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground-secondary sm:text-base">
              Create and manage events on Eventora. Submit
              your request and an administrator will review
              your application before organizer access is
              granted.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-card-hover/40 px-5 py-5 sm:px-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                  <InformationCircleIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold sm:text-lg">
                    Organizer access
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-foreground-muted">
                    Your account will receive additional
                    event management capabilities once your
                    request has been approved.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <CheckCircleIcon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Administrator approval required
                    </p>

                    <p className="mt-1 text-xs leading-6 text-foreground-muted sm:text-sm">
                      Your account will remain an attendee
                      account until an administrator reviews
                      and approves your organizer request.
                    </p>
                  </div>
                </div>
              </div>

              {message && (
                <div
                  role="status"
                  className="flex gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-4 text-sm text-accent"
                >
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-bold">
                      Request submitted
                    </p>

                    <p className="mt-1 text-xs leading-5 text-accent/80">
                      {message}
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-400"
                >
                  <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-bold">
                      Request could not be submitted
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-400/80">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={submitRequest}
                  disabled={loading}
                  className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-background shadow-sm shadow-accent/10 transition-all duration-200 hover:bg-accent-hover hover:shadow-md hover:shadow-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
                      Request Organizer Access
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-[11px] leading-5 text-foreground-muted">
                  Organizer access is subject to administrator
                  approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}