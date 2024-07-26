"use server";
import db from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/supabase-server";
import { SUBSCRIPTIONS } from "@/types/supabase";
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
      .eq("user_id", userId);
    if (data) return { data: data, error: error };
    else return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};
