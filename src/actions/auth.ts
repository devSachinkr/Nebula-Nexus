"use server";
import { createClient } from "@/lib/supabase/supabase-server/index";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
// import { redirect } from "next/navigation";

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email or password not found");
  }

  const supabase = await createClient();
  const res = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return JSON.stringify(res);
};

export const signUpUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email or password not found");
  }

  const supabase = await createClient();
  const res = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/confirm`,
    },
  });
  return JSON.stringify(res);
};

export const googleLogin = async (provider: Provider) => {
  if (!provider) throw new Error("provider not found");
  const supabase = await createClient();
  const res = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });
  // if (res?.data?.url) {
  //   redirect(res.data.url)
  // }
  return JSON.stringify(res);
};
