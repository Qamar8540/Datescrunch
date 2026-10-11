"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/orders";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-toffee/20 text-coffee",
  confirmed: "bg-mahogany/15 text-mahogany",
  shipped: "bg-stone/20 text-stone",
  delivered: "bg-olive/15 text-olive",
  cancelled: "bg-rust/15 text-rust",
};

export default function OrderStatusSelect({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(next: string) {
    const previous = status;
    setStatus(next); // optimistic
    setSaving(true);
    setError(null);

    const result = await updateOrderStatus(orderId, next);

    setSaving(false);
    if (result?.error) {
      setStatus(previous);
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className={`rounded-full border-0 px-3 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-2 focus:ring-mahogany disabled:opacity-60 ${STATUS_STYLES[status] ?? "bg-sand text-coffee"}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rust">{error}</p>}
    </div>
  );
}
