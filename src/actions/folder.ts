"use server";
import db from "@/lib/supabase/db";
import { validate } from "uuid";
import { folders } from "../../migrations/schema";
import { eq } from "drizzle-orm";
import { FOLDER } from "@/types/supabase";
import { createClient } from "@/lib/supabase/supabase-server";
import { SUPABASE_FOLDER } from "@/types/supabase-type";

export const getFolders = async (workspaceId: string) => {
  const isValidId = validate(workspaceId);
  if (!isValidId) {
    return { data: null, error: "workspace ID is not a valid uuid" };
  }

  try {
    const res: FOLDER[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workspaceId));

    return { data: res, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: error };
  }
};

export const upsertFolder = async (folder: Partial<FOLDER>) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("folders").upsert([
      {
        banner_url: folder.bannerUrl,
        created_at: folder.createdAt,
        icon_id: folder.iconId,
        workspace_id: folder.workspaceId,
        in_trash: folder.inTrash,
        title: folder.title,
        id: folder.id,
        data: folder.data,
      },
    ]);

    if (error) return { data: null, error };
    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};

export const deleteFolder = async (folderId: string) => {
  if (!folderId) throw new Error("Folder ID is missing");
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("folders")
      .delete()
      .eq("id", folderId);
    if (error) return { data: null, error: error };
    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};

export const getFolderDetails = async (folderId: string) => {
  if (!folderId) throw new Error("Folder ID is missing");
  try {
    const supabase = await createClient();
    const { error, data } = await supabase
      .from("folders")
      .select("*")
      .eq("id", folderId)
      .single();
    if (error) return { data: null, error: error };
    return { data: data , error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};
