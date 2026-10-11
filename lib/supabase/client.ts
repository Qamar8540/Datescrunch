import { createBrowserClient } from "@supabase/ssr";

// Used inside Client Components (e.g. cart page, admin forms with live
// interactivity). Reads the public anon key — safe to expose to the browser
// because table access is controlled by Row Level Security policies.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
