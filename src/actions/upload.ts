"use server";
import { createClient } from "@/lib/supabase/supabase-server/index";
import { v4 } from "uuid";
export const uploadFile = async (file: any) => {
  if (!file) throw new Error("File must be provided");
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("nebula-workspace")
      .upload(`workspaceImage${v4()}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error(`${error}`);
    }

    return JSON.stringify({
      data,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error, data: null });
  }
};
