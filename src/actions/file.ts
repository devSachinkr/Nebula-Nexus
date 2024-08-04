"use server";

import { SUPABASE_FILE } from "@/types/supabase-type";
import { createClient } from "@/lib/supabase/supabase-server";
export const upsertFile = async (data: Partial<SUPABASE_FILE>) => {
  try {
    console.log(data);
    const supabase = await createClient();
    const { data: updatedData, error } = await supabase.from("files").upsert({
      banner_url: data.banner_url || "",
      created_at: data.created_at || new Date().toISOString(),
      data: data.data || null,
      folder_id: data.folder_id,
      icon_id: data.icon_id || "📄",
      id: data.id,
      in_trash: data.in_trash || "",
      title: data.title || "Untitled",
      workspace_id: data.workspace_id,
    });
    if (error) {
      console.log(error);
      return { data: null, error: `Error ${error}` };
    }

    return { data: updatedData, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};

export const getFiles = async (folderId: string) => {
  if (!folderId) throw new Error("Folder ID is missing");
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", folderId);
    if (error) return { data: null, error: error };
    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};

export const deleteFiles = async (fileId: string) => {
  if (!fileId) throw new Error("File ID is missing");
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("files")
      .delete()
      .eq("id", fileId);
    if (error) return { data: null, error: error };
    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};

export const getFileDetails = async (fileId: string) => {
  if (!fileId) throw new Error("File ID is missing");
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId).single();
    if (error) return { data: null, error: error };
    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};
