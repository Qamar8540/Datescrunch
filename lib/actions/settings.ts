"use server";

import { createClient } from "@/lib/supabase/server";

export interface SettingsInput {
  store_name: string;
  whatsapp_number: string;
  store_phone: string;
  store_email: string;
  store_address: string;
  store_description: string;
}

export interface ActionResult {
  error?: string;
}

export async function updateSettings(
  input: SettingsInput
): Promise<ActionResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const rows = Object.entries(input).map(([key, value]) => ({
    key,
    value: value.trim(),
  }));

  const { error } = await supabase.from("settings").upsert(rows, {
    onConflict: "key",
  });

  if (error) {
    return { error: "Could not save settings. Please try again." };
  }

  return {};
}
