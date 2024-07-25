import { createBrowserClient } from "@supabase/ssr";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("supabase key or url not found");
}

export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseKey!);
}
