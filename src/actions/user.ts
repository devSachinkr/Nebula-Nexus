"use server";
import db from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/supabase-server";
import { SUBSCRIPTIONS,USER } from "@/types/supabase";
export const getUser = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error("Failed to get user data");
    }

    return data.user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data) return { data: data, error: error };
    else return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};

export const getUserByEmail = async (email: string) => {
  if (!email) return { data: null, error: "Email not found" };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("email", `${email}%`);
    if (data) return { data: data, error: error };
    else return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};

