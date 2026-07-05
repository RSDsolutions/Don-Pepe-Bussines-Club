import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaced early so misconfiguration is obvious in dev.
  console.error(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Copy .env.example to .env and fill in your project keys."
  );
}

// Note: typed row shapes live in ./database.types.ts and are applied via
// explicit casts at call sites. We intentionally use an untyped client so
// insert/update payloads are not constrained by generated schema generics.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "donpepe_admin_auth",
  },
});
