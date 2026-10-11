"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleProductActive } from "@/lib/actions/products";

export default function ActiveToggle({
  productId,
  initialActive,
}: {
  productId: string;
  initialActive: boolean;
}) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    const next = !active;
    setActive(next); // optimistic
    setSaving(true);

    const result = await toggleProductActive(productId, next);

    setSaving(false);
    if (result?.error) {
      setActive(!next); // revert
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      aria-pressed={active}
      aria-label={active ? "Mark as inactive" : "Mark as active"}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60 ${
        active ? "bg-olive/15 text-olive" : "bg-stone/15 text-stone"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
}
