import { createClient } from "@supabase/supabase-js";

// These are public, browser-safe values (they ship inside the client bundle
// anyway). Row-level security in the database protects all writes. Environment
// variables take precedence so different deploys can point at other projects;
// the fallbacks guarantee the app never white-screens when env vars are absent
// (e.g. Vercel builds without the .env file, which is git-ignored).
const DEFAULT_SUPABASE_URL = "https://qfldklwrzfgflwesyflh.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_Hg376E_b3j_kXXZS-OC5Nw_UBDj87wE";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;

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
