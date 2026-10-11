import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/settings-form";
import type { SettingsInput } from "@/lib/actions/settings";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  const initial: SettingsInput = {
    store_name: settings.store_name ?? "",
    whatsapp_number: settings.whatsapp_number ?? "",
    store_phone: settings.store_phone ?? "",
    store_email: settings.store_email ?? "",
    store_address: settings.store_address ?? "",
    store_description: settings.store_description ?? "",
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>
      <SettingsForm initial={initial} />
    </div>
  );
}
