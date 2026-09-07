"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-background">
      <section className="container-responsive py-10 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Eventora
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Become an Organizer
          </h1>

          <p className="mt-3 text-sm leading-6 text-foreground-secondary">
            Organizers can create and manage events on
            Eventora. Submit a request and an administrator
            will review your application.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold">
                  Organizer access
                </h2>

                <p className="mt-1 text-sm leading-6 text-foreground-muted">
                  Once approved, your account will receive
                  organizer privileges and you will be able
                  to create and manage events.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Administrator approval required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-foreground-muted">
                      Your account will remain an attendee
                      account until an administrator approves
                      your request.
                    </p>
                  </div>
                </div>
              </div>

              {message && (
                <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground-secondary">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={submitRequest}
                disabled={loading}
                className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-bold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Submitting Request..."
                  : "Request Organizer Access"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}