"use server";
import db from "@/lib/supabase/db";
import { validate } from "uuid";
import { folders } from "../../migrations/schema";
import { eq } from "drizzle-orm";
import { FOLDER } from "@/types/supabase";

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
