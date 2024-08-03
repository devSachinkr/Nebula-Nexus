"use server";
import db from "@/lib/supabase/db";
import { USER } from "@/types/supabase";
import { and, eq } from "drizzle-orm";
import { collaborators } from "../../migrations/schema";

export const addCollaborators = async (users: USER[], workspaceId: string) => {
  if (!users) throw new Error("Users not found");
  try {
    const res = users.forEach(async (user) => {
      const userExist = await db.query.collaborators.findFirst({
        where: (u, { eq }) =>
          and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
      });
      if (!userExist)
        await db.insert(collaborators).values({ workspaceId, userId: user.id });
    });
  } catch (error) {
    console.log(error);
  }
};

export const removeCollaborators = async (
  users: USER[],
  workspaceId: string
) => {
  if (!users) throw new Error("Users not found");
  try {
    const res = users.forEach(async (user) => {
      const userExist = await db.query.collaborators.findFirst({
        where: (u, { eq }) =>
          and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
      });
      if (!userExist)
        await db
          .delete(collaborators)
          .where(
            and(
              eq(collaborators.workspaceId, workspaceId),
              eq(collaborators.userId, user.id)
            )
          );
    });
  } catch (error) {
    console.log(error);
  }
};
