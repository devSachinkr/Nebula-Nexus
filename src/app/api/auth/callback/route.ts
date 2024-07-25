import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/supabase-server/index";

export async function GET(req: Request) {
  const { searchParams,origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }
  return NextResponse.redirect(`${origin}`);
}
