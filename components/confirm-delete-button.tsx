"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmDeleteButton({
  confirmMessage,
  action,
}: {
  confirmMessage: string;
  action: () => Promise<{ error?: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    setLoading(true);
    setError(null);

    const result = await action();

    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-sm text-rust hover:underline disabled:opacity-60"
      >
        {loading ? "Deleting…" : "Delete"}
      </button>
      {error && <p className="max-w-[180px] text-right text-xs text-rust">{error}</p>}
    </div>
  );
}
