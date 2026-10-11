import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Wrapped in React's cache() so multiple components (layout, header,
// footer, page) calling this during the same request share one Supabase
// query instead of firing it repeatedly.
export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const supabase = createClient();
  const { data } = await supabase.from("settings").select("key, value");

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value ?? "";
  }
  return map;
});
