"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function OrganizerRequestActions({
  userId,
}: {
  userId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState<
    "approve" | "reject" | null
  >(null);

  async function handleAction(
    action: "approve" | "reject"
  ) {
    const confirmed = window.confirm(
      action === "approve"
        ? "Approve this user as an organizer?"
        : "Reject this organizer request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(action);

      const response = await fetch(
        "/api/admin/organizers",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Organizer request action error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(null);
    }
  }

  const isLoading = loading !== null;

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => handleAction("approve")}
        disabled={isLoading}
        aria-label="Approve organizer request"
        className="group inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-accent transition-all duration-200 hover:border-accent/40 hover:bg-accent/20 hover:shadow-sm hover:shadow-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "approve" ? (
          <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckIcon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
        )}

        <span>
          {loading === "approve"
            ? "Approving..."
            : "Approve"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => handleAction("reject")}
        disabled={isLoading}
        aria-label="Reject organizer request"
        className="group inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-foreground-secondary transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "reject" ? (
          <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XMarkIcon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
        )}

        <span>
          {loading === "reject"
            ? "Rejecting..."
            : "Reject"}
        </span>
      </button>
    </div>
  );
}