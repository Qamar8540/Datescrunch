"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";
import StatusBanner from "@/components/status-banner";

export default function CategoryForm({
  initialName = "",
  onSave,
}: {
  initialName?: string;
  onSave: (name: string) => Promise<{ error?: string }>;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const result = await onSave(name);

    setSaving(false);
    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/categories?success=1");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md rounded-card border border-sand bg-white p-6"
    >
      <label htmlFor="name" className="block text-sm font-medium text-coffee">
        Category name
      </label>
      <input
        id="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Dates"
        className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
      />

      <p className="mt-1 text-xs text-stone">
        Slug: <span className="font-mono">{slugify(name) || "—"}</span>
      </p>

      {error && (
        <div className="mt-4">
          <StatusBanner type="error" message={error} />
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-card bg-mahogany px-4 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save category"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="text-sm text-stone hover:text-coffee"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
