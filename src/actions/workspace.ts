"use server";

import db from "@/lib/supabase/db";
import { WORKSPACE } from "@/types/supabase";
import { and, eq, notExists } from "drizzle-orm";
import { collaborators, users, workspaces } from "../../migrations/schema";
import { SUPABASE_WORKSPACE } from "@/types/supabase-type";
import { createClient } from "@/lib/supabase/supabase-server";
export const createWorkspace = async (workspace: WORKSPACE) => {
  try {
    const res = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};

export const getPrivateWorkspaces = async (userId: string) => {
  if (!userId) return [];

  const res = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .where(
      and(
        notExists(
          db
            .select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))
        ),
        eq(workspaces.workspaceOwner, userId)
      )
    )) as [WORKSPACE];
  console.log("server", res);
  return res;
};

export const getCollaboratingWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const res = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    .innerJoin(collaborators, eq(users.id, collaborators.userId))
    .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
    .where(eq(users.id, userId))) as [WORKSPACE];
  return res;
};

export const getSharedWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const res = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .orderBy(workspaces.createdAt)
    .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
    .where(eq(workspaces.workspaceOwner, userId))) as [WORKSPACE];
  return res;
};

export const updateWorkspace = async (data: Partial<WORKSPACE>) => {
  if (!data.id) return;
  try {
    await db.update(workspaces).set(data).where(eq(workspaces.id, data.id));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  if (!workspaceId) {
    return;
  }
  try {
    const res = await db
      .delete(workspaces)
      .where(eq(workspaces.id, workspaceId));
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getWorkspace = async (workspaceId: string) => {
  if (!workspaceId) throw new Error("Workspace ID must pe provided");
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", workspaceId)
      .single();
    if (error) {
      console.log(error);
      return { data: null, error: error };
    }
    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
};
