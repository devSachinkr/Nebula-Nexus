"use server";
import { createClient } from "@/lib/supabase/supabase-server";
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
