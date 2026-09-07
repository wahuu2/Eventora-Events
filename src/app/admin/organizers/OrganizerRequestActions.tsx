"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => handleAction("approve")}
        disabled={loading !== null}
        className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "approve"
          ? "Approving..."
          : "Approve"}
      </button>

      <button
        type="button"
        onClick={() => handleAction("reject")}
        disabled={loading !== null}
        className="rounded-lg border border-border bg-background px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-foreground-secondary transition hover:bg-background-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "reject"
          ? "Rejecting..."
          : "Reject"}
      </button>
    </div>
  );
}