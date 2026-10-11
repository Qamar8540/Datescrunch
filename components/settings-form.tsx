"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import StatusBanner from "@/components/status-banner";
import { updateSettings, type SettingsInput } from "@/lib/actions/settings";

export default function SettingsForm({ initial }: { initial: SettingsInput }) {
  const router = useRouter();
  const [values, setValues] = useState<SettingsInput>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update(key: keyof SettingsInput, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    const result = await updateSettings(values);

    setSaving(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  const fields: { key: keyof SettingsInput; label: string; hint?: string }[] = [
    { key: "store_name", label: "Store name" },
    {
      key: "whatsapp_number",
      label: "WhatsApp number",
      hint: "Country code + number, no + or spaces, e.g. 919876543210",
    },
    { key: "store_phone", label: "Phone number" },
    { key: "store_email", label: "Email" },
    { key: "store_address", label: "Store address" },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-card border border-sand bg-white p-6">
      {fields.map((field) => (
        <div key={field.key}>
          <label htmlFor={field.key} className="block text-sm font-medium">
            {field.label}
          </label>
          <input
            id={field.key}
            value={values[field.key]}
            onChange={(e) => update(field.key, e.target.value)}
            className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
          />
          {field.hint && <p className="mt-1 text-xs text-stone">{field.hint}</p>}
        </div>
      ))}

      <div>
        <label htmlFor="store_description" className="block text-sm font-medium">
          Short business description
        </label>
        <textarea
          id="store_description"
          rows={3}
          value={values.store_description}
          onChange={(e) => update("store_description", e.target.value)}
          className="mt-1 w-full rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        />
      </div>

      {error && <StatusBanner type="error" message={error} />}
      {success && !error && (
        <StatusBanner type="success" message="Settings saved successfully." />
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-card bg-mahogany px-5 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
