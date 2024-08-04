"use client";

import { deleteWorkspace, updateWorkspace } from "@/actions/workspace";
import { useAppState } from "@/lib/providers/state-provider";
import { USER, WORKSPACE } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/supabase-client";
import { v4 } from "uuid";
import ToastNotify from "@/components/global/ToastNotify";
import { useSupabaseUser } from "@/lib/providers/user-provider";
import { removeCollaborators } from "@/actions/collaborators";
import { useModal } from "@/lib/providers/modal-provider";
export const useSettings = () => {
  const { dispatch, state, workspaceId } = useAppState();
  const { user } = useSupabaseUser();
  const { setClose } = useModal();
  const router = useRouter();
  const [permission, setPermission] = useState<"private" | "shared">("private");
  const [collaborators, setCollaborators] = useState<USER[]>([]);
  const [alert, setAlert] = useState<boolean>(false);
  const [workspaceData, setWorkspaceData] = useState<WORKSPACE>();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [workspaceLogo, setWorkspaceLogo] = useState<string>("");
  const changeWorkspaceName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;
    dispatch({
      type: "UPDATE_WORKSPACE",
      payload: {
        workspace: {
          title: e.target.value,
        },
        workspaceId,
      },
    });
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(async () => {
      await updateWorkspace({ id: workspaceId, title: e.target.value });
      router.refresh();
    }, 500);
  };

  const changeWorkspaceLogo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!workspaceId) return;
    const File = e.target.files?.[0];
    if (!File) return;
    setLoading(true);
    const supabase = createClient();
    const uuid = v4();
    const { data, error } = await supabase.storage
      .from("nebula-workspace")
      .upload(`nebula-workspace.${uuid}`, File, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) {
      console.log(error);
      ToastNotify({
        msg: "Failed to upload logo",
        title: "Oops!",
      });
      setLoading(false);
      return;
    }
    console.log(data.fullPath);
    dispatch({
      type: "UPDATE_WORKSPACE",
      payload: {
        workspaceId,
        workspace: {
          logo: data.path,
        },
      },
    });
    try {
      await updateWorkspace({ logo: data.path, id: workspaceId });
    } catch (err) {
      console.log("Database failure : ", err);
      ToastNotify({
        msg: "Failed to upload logo",
        title: "Oops!",
      });
      return;
    }
    ToastNotify({
      msg: "Logo uploaded successfully",
      title: "Success",
    });
    setLoading(false);
    router.refresh();
  };

  const addCollaborator = (user: USER) => {
    setCollaborators([...collaborators, user]);
    router.refresh();
  };
  const removeCollaborator = async (user: USER) => {
    if (!workspaceId) return;
    if (collaborators.length === 1) {
      setPermission("private");
    }
    await removeCollaborators([user], workspaceId);
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };
  const handleSubmit = async () => {
    if (!workspaceId) return;
    const res = await deleteWorkspace(workspaceId);
    if (!res) {
      ToastNotify({
        msg: "Failed to delete workspace",
        title: "Oops!",
      });
      return;
    }
    ToastNotify({
      msg: "Workspace deleted successfully",
      title: "Success",
    });
    setClose();
    router.replace("/dashboard");
  };

  const getWorkspaceData = () => {
    const data = state.workspaces.find((w) => w.id === workspaceId);
    if (data) {
      setWorkspaceData(data);
    } else {
      setWorkspaceData(undefined);
    }
  };
  useEffect(() => {
    getWorkspaceData();
  }, [workspaceId, state]);
  useEffect(() => {
    if (workspaceData?.logo) {
      const supabase = createClient();
      const path = supabase.storage
        .from("nebula-workspace")
        .getPublicUrl(workspaceData.logo)?.data?.publicUrl;

      setWorkspaceLogo(path);
    }
  }, [workspaceData]);
  return {
    permission,
    setPermission,
    changeWorkspaceName,
    collaborators,
    setCollaborators,
    alert,
    setAlert,
    workspaceData,
    setWorkspaceData,
    timerRef,
    loading,
    changeWorkspaceLogo,
    workspaceId,
    addCollaborator,
    handleSubmit,
    removeCollaborator,
    workspaceLogo
  };
};
